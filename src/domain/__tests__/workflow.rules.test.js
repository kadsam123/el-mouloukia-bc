import { describe, expect, it } from 'vitest';
import { WORKFLOW_STATES, ensureWorkflowTransition, isWorkflowTransitionAllowed } from '../workflows/workflow.rules';

describe('workflow rules', () => {
  it('allows valid transitions', () => {
    expect(isWorkflowTransitionAllowed(WORKFLOW_STATES.NEW, WORKFLOW_STATES.PROPOSAL_CREATED)).toBe(true);
    expect(isWorkflowTransitionAllowed(WORKFLOW_STATES.PROPOSAL_CREATED, WORKFLOW_STATES.PENDING_APPROVAL)).toBe(true);
    expect(isWorkflowTransitionAllowed(WORKFLOW_STATES.APPROVED, WORKFLOW_STATES.COMPLETED)).toBe(true);
  });

  it('blocks invalid transitions', () => {
    expect(isWorkflowTransitionAllowed(WORKFLOW_STATES.NEW, WORKFLOW_STATES.APPROVED)).toBe(false);
    expect(() => ensureWorkflowTransition(WORKFLOW_STATES.NEW, WORKFLOW_STATES.APPROVED)).toThrow(
      'Invalid workflow transition: new -> approved'
    );
  });
});