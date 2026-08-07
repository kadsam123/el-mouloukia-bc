import { describe, expect, it } from 'vitest';
import { computeEvaluationKpis } from './admin.kpis';

describe('computeEvaluationKpis', () => {
  it('calculates approval and correction rates from reviewed runs', () => {
    const result = computeEvaluationKpis({
      workflowRuns: [
        { state: 'approved' },
        { state: 'completed' },
        { state: 'rejected' }
      ],
      interactions: [],
      outcomes: []
    });

    expect(result.approvalRate).toBe(67);
    expect(result.correctionRate).toBe(33);
  });

  it('calculates response rate from resolved outcomes against outbound interactions', () => {
    const result = computeEvaluationKpis({
      workflowRuns: [],
      interactions: [{ direction: 'outbound' }, { status: 'sent' }, { direction: 'inbound' }],
      outcomes: [{ result: 'resolved' }]
    });

    expect(result.responseRate).toBe(50);
    expect(result.interactionsCount).toBe(3);
    expect(result.outcomesCount).toBe(1);
  });
});