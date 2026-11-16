import { expect, test } from 'vitest';
import { submitAndConfirm } from '../src/transactions.js';

const HASH = `0x${'ab'.repeat(32)}` as const;

test('reconciles a known hash without broadcasting a second write', async () => {
  let writes = 0;
  const result = await submitAndConfirm(async () => { writes++; return HASH; }, async () => ({ status: 'success' as const, blockNumber: 42n }), HASH);
  expect(writes).toBe(0);
  expect(result).toEqual({ hash: HASH, status: 'CONFIRMED', blockNumber: 42n });
});

test('keeps broadcast hash pending when receipt lookup is uncertain', async () => {
  let writes = 0;
  const result = await submitAndConfirm(async () => { writes++; return HASH; }, async () => { throw new Error('RPC timeout'); });
  expect(writes).toBe(1);
  expect(result).toEqual({ hash: HASH, status: 'PENDING' });
});

test('rejects a transaction receipt that reverted', async () => {
  await expect(submitAndConfirm(async () => HASH, async () => ({ status: 'reverted' as const, blockNumber: 42n }))).rejects.toThrow('TRANSACTION_REVERTED');
});
