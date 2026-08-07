import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const INTERACTIONS_PATH = ['artifacts', appId, 'public', 'data', 'interactions'];

export async function recordInteraction(payload) {
  if (!payload?.matchId) {
    throw new Error('matchId is required to record an interaction.');
  }

  const interactionsRef = collection(db, ...INTERACTIONS_PATH);
  return addDoc(interactionsRef, {
    matchId: payload.matchId,
    channel: payload.channel || 'unknown',
    direction: payload.direction || 'outbound',
    messageType: payload.messageType || 'note',
    summary: payload.summary || '',
    contentRef: payload.contentRef || null,
    status: payload.status || 'logged',
    createdBy: payload.createdBy || 'system',
    metadata: payload.metadata || {},
    createdAt: serverTimestamp()
  });
}

export function subscribeInteractions(onInteractions, options = {}) {
  const interactionsRef = collection(db, ...INTERACTIONS_PATH);
  const maxItems = options.maxItems ?? 50;
  const interactionsQuery = query(interactionsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(interactionsQuery, (snapshot) => {
    const records = snapshot.docs.slice(0, maxItems).map((snap) => ({
      id: snap.id,
      ...snap.data()
    }));

    onInteractions(records);
  });
}