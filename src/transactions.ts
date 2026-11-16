import type { Hex } from 'viem';

export type ChainWriteResult =
  | { hash: Hex; status: 'CONFIRMED'; blockNumber: bigint }
  | { hash: Hex; status: 'PENDING' };

export async function submitAndConfirm(
  broadcast: () => Promise<Hex>,
  wait: (hash: Hex) => Promise<{ status: 'success' | 'reverted'; blockNumber: bigint }>,
  existingHash?: Hex,
): Promise<ChainWriteResult> {
  const hash = existingHash ?? await broadcast();
  let receipt: { status: 'success' | 'reverted'; blockNumber: bigint };
  try {
    receipt = await wait(hash);
  } catch {
    return { hash, status: 'PENDING' };
  }
  if (receipt.status !== 'success') throw new Error(`TRANSACTION_REVERTED:${hash}`);
  return { hash, status: 'CONFIRMED', blockNumber: receipt.blockNumber };
}
