import { keccak256, stringToHex, type Hex } from 'viem';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA = /^sha256:([0-9a-f]{64})$/i;

export function uuidKey(uuid: string): Hex {
  if (!UUID.test(uuid)) throw new Error('Invalid UUID');
  return keccak256(stringToHex(uuid));
}

export function rawSha256(hash: string): Hex {
  const match = SHA.exec(hash);
  if (!match) throw new Error('Invalid SHA-256 hash');
  return `0x${match[1]}` as Hex;
}
