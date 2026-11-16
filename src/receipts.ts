import type { Hex } from 'viem';
import receiptAbi from './abi/FacetReceiptLog.json' with { type: 'json' };
import type { FacetClients } from './client.js';
import { uuidKey, rawSha256 } from './ids.js';
import { submitAndConfirm } from './transactions.js';

export async function getReceiptOnChain(clients: FacetClients, runId: string) {
  return clients.receiptClient.readContract({ address: clients.addresses.receiptLog, abi: receiptAbi, functionName: 'getReceipt', args: [uuidKey(runId)] });
}

export function recordReceiptOnChain(clients: FacetClients, params: {
  runId: string; facetId: string; inputHash: string; outputHash: string; itemCount: bigint;
  paymentTxHash: Hex; runnerSignature: Hex; existingHash?: Hex;
}) {
  if (!clients.receiptWalletClient) throw new Error('SIGNER_REQUIRED');
  return submitAndConfirm(
    () => clients.receiptWalletClient!.writeContract({
      address: clients.addresses.receiptLog,
      abi: receiptAbi,
      functionName: 'recordReceipt',
      args: [uuidKey(params.runId), uuidKey(params.facetId), rawSha256(params.inputHash), rawSha256(params.outputHash), params.itemCount, params.paymentTxHash, params.runnerSignature],
    }),
    (hash) => clients.receiptClient.waitForTransactionReceipt({ hash, timeout: 60_000 }),
    params.existingHash,
  );
}
