import { GoogleGenAI } from '@google/genai';
import { getEffectiveReliabilityPolicy, readRuntimeEnv } from '../../config/policyConfig.js';
import { parseExpertInsightResponse } from './parsers/expertInsightParser.js';
import { agentResponseSchema, V2_AGENT_RESPONSE_SCHEMA, validateV2AgentResponse } from './parsers/agentResponseSchema.js';
import { buildExpertInsightPrompt } from './prompts/expertInsightPrompt.js';

const GEMINI_MODEL = 'gemini-2.5-flash';
const EFFECTIVE_POLICY = getEffectiveReliabilityPolicy();
const POLICY_AI = EFFECTIVE_POLICY.ai;
const MAX_GENERATE_ATTEMPTS = POLICY_AI.maxAttempts;
const BASE_BACKOFF_MS = POLICY_AI.backoffBaseIntervalMs;
const TOTAL_TIME_BUDGET_MS = POLICY_AI.totalTimeBudgetMs;
const UNAVAILABILITY_BEHAVIOR = POLICY_AI.unavailabilityBehavior;
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

const expertInsightResponseSchema = {
  type: 'object',
  properties: {
    score: {
      type: 'integer',
      minimum: 1,
      maximum: 10
    },
    refined_pitch: {
      type: 'string'
    },
    market_fit: {
      type: 'string'
    },
    badge: {
      type: 'string'
    }
  },
  required: ['score', 'refined_pitch', 'market_fit', 'badge']
};

function getGeminiApiKey() {
  return readRuntimeEnv('VITE_GEMINI_API_KEY') || readRuntimeEnv('GEMINI_API_KEY') || '';
}

function getGeminiClient() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY');
  }

  return new GoogleGenAI({ apiKey });
}

function readTextFromGeminiResponse(response) {
  const directText = typeof response?.text === 'function' ? response.text() : response?.text;
  if (directText) {
    return directText;
  }

  const partText = response?.candidates?.[0]?.content?.parts?.find((part) => typeof part?.text === 'string')?.text;
  if (partText) {
    return partText;
  }

  throw new Error('Gemini returned an empty response');
}

function safeParseJson(rawText) {
  try {
    return {
      ok: true,
      value: JSON.parse(rawText)
    };
  } catch {
    return {
      ok: false,
      value: null
    };
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function toObject(value) {
  return value && typeof value === 'object' ? value : null;
}

function extractGeminiErrorDetails(error) {
  const errorObject = toObject(error);
  const nested = toObject(errorObject?.error);
  const message = String(errorObject?.message || nested?.message || '').trim();

  let parsedFromMessage = null;
  if (message.startsWith('{') && message.endsWith('}')) {
    const parsed = safeParseJson(message);
    if (parsed.ok) {
      parsedFromMessage = parsed.value;
    }
  }

  const parsedError = toObject(parsedFromMessage?.error);
  const directCode = Number(errorObject?.code || nested?.code);
  const parsedCode = Number(parsedError?.code);
  const lastErrorCode = Number.isFinite(directCode)
    ? directCode
    : (Number.isFinite(parsedCode) ? parsedCode : null);

  const lastErrorStatus = String(
    errorObject?.status
      || nested?.status
      || parsedError?.status
      || ''
  ).trim() || null;

  const retryable = RETRYABLE_STATUS_CODES.has(lastErrorCode);

  return {
    lastErrorCode,
    lastErrorStatus,
    retryable,
    message: message || String(error)
  };
}

function computeBackoffMs(attempt) {
  const exponent = Math.max(0, attempt - 1);
  const jitter = Math.floor(Math.random() * 125);
  return (BASE_BACKOFF_MS * (2 ** exponent)) + jitter;
}

function nowMs() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

function normalizeAgentPathwayPayload(payload) {
  const rawMilestones = Array.isArray(payload?.milestones)
    ? payload.milestones
    : (typeof payload?.milestones === 'string' ? [payload.milestones] : []);

  return {
    mode: V2_AGENT_RESPONSE_SCHEMA.mode,
    confidenceScore: Number.isFinite(Number(payload?.confidenceScore))
      ? Number(payload.confidenceScore)
      : 0.8,
    milestones: rawMilestones
      .map((item) => (item || '').toString().trim())
      .filter(Boolean),
    rationale: (payload?.rationale || '').toString().trim()
  };
}

export async function generateExpertInsight({ brand, marketName, marketFocus, expert }) {
  const ai = getGeminiClient();

  const { systemPrompt, profileText } = buildExpertInsightPrompt({
    brand,
    marketName,
    marketFocus,
    expert
  });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: profileText }] }],
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: expertInsightResponseSchema
    }
  });

  const raw = readTextFromGeminiResponse(response);

  const parsed = parseExpertInsightResponse(raw);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }

  return parsed.data;
}

export async function generateAgentEnrichedPathway({ hurdle, expert, candidates }) {
  const ai = getGeminiClient();

  const prompt = [
    'Return only valid JSON that matches the provided response schema.',
    'Build a concrete remediation pathway for this industrial bottleneck and top expert candidate.',
    'Use concise, operational milestones with clear timeline anchors.',
    'Hurdle:',
    JSON.stringify(hurdle),
    'TopExpert:',
    JSON.stringify(expert || null),
    'CandidateSet:',
    JSON.stringify(candidates || [])
  ].join('\n');

  let response;
  let attempts = 0;
  let lastErrorCode = null;
  let lastErrorStatus = null;
  let lastMessage = '';
  const startedAt = nowMs();

  while (attempts < MAX_GENERATE_ATTEMPTS) {
    attempts += 1;
    try {
      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: agentResponseSchema
        }
      });
      break;
    } catch (error) {
      const details = extractGeminiErrorDetails(error);
      lastErrorCode = details.lastErrorCode;
      lastErrorStatus = details.lastErrorStatus;
      lastMessage = details.message;

      const backoffMs = computeBackoffMs(attempts);
      const elapsedMs = nowMs() - startedAt;
      const withinTimeBudget = (elapsedMs + backoffMs) <= TOTAL_TIME_BUDGET_MS;
      const canRetry = details.retryable && attempts < MAX_GENERATE_ATTEMPTS && withinTimeBudget;
      if (!canRetry) {
        const finalError = new Error(lastMessage || 'Gemini pathway generation failed.');
        finalError.attempts = attempts;
        finalError.lastErrorCode = lastErrorCode;
        finalError.lastErrorStatus = lastErrorStatus;
        finalError.model = GEMINI_MODEL;
        finalError.retryExhausted = details.retryable;
        finalError.elapsedMs = Number(elapsedMs.toFixed(2));
        finalError.totalTimeBudgetMs = TOTAL_TIME_BUDGET_MS;
        finalError.unavailabilityBehavior = UNAVAILABILITY_BEHAVIOR;
        throw finalError;
      }

      await sleep(backoffMs);
    }
  }

  if (!response) {
    const finalError = new Error(lastMessage || 'Gemini pathway generation failed with no response.');
    finalError.attempts = attempts;
    finalError.lastErrorCode = lastErrorCode;
    finalError.lastErrorStatus = lastErrorStatus;
    finalError.model = GEMINI_MODEL;
    finalError.retryExhausted = true;
    finalError.elapsedMs = Number((nowMs() - startedAt).toFixed(2));
    finalError.totalTimeBudgetMs = TOTAL_TIME_BUDGET_MS;
    finalError.unavailabilityBehavior = UNAVAILABILITY_BEHAVIOR;
    throw finalError;
  }

  const raw = readTextFromGeminiResponse(response);
  const parsed = safeParseJson(raw);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== 'object') {
    throw new Error('Gemini pathway response is not valid JSON.');
  }

  const normalized = normalizeAgentPathwayPayload(parsed.value);
  const validation = validateV2AgentResponse(normalized);
  if (!validation.valid) {
    throw new Error(`Gemini pathway schema mismatch: ${validation.errors.join(' | ')}`);
  }

  return {
    ...normalized,
    meta: {
      model: GEMINI_MODEL,
      attempts,
      lastErrorCode,
      lastErrorStatus
    }
  };
}
