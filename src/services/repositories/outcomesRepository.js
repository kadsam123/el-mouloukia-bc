import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const OUTCOMES_PATH = ['artifacts', appId, 'public', 'data', 'outcomes'];

function parseNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function recordOutcome(payload) {
  if (!payload?.matchId) {
    throw new Error('matchId is required to record an outcome.');
  }

  const outcomesRef = collection(db, ...OUTCOMES_PATH);
  return addDoc(outcomesRef, {
    matchId: payload.matchId,
    result: payload.result || 'unknown',
    economicImpact: parseNumber(payload.economicImpact),
    timeToFirstResponse: parseNumber(payload.timeToFirstResponse),
    timeToResolution: parseNumber(payload.timeToResolution),
    operatorNotes: payload.operatorNotes || '',
    createdBy: payload.createdBy || 'system',
    metadata: payload.metadata || {},
    createdAt: serverTimestamp()
  });
}

export function subscribeOutcomes(onOutcomes, options = {}) {
  const outcomesRef = collection(db, ...OUTCOMES_PATH);
  const maxItems = options.maxItems ?? 50;
  const outcomesQuery = query(outcomesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(outcomesQuery, (snapshot) => {
    const records = snapshot.docs.slice(0, maxItems).map((snap) => ({
      id: snap.id,
      ...snap.data()
    }));

    onOutcomes(records);
  });
}