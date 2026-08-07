import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const BRIEFS_COLLECTION_PATH = ['artifacts', appId, 'public', 'data', 'platform_briefs'];

function normalizeBrief(snap) {
  const data = snap.data() || {};
  const timestamp = data.timestamp || data.createdAt || null;

  return {
    id: snap.id,
    ...data,
    timestamp,
    timestampLabel: typeof timestamp?.toDate === 'function'
      ? timestamp.toDate().toISOString()
      : (typeof timestamp === 'string' ? timestamp : null)
  };
}

export function subscribeToLatestBriefs(callback, options = {}) {
  const maxItems = Number.isFinite(options.maxItems) ? Math.max(1, options.maxItems) : 20;
  const briefsCollection = collection(db, ...BRIEFS_COLLECTION_PATH);
  const briefsQuery = query(briefsCollection, orderBy('timestamp', 'desc'));

  return onSnapshot(
    briefsQuery,
    (snapshot) => {
      const briefs = snapshot.docs.slice(0, maxItems).map(normalizeBrief);
      callback(briefs);
    },
    (error) => {
      console.error('[briefsRepository] stream failed:', error);
      callback([]);
    }
  );
}
