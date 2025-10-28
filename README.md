## Open Store Console

Publisher web app for the Open Store protocol, built with React and Vite.

## Quickstart

```bash
yarn
yarn dev
```

Build and preview:

```bash
yarn build
yarn preview
```

## Scripts

- **dev**: `vite`
- **build**: `tsc -b && vite build`
- **preview**: `vite preview`
- **lint**: `eslint .`
- **generate-proto**: `node scripts/generate-ts-proto.js`

## .env
``` bash
VITE_ETH_NODE=http://127.0.0.1:8545 # hardhat
VITE_GREENFIELD_NODE=https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org # GF testnet node
VITE_GRAPH_NODE=http://127.0.0.1:3001 # contracts -> graph.tx
VITE_CHAIN_NAME=lh # lh | bsc | bsctest 
VITE_CLIENT_API_URL=http://127.0.0.1:8081 | node -> client -> api
VITE_WAGMI_PROJECT_ID=
```

## Tech

- **Framework**: React + Vite
- **UI**: MUI
- **State/data**: React Query
- **Blockchain**: ethers, wagmi, viem

## Documentation

## The Main Workflow

TL;DR of the happy path:

1. **Create Publisher**: The publisher creates a `Publisher` (name, storage). A Greenfield bucket is initialized via cross‑chain operations.
2. **Create App**: Define `Asset` (package name, name/description, platform/category, protocolId) and connect base plugins (Ownership, Builds, Distribution).
3. **Prove Ownership**: Save `OwnershipInfo` (endpoint domain, certificate SHA‑256 fingerprints, and `ProofOfCertificateOwnership`) and request Ownership Verification. Oracle compares `/.well-known/assetlinks.json` fingerprints to on‑chain fingerprints.
4. **Upload Artifact**: Upload the asset artifact (e.g., Android APK) to storage; optionally add custom distribution links (CDN) with templated params.
5. **Request Artifact Validation**: Pay Validation Fee; validators download and verify structure/signatures, compare versionCode/name/checksum and ownership proofs.
6. **Block Lifecycle**: Validators propose blocks with batched validation results, vote, and finalize. Stakes and penalties align incentives.
7. **Publish and Discover**: On success, the artifact is marked valid and can be published. Catalog/search (via API) shows verified apps; everything remains accessible by address on chain.
8. **Install with Local Checks**: The client fetches download links from chain and performs local verification (checksum, certificate fingerprints, proof signature) before installation.

Related guides:
- Publishing process: [Publishing Process](./publishing-process.md)
- Ownership details: [Ownership Verification](./ownership-verification.md)
- Fees overview: [Billing and Fees](./billing-and-fees.md)
- Custom CDN/links: [Custom Distribution](./custom-distribution.md)

---

For background and formal definitions, see the whitepaper sections on Motivation, Principles, Glossary, Workflow, and Fees. If you’re new, start with [Publishing Process](./publishing-process.md) and [Ownership Verification](./ownership-verification.md).

## License

See `LICENCE`.



