import { createPublicClient, createWalletClient, http, type Address, type Hex } from 'viem';
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

export async function createFacetClients(config: {
  rpcUrl: string;
  privateKey?: Hex;
  addresses: ContractAddresses;
  receiptRpcUrl?: string;
}) {
  const publicClient = createPublicClient({ chain: avalancheFuji, transport: http(config.rpcUrl, { timeout: 15_000 }) });
  await assertFuji(publicClient);
  const account = config.privateKey ? privateKeyToAccount(config.privateKey) : undefined;
  const walletClient = account ? createWalletClient({ account, chain: avalancheFuji, transport: http(config.rpcUrl, { timeout: 15_000 }) }) : undefined;
  const receiptClient = config.receiptRpcUrl
    ? createPublicClient({ chain: avalancheFuji, transport: http(config.receiptRpcUrl, { timeout: 15_000 }) })
    : publicClient;
  if (config.receiptRpcUrl) await assertFuji(receiptClient);
  return { publicClient, walletClient, receiptClient, account, addresses: config.addresses };
}

export type FacetClients = Awaited<ReturnType<typeof createFacetClients>>;

export async function confirmedTransaction(client: FacetClients['publicClient'], hash: Hex) {
  const receipt = await client.waitForTransactionReceipt({ hash, timeout: 60_000 });
  if (receipt.status !== 'success') throw new Error(`TRANSACTION_REVERTED:${hash}`);
  return { hash, blockNumber: receipt.blockNumber, status: receipt.status };
}
