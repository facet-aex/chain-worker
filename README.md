# FACET Chain Worker (`@facet/chain-worker`)

[![FACET](https://img.shields.io/badge/FACET-facet.briandev.space-050505?style=flat-square&labelColor=DFFF4F)](https://facet.briandev.space)
[![Layer](https://img.shields.io/badge/BLOCKCHAIN-ON--CHAIN%20CLIENT-0D0D0D?style=flat-square&labelColor=343434)](https://github.com/facet-aex)

> Typed `viem` on-chain client and verification library for FACET protocol and `ERC-8004` contracts on Avalanche.

## Overview

`chain-worker` is the shared blockchain integration library used across **FACET** backend services. It provides typed ABI bindings, deterministic key derivation (`uuidToFacetKey`), transaction submission helpers, and on-chain verification utilities.

## Role in FACET

- **Capability Registry (`FacetActorRegistry`):** Registers published `API`, `ACTOR`, and `AGENT` Facet versions on-chain and verifies stored `imageDigest`, pricing, and payout addresses.
- **Payout & Escrow (`FacetFeeSplitAndEscrow`):** Supports instant `FeeSplit` payouts, `TaskEscrow` deposits/settlements, and automated refund workflows.
- **Receipt Anchoring (`FacetReceiptLog`):** Logs and verifies immutable run receipts binding `runId`, `inputHash`, `outputHash`, `itemCount`, and `runnerSignature`.
- **Agent Identity (`ERC-8004`):** Queries and validates canonical `ERC-8004` Identity and Reputation registries on Avalanche for `AGENT` Facets.

## Tech Stack

| Layer | Technology |
|---|---|
| Language & Runtime | TypeScript, Node.js 24 (ESM) |
| Web3 & RPC | `viem` (typed contract ABIs & public/wallet clients) |
| Network | Avalanche C-Chain |
| Testing | Vitest |

---

Part of **[FACET](https://facet.briandev.space)** (`facet-aex`) — Federated Agent Capability Exchange & Trust on Avalanche.
