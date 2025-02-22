# 🎟️ NFT Ticketing dApp

A decentralized event ticketing platform that leverages blockchain technology to issue NFT-based tickets, ensuring transparency, security, and ownership.

== MISSING SNAPSHOTS AND DEPLOY LINK FOR THE dApp ==

## 🚀 Tech Stack

### **Frontend**
- **Next.js** – For building the UI and handling server-side rendering.
- **Tailwind CSS** – For styling the application.
- **Ethers.js** – For interacting with the Ethereum blockchain.
- **Wagmi** – Simplifies Ethereum wallet integration.

### **Backend**
- **Smart Contracts** – Written in Solidity for ticket issuance and transactions.
- **Hardhat** – For smart contract development, deployment, and testing.
- **OpenZeppelin** – Secure contract development library.
- **Pinata IPFS** – For storing event metadata (name, description, image, etc.).
- **The Graph** – For querying blockchain data efficiently.

### **Blockchain**
- **Ethereum / Sepolia Testnet** – Smart contracts deployed on Ethereum for scalability and security.

### **Wallets**
- **MetaMask** – For users to connect their wallets and manage NFT tickets.

## 📌 Features

1. **NFT-Based Tickets** – Each ticket is minted as an NFT, ensuring ownership and uniqueness.
2. **Event Creation** – Organizers can create events, set ticket prices, and ticket supply.
3. **Ticket Purchase** – Users can buy tickets using ETH, and NFTs are transferred to their wallets.
4. **Resale Marketplace** – Users can resell tickets in a decentralized manner with royalties for event organizers.
5. **Ticket Verification** – Organizers can verify ticket ownership at event entry.
6. **Royalties for Organizers** – Event creators earn a percentage from resold tickets.
7. **User Profiles** – Users can view purchased tickets and transaction history.

## 🔗 How These Contracts Work Together
- **Event Creation**: Organizers use EventFactory to create events.
- **Ticket Minting**: When users buy tickets, TicketNFT mints ERC-721 tokens.
- **Resale Marketplace**: Users can list their NFT tickets on TicketMarketplace for resale.
- **Ticket Verification**: At the event, TicketVerification confirms the ticket’s authenticity

## 🛠 Setup and Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/gazamba/nft-ticketing-dapp.git
cd nft-ticketing-dapp
```

### **2️⃣ Set Up the Frontend**
```sh
cd frontend
npm install  # or yarn install
```

### **3️⃣ Set Up the Backend (Hardhat)**
```sh
cd backend
npm install  # or yarn install
```

### **4️⃣ Configure Environment Variables**
Create a `.env` file inside `backend/` and `frontend/` with the following variables:

#### **Backend (`backend/.env`)**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
SEPOLIA_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

#### **Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_PINATA_PUBLIC_GATEWAY_URL=<Pinata-gateway>
NEXT_PUBLIC_PINATA_JWT_TOKEN=<JWT-FROM-Pinata>
```

## 🚀 Running the Project

### **1️⃣ Compile and Deploy Smart Contracts**
```sh
cd backend
npx hardhat compile

Local blockchain with hardhat node
npx hardhat ignition deploy ignition/modules/<contract-module>.ts --network localhost

```

### **2️⃣ Start the Frontend**
```sh
cd frontend
npm run dev  # or yarn dev
```

The application will be available at: `http://localhost:3000`

## 📝 Hardhat Configuration (`backend/hardhat.config.ts`)

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY
        ? [process.env.SEPOLIA_PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
};

export default config;
```

## 🧪 Running Tests

To run unit tests for your smart contracts:
```sh
cd backend
npx hardhat test
```

## 🌎 Deployment

Once tested, deploy the smart contracts on **Ethereum Sepolia**:
```sh
npx hardhat ignition deploy ignition/modules/<contract-modules>.ts --network sepolia
```

For frontend deployment, use **Vercel**:
```sh
cd frontend
vercel
```

## 🔒 Security Considerations
- Use **OpenZeppelin** libraries to prevent vulnerabilities.
- Audit contracts before deploying
- Keep **private keys** secure and never expose them in code.

## 📜 License
This project is licensed under the MIT License.

## 🤝 Contributions
Pull requests are welcome!


