import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { appId, db } from '../firebase/clientApp.js';

const expertsCollectionPath = ['artifacts', appId, 'public', 'data', 'experts'];

export function subscribeExperts(onExperts) {
  const expertsCollection = collection(db, ...expertsCollectionPath);
  return onSnapshot(expertsCollection, (snapshot) => {
    const experts = snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
    onExperts(experts);
  });
}

export async function createExpert(payload) {
  return addDoc(collection(db, ...expertsCollectionPath), {
    ...payload,
    createdAt: serverTimestamp()
  });
}

export async function updateExpert(expertId, payload) {
  return updateDoc(doc(db, ...expertsCollectionPath, expertId), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function updateExpertAnalysis(expertId, aiAnalysis) {
  return updateDoc(doc(db, ...expertsCollectionPath, expertId), {
    aiAnalysis,
    analyzedAt: serverTimestamp()
  });
}

export async function removeExpert(expertId) {
  return deleteDoc(doc(db, ...expertsCollectionPath, expertId));
}
