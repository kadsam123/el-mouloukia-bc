import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase/clientApp.js';

const LEDGER_PATH = ['artifacts', 'el-mouloukia-bc', 'public', 'data', 'ledger'];

function parseUsd(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function logXPrizeTransaction(matchId, revenueUSD, costsUSD, relatedParty) {
  try {
    if (!matchId) {
      throw new Error('matchId is required');
    }

    const ledgerRef = collection(db, ...LEDGER_PATH);
    const documentRef = await addDoc(ledgerRef, {
      matchId,
      armsLengthRevenueUSD: parseUsd(revenueUSD),
      operationalCostsUSD: parseUsd(costsUSD),
      relatedParty: (relatedParty || '').toString().trim() || 'unspecified',
      timestamp: serverTimestamp()
    });

    return {
      ok: true,
      id: documentRef.id,
      ref: documentRef
    };
  } catch (error) {
    return {
      ok: false,
      id: null,
      ref: null,
      error: error?.message || 'Failed to log XPRIZE transaction.'
    };
  }
}
