import { expect, test } from 'vitest';
import { assertFuji } from '../src/client.js';
import { matchesPublishedFacet } from '../src/registry.js';

const published = {
  facetType: 1, imageDigest: `0x${'ab'.repeat(32)}`, schemaURI: 'ipfs://schema',
  pricingModel: 0, priceAtomic: 1000n, payTo: '0x0000000000000000000000000000000000000aBc',
  erc8004TokenId: 0n, active: true,
};

test('rejects an RPC connected to the wrong chain', async () => {
  await expect(assertFuji({ getChainId: async () => 1 })).rejects.toThrow('FUJI_CHAIN_MISMATCH');
  await expect(assertFuji({ getChainId: async () => 43113 })).resolves.toBeUndefined();
});

test('requires all pinned registry fields before calling a published Facet verified', () => {
  expect(matchesPublishedFacet(published, { ...published })).toBe(true);
  expect(matchesPublishedFacet({ ...published, imageDigest: `0x${'cd'.repeat(32)}` }, published)).toBe(false);
  expect(matchesPublishedFacet({ ...published, payTo: '0x0000000000000000000000000000000000000def' }, published)).toBe(false);
  expect(matchesPublishedFacet({ ...published, priceAtomic: 1001n }, published)).toBe(false);
});
