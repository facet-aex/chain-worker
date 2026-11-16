import type { Address, Hex } from 'viem';
import feeAbi from './abi/FacetFeeSplitAndEscrow.json' with { type: 'json' };
import type { FacetClients } from './client.js';
import { uuidKey, rawSha256 } from './ids.js';
import { submitAndConfirm } from './transactions.js';

export interface PayerAuthorization {
  payer: Address;
  validAfter: bigint;
  validBefore: bigint;
  nonce: Hex;
  signature: Hex;
}

function write(clients: FacetClients, functionName: string, args: readonly unknown[], existingHash?: Hex) {
  if (!clients.walletClient) throw new Error('SIGNER_REQUIRED');
  return submitAndConfirm(
    () => clients.walletClient!.writeContract({ address: clients.addresses.feeSplitAndEscrow, abi: feeAbi, functionName, args }),
    (hash) => clients.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 }),
    existingHash,
  );
}

export function settlePayPerRun(clients: FacetClients, params: {
  runId: string; facetId: string; creatorPayTo: Address; amount: bigint; authorization: PayerAuthorization; existingHash?: Hex;
}) {
  const { authorization: auth } = params;
  return write(clients, 'settlePayPerRunWithAuthorization', [uuidKey(params.runId), uuidKey(params.facetId), auth.payer, params.creatorPayTo, params.amount, auth.validAfter, auth.validBefore, auth.nonce, auth.signature], params.existingHash);
}

export function depositTaskEscrow(clients: FacetClients, params: {
  runId: string; facetId: string; creatorPayTo: Address; unitPriceAtomic: bigint; maxAmount: bigint; authorization: PayerAuthorization; existingHash?: Hex;
}) {
  const { authorization: auth } = params;
  return write(clients, 'depositEscrowWithAuthorization', [uuidKey(params.runId), uuidKey(params.facetId), auth.payer, params.creatorPayTo, params.unitPriceAtomic, params.maxAmount, auth.validAfter, auth.validBefore, auth.nonce, auth.signature], params.existingHash);
}

export function settleTaskEscrow(clients: FacetClients, params: {
  runId: string; inputHash: string; outputHash: string; itemCount: bigint; runnerSignature: Hex; existingHash?: Hex;
}) {
  return write(clients, 'settleEscrow', [uuidKey(params.runId), rawSha256(params.inputHash), rawSha256(params.outputHash), params.itemCount, params.runnerSignature], params.existingHash);
}

export function refundTaskEscrow(clients: FacetClients, runId: string, existingHash?: Hex) {
  return write(clients, 'refundEscrow', [uuidKey(runId)], existingHash);
}
