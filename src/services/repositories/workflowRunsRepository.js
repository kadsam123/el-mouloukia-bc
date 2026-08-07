import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';
import { ensureWorkflowTransition, WORKFLOW_STATES } from '../../domain/workflows/workflow.rules.js';

const WORKFLOW_RUNS_PATH = ['artifacts', appId, 'public', 'data', 'workflow_runs'];

export async function createWorkflowRun(payload) {
  const workflowRunRef = collection(db, ...WORKFLOW_RUNS_PATH);

  return addDoc(workflowRunRef, {
    workflowType: payload.workflowType || 'action_execution',
    subjectType: payload.subjectType || 'workflow',
    subjectId: payload.subjectId || 'unspecified',
    state: payload.state || WORKFLOW_STATES.NEW,
    currentStep: payload.currentStep || 'initialized',
    proposedActions: payload.proposedActions || [],
    approvedActions: payload.approvedActions || [],
    failedActions: payload.failedActions || [],
    metadata: payload.metadata || {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function transitionWorkflowRunState(workflowRunId, nextState, metadata = {}) {
  const workflowRunDoc = doc(db, ...WORKFLOW_RUNS_PATH, workflowRunId);
  const snapshot = await getDoc(workflowRunDoc);

  if (!snapshot.exists()) {
    throw new Error(`Workflow run not found: ${workflowRunId}`);
  }

  const currentState = snapshot.data()?.state;
  ensureWorkflowTransition(currentState, nextState);

  return updateDoc(workflowRunDoc, {
    state: nextState,
    currentStep: metadata.currentStep || nextState,
    transitionMetadata: metadata,
    updatedAt: serverTimestamp()
  });
}

export async function appendWorkflowAction(workflowRunId, bucket, actionRecord) {
  const workflowRunDoc = doc(db, ...WORKFLOW_RUNS_PATH, workflowRunId);
  return updateDoc(workflowRunDoc, {
    [bucket]: arrayUnion({
      ...actionRecord,
      timestamp: new Date().toISOString()
    }),
    updatedAt: serverTimestamp()
  });
}

export async function approveWorkflowRun(workflowRunId, approval = {}) {
  if (!approval.operatorId) {
    throw new Error('operatorId is required to approve a workflow run.');
  }

  await appendWorkflowAction(workflowRunId, 'approvedActions', {
    actionName: approval.actionName || 'human_gate_approval',
    approvedBy: approval.operatorId,
    note: approval.note || ''
  });

  return transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.APPROVED, {
    currentStep: 'approved:human_gate',
    approvedBy: approval.operatorId
  });
}

export async function rejectWorkflowRun(workflowRunId, rejection = {}) {
  if (!rejection.operatorId) {
    throw new Error('operatorId is required to reject a workflow run.');
  }

  await appendWorkflowAction(workflowRunId, 'failedActions', {
    actionName: rejection.actionName || 'human_gate_rejection',
    rejectedBy: rejection.operatorId,
    note: rejection.note || ''
  });

  return transitionWorkflowRunState(workflowRunId, WORKFLOW_STATES.REJECTED, {
    currentStep: 'rejected:human_gate',
    rejectedBy: rejection.operatorId
  });
}

export function subscribeWorkflowRuns(onWorkflowRuns, options = {}) {
  const workflowRunsRef = collection(db, ...WORKFLOW_RUNS_PATH);
  const maxItems = options.maxItems ?? 20;
  const workflowQuery = query(workflowRunsRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(workflowQuery, (snapshot) => {
    const runs = snapshot.docs.slice(0, maxItems).map((snap) => ({
      id: snap.id,
      ...snap.data()
    }));
    onWorkflowRuns(runs);
  });
}