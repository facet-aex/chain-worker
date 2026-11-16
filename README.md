# FACET Chain Worker (`@facet/chain-worker`)

Typed `viem` on-chain client and verification library for Avalanche Fuji (`43113`) under [ADR-0015](../docs/architecture/decisions/ADR-0015-actorbazaar-docker-and-a2a-mvp.md).

## Supported Contracts

- **`FacetActorRegistry`** — on-chain Actor/Facet registration & `imageDigest` verification
- **`FacetFeeSplitAndEscrow`** — instant creator payout (`FeeSplit`) and usage-verified escrow (`TaskEscrow`)
- **`FacetReceiptLog`** — immutable on-chain execution receipts (`RunReceiptLogged`)
- **Canonical `ERC-8004` Registries on Fuji** — Identity (`0x8004A818BFB912233c491871b3d84c89A494BD9e`) & Reputation (`0x8004B663056A597Dffe9eCcC1965A193B7388713`)
