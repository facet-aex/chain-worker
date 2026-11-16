import type { Address, Hex } from 'viem';
import registryAbi from './abi/FacetActorRegistry.json' with { type: 'json' };
import type { FacetClients } from './client.js';
import { confirmedTransaction } from './client.js';
import { uuidKey } from './ids.js';

export interface FacetRegistration {
  facetType: number;
  imageDigest: Hex;
  schemaURI: string;
  pricingModel: number;
  priceAtomic: bigint;
  payTo: Address;
  erc8004TokenId: bigint;
  active: boolean;
}

export function matchesPublishedFacet(onChain: FacetRegistration, published: FacetRegistration): boolean {
  return onChain.facetType === published.facetType
    && onChain.imageDigest.toLowerCase() === published.imageDigest.toLowerCase()
    && onChain.schemaURI === published.schemaURI
    && onChain.pricingModel === published.pricingModel
    && onChain.priceAtomic === published.priceAtomic
    && onChain.payTo.toLowerCase() === published.payTo.toLowerCase()
    && onChain.erc8004TokenId === published.erc8004TokenId
    && onChain.active === published.active;
}

export async function getFacetOnChain(clients: FacetClients, facetId: string): Promise<FacetRegistration> {
  return await clients.publicClient.readContract({
    address: clients.addresses.actorRegistry,
    abi: registryAbi,
    functionName: 'getFacet',
    args: [uuidKey(facetId)],
  }) as FacetRegistration;
}

export async function registerFacetOnChain(clients: FacetClients, facetId: string, registration: FacetRegistration) {
  if (!clients.walletClient) throw new Error('SIGNER_REQUIRED');
  const hash = await clients.walletClient.writeContract({
    address: clients.addresses.actorRegistry,
    abi: registryAbi,
    functionName: 'registerFacet',
    args: [uuidKey(facetId), registration],
  });
  return confirmedTransaction(clients.publicClient, hash);
}

export async function verifyPublishedFacet(clients: FacetClients, facetId: string, published: FacetRegistration): Promise<boolean> {
  const stored = await getFacetOnChain(clients, facetId);
  return matchesPublishedFacet(stored, published);
}
