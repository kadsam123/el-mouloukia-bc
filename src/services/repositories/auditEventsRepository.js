import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const AUDIT_EVENTS_PATH = ['artifacts', appId, 'public', 'data', 'audit_events'];

export async function logAuditEvent(payload) {
  const auditRef = collection(db, ...AUDIT_EVENTS_PATH);

  const documentRef = await addDoc(auditRef, {
    actorType: payload.actorType || 'agent',
    actorId: payload.actorId || 'orchestration-agent',
    action: payload.action || 'unknown',
    subjectType: payload.subjectType || 'workflow',
    subjectId: payload.subjectId || payload.taskId || 'unspecified',
    inputRef: payload.inputRef || null,
    outputRef: payload.outputRef || null,
    status: payload.status || 'completed',
    metadata: payload.metadata || {},
    createdAt: serverTimestamp()
  });

  return documentRef;
}

export function subscribeAuditEvents(onAuditEvents, options = {}) {
  const auditRef = collection(db, ...AUDIT_EVENTS_PATH);
  const maxItems = options.maxItems ?? 20;
  const auditQuery = query(auditRef, orderBy('createdAt', 'desc'));

  return onSnapshot(auditQuery, (snapshot) => {
    const events = snapshot.docs.slice(0, maxItems).map((snap) => ({
      id: snap.id,
      ...snap.data()
    }));
    onAuditEvents(events);
  });
}