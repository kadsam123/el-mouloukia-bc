import { beforeEach, describe, expect, it, vi } from 'vitest';

const addDocMock = vi.fn();
const collectionMock = vi.fn();
const serverTimestampMock = vi.fn(() => 'MOCK_TS');

vi.mock('firebase/firestore', () => ({
  addDoc: addDocMock,
  collection: collectionMock,
  serverTimestamp: serverTimestampMock
}));

vi.mock('../services/firebase/clientApp', () => ({
  db: { __db: 'mock-db' }
}));

describe('ledgerRepository', () => {
  beforeEach(() => {
    addDocMock.mockReset();
    collectionMock.mockReset();
    serverTimestampMock.mockClear();
    collectionMock.mockReturnValue('LEDGER_COLLECTION_REF');
  });

  it('parses transaction amounts to numerics', async () => {
    addDocMock.mockResolvedValue({ id: 'ledger-123' });
    const { logXPrizeTransaction } = await import('./ledgerRepository');

    const result = await logXPrizeTransaction('match-1', '1200.50', '300.25', 'third_party');

    expect(result.ok).toBe(true);
    expect(result.id).toBe('ledger-123');
    expect(collectionMock).toHaveBeenCalled();
    expect(addDocMock).toHaveBeenCalledWith('LEDGER_COLLECTION_REF', expect.objectContaining({
      matchId: 'match-1',
      armsLengthRevenueUSD: 1200.5,
      operationalCostsUSD: 300.25,
      relatedParty: 'third_party',
      timestamp: 'MOCK_TS'
    }));
  });

  it('fails gracefully on invalid payload', async () => {
    const { logXPrizeTransaction } = await import('./ledgerRepository');

    const result = await logXPrizeTransaction('', 'abc', null, '');

    expect(result.ok).toBe(false);
    expect(result.ref).toBeNull();
    expect(result.error).toContain('matchId');
    expect(addDocMock).not.toHaveBeenCalled();
  });
});
