import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const logTransactionMetric = async (db, matchId, metrics) => {
  const ledgerRef = collection(db, 'artifacts', 'el-mouloukia-bc', 'public', 'data', 'ledger');

  return await addDoc(ledgerRef, {
    matchId,
    armsLengthRevenueUSD: parseFloat(metrics.revenueUSD) || 0,
    operationalCostsUSD: parseFloat(metrics.costsUSD) || 0,
    agentLogReference: metrics.logId || 'manual_override',
    timestamp: serverTimestamp()
  });
};
