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

function toStringValue(value) {
  return (value || '').toString().trim();
}

function toScore(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(1, Math.min(10, parsed));
}

export function parseExpertInsightResponse(rawText) {
  const parsed = safeParseJson(rawText);

  if (!parsed.ok || !parsed.value || typeof parsed.value !== 'object') {
    return {
      ok: false,
      error: 'Invalid JSON response from AI model.',
      data: null
    };
  }

  const score = toScore(parsed.value.score);
  const refinedPitch = toStringValue(parsed.value.refined_pitch);
  const marketFit = toStringValue(parsed.value.market_fit);
  const badge = toStringValue(parsed.value.badge);

  if (!score || !refinedPitch || !marketFit || !badge) {
    return {
      ok: false,
      error: 'AI response did not match required schema.',
      data: null
    };
  }

  return {
    ok: true,
    error: null,
    data: {
      score,
      refined_pitch: refinedPitch,
      market_fit: marketFit,
      badge
    }
  };
}