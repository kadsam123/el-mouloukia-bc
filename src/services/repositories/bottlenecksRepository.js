import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const hurdlesCollectionPath = ['artifacts', appId, 'public', 'data', 'hurdles'];

export function subscribeHurdles(onHurdles) {
  const hurdlesCollection = collection(db, ...hurdlesCollectionPath);
  return onSnapshot(hurdlesCollection, (snapshot) => {
    const hurdles = snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
    onHurdles(hurdles);
  });
}

export async function createHurdle(payload) {
  return addDoc(collection(db, ...hurdlesCollectionPath), {
    ...payload,
    createdAt: serverTimestamp(),
    schemaVersion: payload.schemaVersion
  });
}

export async function updateHurdle(hurdleId, payload) {
  return updateDoc(doc(db, ...hurdlesCollectionPath, hurdleId), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function removeHurdle(hurdleId) {
  return deleteDoc(doc(db, ...hurdlesCollectionPath, hurdleId));
}
