import { getTopExpertMatches } from '../../domain/matches/match.rules.js';
import { validateExpertPayload } from '../../domain/experts/expert.validators.js';
import { validateBottleneckPayload } from '../../domain/bottlenecks/bottleneck.validators.js';
import { createExpert } from '../repositories/expertsRepository.js';
import { createHurdle } from '../repositories/bottlenecksRepository.js';
import { recordInteraction } from '../repositories/interactionsRepository.js';
import { recordOutcome } from '../repositories/outcomesRepository.js';
import { logAuditEvent } from '../repositories/auditEventsRepository.js';
import {
  appendWorkflowAction,
  createWorkflowRun,
  transitionWorkflowRunState
} from '../repositories/workflowRunsRepository.js';
import { saveAgentExecutionProof } from '../../repositories/agentLogsRepository.js';
import { logXPrizeTransaction } from '../../repositories/ledgerRepository.js';
import { WORKFLOW_STATES } from '../../domain/workflows/workflow.rules.js';

export const ACTIONS = {
  CREATE_EXPERT_DRAFT: 'createExpertDraft',
  NORMALIZE_BOTTLENECK: 'normalizeBottleneck',
  SCORE_CANDIDATE_MATCHES: 'scoreCandidateMatches',
  REQUEST_APPROVAL: 'requestApproval',
  RECORD_LEDGER_TRANSACTION: 'recordLedgerTransaction',
  RECORD_INTERACTION: 'recordInteraction',
  RECORD_OUTCOME: 'recordOutcome'
};

function ensureObject(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Action input must be an object.');
  }
}

function runScoringAction(input) {
  ensureObject(input);
  const experts = Array.isArray(input.experts) ? input.experts : [];
  const hurdle = input.hurdle || null;

  if (!hurdle) {
    throw new Error('scoreCandidateMatches requires hurdle input.');
  }

  const scored = getTopExpertMatches(experts, hurdle, input.options || {});
  return {
    ok: true,
    candidates: scored,
    candidateCount: scored.length,
    sourceCount: experts.length
  };
}

function runApprovalAction(input) {
  ensureObject(input);

  if (!input.subjectType || !input.subjectId || !input.proposedAction) {
    throw new Error('requestApproval requires subjectType, subjectId, and proposedAction.');
  }

  return {
    ok: true,
    approval: {
      status: 'pending_approval',
      requiredRole: input.requiredRole || 'operator',
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      proposedAction: input.proposedAction,
      reason: input.reason || ''
    }
  };
}

function buildActionHandlers(deps) {
  return {
    [ACTIONS.CREATE_EXPERT_DRAFT]: async (input) => {
      ensureObject(input);
      const allowedSectors = input.allowedSectors || [];
      const validation = validateExpertPayload(input.payload || {}, { allowedSectors });

      if (!validation.isValid) {
        return {
          ok: false,
          errors: validation.errors,
          draft: validation.payload
        };
      }

      const ref = await deps.createExpert(validation.payload);
      return {
        ok: true,
        draft: validation.payload,
        id: ref?.id ?? null
      };
    },

    [ACTIONS.NORMALIZE_BOTTLENECK]: async (input) => {
      ensureObject(input);
      const allowedSectors = input.allowedSectors || [];
      const validation = validateBottleneckPayload(input.payload || {}, { allowedSectors });

      if (!validation.isValid) {
        return {
          ok: false,
          errors: validation.errors,
          normalized: validation.payload
        };
      }

      if (input.persist === true) {
        const ref = await deps.createHurdle(validation.payload);
        return {
          ok: true,
          normalized: validation.payload,
          id: ref?.id ?? null
        };
      }

      return {
        ok: true,
        normalized: validation.payload,
        id: null
      };
    },

    [ACTIONS.SCORE_CANDIDATE_MATCHES]: async (input) => {
      return runScoringAction(input);
    },

    [ACTIONS.REQUEST_APPROVAL]: async (input) => {
      return runApprovalAction(input);
    },

    [ACTIONS.RECORD_LEDGER_TRANSACTION]: async (input) => {
      ensureObject(input);
      const result = await deps.logXPrizeTransaction(
        input.matchId,
        input.revenueUSD,
        input.costsUSD,
        input.relatedParty
      );

      return {
        ok: result.ok,
        ledger: result
      };
    },

    [ACTIONS.RECORD_INTERACTION]: async (input) => {
      ensureObject(input);
      const ref = await deps.recordInteraction(input);
      return {
        ok: true,
        id: ref?.id ?? null,
        interaction: {
          matchId: input.matchId,
          status: input.status || 'logged'
        }
      };
    },

    [ACTIONS.RECORD_OUTCOME]: async (input) => {
      ensureObject(input);
      const ref = await deps.recordOutcome(input);
      return {
        ok: true,
        id: ref?.id ?? null,
        outcome: {
          matchId: input.matchId,
          result: input.result || 'unknown'
        }
      };
    }
  };
}

export function createActionRegistry(overrides = {}) {
  const deps = {
    createExpert,
    createHurdle,
    recordInteraction,
    recordOutcome,
    logAuditEvent,
    appendWorkflowAction,
    createWorkflowRun,
    transitionWorkflowRunState,
    saveAgentExecutionProof,
    logXPrizeTransaction,
    ...overrides
  };

  const handlers = buildActionHandlers(deps);
  const syncHandlers = {
    [ACTIONS.SCORE_CANDIDATE_MATCHES]: runScoringAction,
    [ACTIONS.REQUEST_APPROVAL]: runApprovalAction
  };

  async function writeAudit(actionName, input, output, context) {
    const confidenceScore = Number.isFinite(input?.confidenceScore)
      ? input.confidenceScore
      : (output?.candidates?.[0]?.confidenceScore ?? 0);

    const proof = await deps.saveAgentExecutionProof(
      context.agentName || 'orchestration-agent',
      context.taskId || actionName,
      {
        actionName,
        input,
        context
      },
      output,
      confidenceScore
    );

    const auditEvent = await deps.logAuditEvent({
      actorType: 'agent',
      actorId: context.agentName || 'orchestration-agent',
      action: actionName,
      subjectType: context.subjectType || 'workflow',
      subjectId: context.subjectId || context.taskId || actionName,
      inputRef: {
        taskId: context.taskId || actionName
      },
      outputRef: {
        proofId: proof?.id || null,
        trackingId: proof?.trackingId || null
      },
      status: output?.ok === false ? 'failed' : 'completed',
      metadata: {
        candidateCount: output?.candidateCount ?? 0
      }
    });

    return {
      ok: proof?.ok === true,
      trackingId: proof?.trackingId || null,
      proofId: proof?.id || null,
      auditEventId: auditEvent?.id || null,
      error: proof?.ok === true ? null : (proof?.error || 'Audit write failed.')
    };
  }

  async function execute(actionName, input = {}, context = {}) {
    const handler = handlers[actionName];

    if (!handler) {
      throw new Error(`Unknown action: ${actionName}`);
    }

    const workflowRun = await deps.createWorkflowRun({
      workflowType: 'action_execution',
      subjectType: context.subjectType || 'workflow',
      subjectId: context.subjectId || context.taskId || actionName,
      state: WORKFLOW_STATES.NEW,
      currentStep: `action:${actionName}`,
      metadata: {
        agentName: context.agentName || 'orchestration-agent'
      }
    });
    const workflowRunId = workflowRun?.id || null;

    if (workflowRunId) {
      await deps.transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.PROPOSAL_CREATED, {
        currentStep: `proposal:${actionName}`
      });
      await deps.appendWorkflowAction(workflowRunId, 'proposedActions', {
        actionName,
        status: 'proposed',
        input
      });
    }

    const output = await handler(input);

    if (workflowRunId) {
      if (output?.ok === false) {
        await deps.appendWorkflowAction(workflowRunId, 'failedActions', {
          actionName,
          status: 'failed',
          output
        });
        await deps.transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.FAILED, {
          currentStep: `failed:${actionName}`
        });
      } else if (actionName === ACTIONS.REQUEST_APPROVAL) {
        await deps.transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.PENDING_APPROVAL, {
          currentStep: `approval:${actionName}`
        });
      } else {
        await deps.appendWorkflowAction(workflowRunId, 'approvedActions', {
          actionName,
          status: 'completed',
          outputSummary: {
            ok: output?.ok ?? true,
            candidateCount: output?.candidateCount ?? 0
          }
        });
        await deps.transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.COMPLETED, {
          currentStep: `completed:${actionName}`
        });
      }
    }

    const shouldAudit = context.enableAudit !== false;
    const audit = shouldAudit
      ? await writeAudit(actionName, input, output, context)
      : {
        ok: false,
        trackingId: null,
        proofId: null,
        auditEventId: null,
        error: null,
        skipped: true
      };

    return {
      actionName,
      output,
      workflow: {
        workflowRunId,
        state: actionName === ACTIONS.REQUEST_APPROVAL
          ? WORKFLOW_STATES.PENDING_APPROVAL
          : (output?.ok === false ? WORKFLOW_STATES.FAILED : WORKFLOW_STATES.COMPLETED)
      },
      audit
    };
  }

  function executeSync(actionName, input = {}, context = {}) {
    const handler = syncHandlers[actionName];

    if (!handler) {
      throw new Error(`Sync execution unsupported for action: ${actionName}`);
    }

    const output = handler(input);
    const shouldAudit = context.enableAudit === true;

    return {
      actionName,
      output,
      workflow: {
        workflowRunId: null,
        state: null
      },
      audit: {
        ok: false,
        trackingId: null,
        proofId: null,
        auditEventId: null,
        error: shouldAudit ? 'Sync execution does not persist audit logs. Use execute for auditable actions.' : null,
        skipped: true
      }
    };
  }

  return {
    actions: Object.values(ACTIONS),
    execute,
    executeSync
  };
}
