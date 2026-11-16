import { parseAbi } from 'viem';
import type { FacetClients } from './client.js';

export const FUJI_IDENTITY_REGISTRY = '0x8004A818BFB912233c491871b3d84c89A494BD9e' as const;
export const FUJI_REPUTATION_REGISTRY = '0x8004B663056A597Dffe9eCcC1965A193B7388713' as const;

const identityAbi = parseAbi([
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function getAgentWallet(uint256 agentId) view returns (address)',
]);
const reputationAbi = parseAbi(['function getIdentityRegistry() view returns (address)']);

export async function getAgentIdentity(clients: FacetClients, tokenId: bigint) {
  if (tokenId <= 0n) throw new Error('INVALID_ERC8004_TOKEN_ID');
  const [owner, tokenURI, agentWallet] = await Promise.all([
    clients.publicClient.readContract({ address: FUJI_IDENTITY_REGISTRY, abi: identityAbi, functionName: 'ownerOf', args: [tokenId] }),
    clients.publicClient.readContract({ address: FUJI_IDENTITY_REGISTRY, abi: identityAbi, functionName: 'tokenURI', args: [tokenId] }),
    clients.publicClient.readContract({ address: FUJI_IDENTITY_REGISTRY, abi: identityAbi, functionName: 'getAgentWallet', args: [tokenId] }),
  ]);
  return { chainId: 43113 as const, registry: FUJI_IDENTITY_REGISTRY, tokenId, owner, tokenURI, agentWallet };
}

export async function verifyReputationRegistry(clients: FacetClients) {
  const identity = await clients.publicClient.readContract({ address: FUJI_REPUTATION_REGISTRY, abi: reputationAbi, functionName: 'getIdentityRegistry' });
  return identity.toLowerCase() === FUJI_IDENTITY_REGISTRY.toLowerCase();
}
