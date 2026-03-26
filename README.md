# 🌐 Decentralized Forum DApp (EVM-based)

A full-stack decentralized social platform where messages are stored immutably on the Ethereum blockchain. This project demonstrates a complete Web3 integration: from gas-optimized Solidity smart contracts to an asynchronous JavaScript frontend interacting with a local node.

---

## 🛠 Tech Stack
* **Smart Contracts:** Solidity `^0.8.2`
* **Environment:** Hardhat (Development, Testing & Deployment)
* **Blockchain Communication:** Web3.js / Ethers.js
* **Frontend:** Vanilla JavaScript, HTML5, CSS3
* **Wallet Integration:** MetaMask

---

## 📂 Project Structure
- `/contracts` — Solidity source code (`Forum.sol`)
- `/scripts` — Deployment scripts for Hardhat
- `/frontend` — Web interface (`index.html`, `script.js`, `style.css`)
- `/artifacts` — Compiled contract ABIs

---

## ⚙️ Local Setup & Deployment

### 1. Initialize Local Blockchain
Start a local Ethereum node to simulate the network:
```bash
npx hardhat node
```
### 2. Deploy 
```bash
npx hardhat run scripts/deploy.js --network localhost
```
### 3. Setup MetaMask(Web3 Provider)
 - Network: Connect MetaMask to http://127.0.0.1:8545 (Chain ID: 31337).
 - Accounts: Import one of the Private Keys printed in the Hardhat console to receive 10,000 test ETH.
### 4. Link Frontend to Contract
-  Copy the Contract Address from the terminal output.
-  Update the const contract_address variable in /frontend/script.js.
-  (Note: Ensure your c_abi in JS matches the JSON in /artifacts if you modified the .sol file).
