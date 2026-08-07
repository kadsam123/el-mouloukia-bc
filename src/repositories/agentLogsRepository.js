import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase/clientApp.js';

const AGENT_EXECUTION_LOGS_PATH = ['artifacts', 'el-mouloukia-bc', 'public', 'data', 'agent_execution_logs'];

function createTrackingId(agentName, taskId) {
  const entropy = Math.random().toString(36).slice(2, 10);
  return `${agentName || 'agent'}-${taskId || 'task'}-${Date.now()}-${entropy}`;
}

export async function saveAgentExecutionProof(agentName, taskId, inputPayload, outputPayload, confidenceScore) {
  try {
    if (!agentName || !taskId) {
      throw new Error('agentName and taskId are required');
    }

    const logsRef = collection(db, ...AGENT_EXECUTION_LOGS_PATH);
    const trackingId = createTrackingId(agentName, taskId);
    const normalizedConfidence = Number.parseFloat(confidenceScore);

    const documentRef = await addDoc(logsRef, {
      trackingId,
      agentName,
      taskId,
      inputPayload: inputPayload ?? {},
      outputPayload: outputPayload ?? {},
      confidenceScore: Number.isFinite(normalizedConfidence) ? normalizedConfidence : 0,
      executionStatus: 'completed',
      metadata: {
        proofType: 'continuous-agent-execution',
        environment: import.meta.env.MODE || 'unknown',
        source: 'production-runtime',
        heartbeat: true
      },
      timestamp: serverTimestamp()
    });

    return {
      ok: true,
      id: documentRef.id,
      trackingId,
      ref: documentRef
    };
  } catch (error) {
    return {
      ok: false,
      id: null,
      trackingId: null,
      ref: null,
      error: error?.message || 'Failed to save agent execution proof.'
    };
  }
}
