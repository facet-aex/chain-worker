import { createPublicClient, createWalletClient, defineChain, http, type Address, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';

export interface ContractAddresses {
  actorRegistry: Address;
  feeSplitAndEscrow: Address;
  receiptLog: Address;
}

export async function assertFuji(client: { getChainId(): Promise<number> }): Promise<void> {
  if (await client.getChainId() !== 43113) throw new Error('FUJI_CHAIN_MISMATCH');
}

export function receiptChainFor(rpcUrl: string, chainId?: number) {
  if (!Number.isInteger(chainId) || !chainId || chainId <= 0) throw new Error('RECEIPT_CHAIN_ID_REQUIRED');
  return defineChain({
    id: chainId,
    name: chainId === 43113 ? 'Avalanche Fuji' : 'FACET Receipt L1',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
  });
}

export async function createFacetClients(config: {
  rpcUrl: string;
  privateKey?: Hex;
  addresses: ContractAddresses;
  receiptRpcUrl?: string;
  receiptChainId?: number;
}) {
  const publicClient = createPublicClient({ chain: avalancheFuji, transport: http(config.rpcUrl, { timeout: 15_000 }) });
  await assertFuji(publicClient);
  const account = config.privateKey ? privateKeyToAccount(config.privateKey) : undefined;
  const walletClient = account ? createWalletClient({ account, chain: avalancheFuji, transport: http(config.rpcUrl, { timeout: 15_000 }) }) : undefined;
  const receiptChain = config.receiptRpcUrl ? receiptChainFor(config.receiptRpcUrl, config.receiptChainId) : avalancheFuji;
  const receiptRpcUrl = config.receiptRpcUrl ?? config.rpcUrl;
  const receiptClient = createPublicClient({ chain: receiptChain, transport: http(receiptRpcUrl, { timeout: 15_000 }) });
  if (await receiptClient.getChainId() !== receiptChain.id) throw new Error('RECEIPT_CHAIN_MISMATCH');
  const receiptWalletClient = account ? createWalletClient({ account, chain: receiptChain, transport: http(receiptRpcUrl, { timeout: 15_000 }) }) : undefined;
  return { publicClient, walletClient, receiptClient, receiptWalletClient, account, addresses: config.addresses };
}

export type FacetClients = Awaited<ReturnType<typeof createFacetClients>>;

export async function confirmedTransaction(client: FacetClients['publicClient'], hash: Hex) {
  const receipt = await client.waitForTransactionReceipt({ hash, timeout: 60_000 });
  if (receipt.status !== 'success') throw new Error(`TRANSACTION_REVERTED:${hash}`);
  return { hash, blockNumber: receipt.blockNumber, status: receipt.status };
}
