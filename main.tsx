import React from "react";
import ReactDOM from "react-dom/client";
import { PetraWallet } from "@aptos-labs/wallet-adapter-plugin";
import { WalletProvider } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import App from "./App";
import "./index.css";

// Initialize Petra Wallet Adapter
const wallets = [new PetraWallet()];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider wallets={wallets} autoConnect>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
