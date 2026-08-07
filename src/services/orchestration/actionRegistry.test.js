import { describe, expect, it, vi } from 'vitest';
import { ACTIONS, createActionRegistry } from './actionRegistry';

function createDeps() {
  return {
    appendWorkflowAction: vi.fn(async () => undefined),
    createExpert: vi.fn(async () => ({ id: 'expert-1' })),
    createHurdle: vi.fn(async () => ({ id: 'hurdle-1' })),
    createWorkflowRun: vi.fn(async () => ({ id: 'wf-1' })),
    logAuditEvent: vi.fn(async () => ({ id: 'audit-1' })),
    logXPrizeTransaction: vi.fn(async () => ({ ok: true, id: 'ledger-1' })),
    recordInteraction: vi.fn(async () => ({ id: 'interaction-1' })),
    recordOutcome: vi.fn(async () => ({ id: 'outcome-1' })),
    saveAgentExecutionProof: vi.fn(async () => ({ ok: true, id: 'proof-1', trackingId: 'trk-1' })),
    transitionWorkflowRunState: vi.fn(async () => undefined)
  };
}

describe('actionRegistry', () => {
  it('scores candidate matches and writes execution proof', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.SCORE_CANDIDATE_MATCHES, {
      experts: [
        { id: 'e1', sector: 'it', bottleneck: 'ERP migration', gainCreator: 'warehouse automation' }
      ],
      hurdle: {
        id: 'h1',
        sector: 'it',
        title: 'Need ERP migration support',
        description: 'manufacturing system migration',
        instance: 'factory'
      },
      options: { maxResults: 3, minimumResonance: 0 }
    }, {
      agentName: 'match-strategy-agent',
      taskId: 'task-1'
    });

    expect(result.actionName).toBe(ACTIONS.SCORE_CANDIDATE_MATCHES);
    expect(result.output.ok).toBe(true);
    expect(result.output.candidateCount).toBe(1);
    expect(result.output.candidates[0]).toHaveProperty('resonance');
    expect(result.output.candidates[0]).toHaveProperty('agentTrackingId');
    expect(result.output.candidates[0]).toHaveProperty('confidenceScore');
    expect(result.audit.ok).toBe(true);
    expect(result.audit.trackingId).toBe('trk-1');
    expect(result.audit.auditEventId).toBe('audit-1');
    expect(result.workflow.workflowRunId).toBe('wf-1');
    expect(result.workflow.state).toBe('completed');
    expect(deps.saveAgentExecutionProof).toHaveBeenCalledTimes(1);
    expect(deps.logAuditEvent).toHaveBeenCalledTimes(1);
    expect(deps.createWorkflowRun).toHaveBeenCalledTimes(1);
    expect(deps.transitionWorkflowRunState).toHaveBeenCalledTimes(2);
  });

  it('returns validation errors for invalid expert draft payload', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.CREATE_EXPERT_DRAFT, {
      payload: { name: 'A' },
      allowedSectors: ['it', 'manuf']
    });

    expect(result.output.ok).toBe(false);
    expect(result.output.errors.length).toBeGreaterThan(0);
    expect(deps.createExpert).not.toHaveBeenCalled();
    expect(result.workflow.state).toBe('failed');
    expect(deps.saveAgentExecutionProof).toHaveBeenCalledTimes(1);
    expect(deps.logAuditEvent).toHaveBeenCalledTimes(1);
  });

  it('throws for unknown actions', async () => {
    const registry = createActionRegistry(createDeps());

    await expect(registry.execute('unknownAction', {})).rejects.toThrow('Unknown action');
  });

  it('records a ledger transaction through bounded action', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.RECORD_LEDGER_TRANSACTION, {
      matchId: 'match-12',
      revenueUSD: '1200',
      costsUSD: '450',
      relatedParty: 'third_party'
    });

    expect(result.output.ok).toBe(true);
    expect(result.output.ledger.id).toBe('ledger-1');
    expect(result.workflow.state).toBe('completed');
    expect(deps.logXPrizeTransaction).toHaveBeenCalledWith('match-12', '1200', '450', 'third_party');
  });

  it('supports sync execution for scoring in UI paths', () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = registry.executeSync(ACTIONS.SCORE_CANDIDATE_MATCHES, {
      experts: [
        { id: 'e1', sector: 'it', bottleneck: 'ERP migration', gainCreator: 'warehouse automation' }
      ],
      hurdle: {
        id: 'h1',
        sector: 'it',
        title: 'Need ERP migration support',
        description: 'manufacturing system migration',
        instance: 'factory'
      },
      options: { maxResults: 3, minimumResonance: 0 }
    });

    expect(result.output.ok).toBe(true);
    expect(result.output.candidateCount).toBe(1);
    expect(result.audit.skipped).toBe(true);
    expect(result.workflow.workflowRunId).toBeNull();
    expect(deps.saveAgentExecutionProof).not.toHaveBeenCalled();
    expect(deps.logAuditEvent).not.toHaveBeenCalled();
    expect(deps.createWorkflowRun).not.toHaveBeenCalled();
  });

  it('keeps request approval runs pending approval', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.REQUEST_APPROVAL, {
      subjectType: 'match',
      subjectId: 'match-11',
      proposedAction: 'send_intro',
      reason: 'requires human sign-off'
    }, {
      taskId: 'approval-1'
    });

    expect(result.output.ok).toBe(true);
    expect(result.output.approval.status).toBe('pending_approval');
    expect(result.workflow.state).toBe('pending_approval');
  });

  it('rejects unsupported sync execution actions', () => {
    const registry = createActionRegistry(createDeps());
    expect(() => registry.executeSync(ACTIONS.RECORD_LEDGER_TRANSACTION, {})).toThrow(
      'Sync execution unsupported for action: recordLedgerTransaction'
    );
  });

  it('records interaction through bounded action', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.RECORD_INTERACTION, {
      matchId: 'match-22',
      channel: 'whatsapp',
      direction: 'outbound',
      messageType: 'introduction',
      summary: 'Shared intro context',
      status: 'sent'
    });

    expect(result.output.ok).toBe(true);
    expect(result.output.id).toBe('interaction-1');
    expect(result.workflow.state).toBe('completed');
    expect(deps.recordInteraction).toHaveBeenCalledTimes(1);
  });

  it('records outcome through bounded action', async () => {
    const deps = createDeps();
    const registry = createActionRegistry(deps);

    const result = await registry.execute(ACTIONS.RECORD_OUTCOME, {
      matchId: 'match-22',
      result: 'resolved',
      economicImpact: 15000,
      timeToFirstResponse: 2,
      timeToResolution: 14,
      operatorNotes: 'Introduced expert helped close the bottleneck'
    });

    expect(result.output.ok).toBe(true);
    expect(result.output.id).toBe('outcome-1');
    expect(result.workflow.state).toBe('completed');
    expect(deps.recordOutcome).toHaveBeenCalledTimes(1);
  });
});
