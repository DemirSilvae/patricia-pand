# GrindURUS Frontend ICP

This repository contains the frontend of the **GrindURUS Protocol**, deployed on the **Internet Computer (ICP)** using a frontend canister. The frontend is built with **TypeScript** and leverages **dfx** for canister management and deployment.

## 🚀 Overview

GrindURUS is a decentralized protocol with multiple components. This frontend provides an interface for interacting with various parts of the protocol, including minting, burning, depositing tokens, and accessing AI-powered tools.

## 📁 Structure

- `src/grindurus-frontend` — Source files for the frontend canister.
- `package.json` — Dependencies and scripts for the frontend.
- `dfx.json` — Configuration file for canisters on the Internet Computer.

## 🌐 Pages

### 🏠 Dashboard (Completed/Continue Development)
- **Panel Section**:
  - Displays **total minted pools** and **total minted grETH**.
- **IntentNFT Form**:
  - Allows users to mint an `IntentNFT` which automatically grinds pools.
- **Deposit Form**:
  - Enables users to deposit tokens and mint a new isolated pool.

### 🧪 grETH (In Progress)
- Burn `grETH` and receive tokens.
- Mint new `grETH` at a 1:1 ratio with ETH.

### 🤖 Grinder AI (In Progress)
- AI-powered assistant chat.
- Helps users navigate the protocol and get pool-related info.

### 🧠 grAI (In Progress)
- Interface for the upcoming `grAI` token.
- Functionality under development.

## 🛠️ Development

### Requirements
- [Node.js](https://nodejs.org/)
- [dfx](https://internetcomputer.org/docs/building-apps/developer-tools/dfx/dfx-parent)

### 🎞 Installation & Deployment

First, install the project dependencies:

```bash
npm install
```

---

### 🚀 Local Deployment (IC Local Replica)

1. **Start the local replica**:

   ```bash
   dfx start --background
   ```

2. **Deploy the frontend canister locally**:

   ```bash
   dfx deploy
   ```

3. **Access the frontend**:

   After deployment, open the local frontend in your browser. The URL will look like:

   ```
   http://<canister_id>.localhost:4943
   ```

   You can find the canister ID in `.dfx/local/canister_ids.json`.

---

### 🌐 Deployment to ICP Mainnet

> Make sure you're authenticated with your Internet Identity or have access to a wallet that can sign deployments.

1. **Deploy to the Internet Computer mainnet**:

   ```bash
   dfx deploy --network ic
   ```

2. **Access the frontend**:

   After a successful deployment, you'll get a public URL like:

   ```
   https://<canister_id>.icp0.io
   ```

---

> 💡 You can edit environment-specific configurations in `dfx.json` and optionally use `.env` files to manage variables.