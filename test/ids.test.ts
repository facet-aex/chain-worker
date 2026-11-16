import { expect, test } from 'vitest';
import { keccak256, stringToHex } from 'viem';
import { uuidKey, rawSha256 } from '../src/ids.js';

test('hashes exact UUID bytes for on-chain identifiers', () => {
  const uuid = '019a1234-5678-7abc-8def-123456789abc';
  expect(uuidKey(uuid)).toBe(keccak256(stringToHex(uuid)));
});

test('rejects malformed UUID and SHA-256 output hashes', () => {
  expect(() => uuidKey('../bad')).toThrow();
  expect(() => rawSha256('sha256:xyz')).toThrow();
  expect(rawSha256(`sha256:${'ab'.repeat(32)}`)).toBe(`0x${'ab'.repeat(32)}`);
});
