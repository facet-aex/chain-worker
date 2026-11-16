import { expect, test } from 'vitest';
import { receiptChainFor } from '../src/client.js';

test('pins optional receipt RPC to its own Avalanche L1 chain ID', () => {
  const chain = receiptChainFor('https://receipt.example/rpc', 12345);
  expect(chain.id).toBe(12345);
  expect(chain.rpcUrls.default.http).toEqual(['https://receipt.example/rpc']);
});

test('requires an explicit chain ID when receipt RPC differs from Fuji', () => {
  expect(() => receiptChainFor('https://receipt.example/rpc')).toThrow('RECEIPT_CHAIN_ID_REQUIRED');
});
