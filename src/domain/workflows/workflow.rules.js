const WORKFLOW_STATES = {
  NEW: 'new',
  PROPOSAL_CREATED: 'proposal_created',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const ALLOWED_TRANSITIONS = {
  [WORKFLOW_STATES.NEW]: [WORKFLOW_STATES.PROPOSAL_CREATED, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.PROPOSAL_CREATED]: [
    WORKFLOW_STATES.PENDING_APPROVAL,
    WORKFLOW_STATES.COMPLETED,
    WORKFLOW_STATES.FAILED
  ],
  [WORKFLOW_STATES.PENDING_APPROVAL]: [
    WORKFLOW_STATES.APPROVED,
    WORKFLOW_STATES.REJECTED,
    WORKFLOW_STATES.FAILED
  ],
  [WORKFLOW_STATES.APPROVED]: [WORKFLOW_STATES.COMPLETED, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.REJECTED]: [],
  [WORKFLOW_STATES.COMPLETED]: [],
  [WORKFLOW_STATES.FAILED]: []
};

export { WORKFLOW_STATES };

export function isWorkflowTransitionAllowed(currentState, nextState) {
  const allowed = ALLOWED_TRANSITIONS[currentState] || [];
  return allowed.includes(nextState);
}

export function ensureWorkflowTransition(currentState, nextState) {
  if (!isWorkflowTransitionAllowed(currentState, nextState)) {
    throw new Error(`Invalid workflow transition: ${currentState} -> ${nextState}`);
  }

  return true;
}