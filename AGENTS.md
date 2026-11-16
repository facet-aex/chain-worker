# `chain-worker` instructions (Avalanche Fuji & ERC-8004 On-Chain Client)

**Owner in Wave 1:** Codex  
**Active architectural authority:** `../docs/architecture/decisions/ADR-0015-actorbazaar-docker-and-a2a-mvp.md`

## Role

`chain-worker` provides typed `viem` clients, helpers, and CLI/verification scripts for interacting with FACET's Avalanche Fuji (`43113`) smart contracts in `../contracts/fuji-deployment.json` and the canonical ERC-8004 registries:

1. **`FacetActorRegistry` client:**
   - `registerFacetOnChain(...)` and `getFacetOnChain(facetId)`
2. **`FacetFeeSplitAndEscrow` client:**
   - `settlePayPerRun(...)`, `depositTaskEscrow(...)`, `settleTaskEscrow(...)`
3. **`FacetReceiptLog` client:**
   - `recordReceiptOnChain(...)` and `getReceiptOnChain(runId)` (supports `FACET_FUJI_RPC_URL` and optional `FACET_RECEIPT_RPC_URL` for a dedicated Avalanche L1)
4. **Canonical `ERC-8004` Fuji client:**
   - Reads Identity Registry (`0x8004A818BFB912233c491871b3d84c89A494BD9e`) and Reputation Registry (`0x8004B663056A597Dffe9eCcC1965A193B7388713`) to verify `tokenId` ownership, `tokenURI`, and `agentWallet`.

## Rules

- Standalone TypeScript repository with its own `package.json`, `package-lock.json`, and `vitest` test suite.
- Never commit private keys or `.env`.
