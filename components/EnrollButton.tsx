import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";
import React, { useState, useEffect } from "react";
import { Buffer } from "buffer"; // ✅ Import Buffer explicitly
import { useWallet } from "@aptos-labs/wallet-adapter-react"; // Add useWallet hook

// ✅ Ensure Buffer is available globally
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

// ✅ Initialize Aptos SDK
const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

// Define the Account type for wallet integration
interface WalletAccount extends Account {
  signAndSubmitTransaction: (transaction: InputGenerateTransactionPayloadData) => Promise<any>;
}

interface EnrollButtonProps {
  courseId: string;
  courseName: string;
  account: WalletAccount | null; // Updated to use WalletAccount type
}

const EnrollButton: React.FC<EnrollButtonProps> = ({
  courseId,
  courseName,
  account,
}) => {
  const { connected } = useWallet(); // Get connection status from wallet
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("connected:", connected); // Log wallet connection status
    console.log("account:", account); // Log account state
  }, [connected, account]); // Log when these values change

  const handleEnroll = async () => {
    console.log("Handle Enroll triggered");
    console.log("Account in handleEnroll:", account);
    console.log("Wallet connected:", connected);
  
    if (!account) {
      console.error("❌ Wallet not connected.");
      setMessage("Please connect your wallet first.");
      return;
    }
  
    if (!courseId || !/^0x[0-9a-fA-F]{64}$/.test(courseId)) {
      console.error("❌ Invalid hex string detected:", courseId);
      setMessage("Invalid course ID. Please refresh and try again.");
      return;
    }
  
    try {
      setLoading(true);
      setMessage("");
  
      // ✅ Ensure `account` supports signing transactions
      if (!account.signAndSubmitTransaction) {
        console.error("❌ Account does not support signing transactions.");
        setMessage("Wallet is not compatible.");
        return;
      }
  
      const transaction: InputGenerateTransactionPayloadData = {
        function:
          "0xb23c76bc595072a72768c7260f290ae8640fe5e2005288b90d999cf5dbb8c121::my_module::enroll",
        typeArguments: [],
        functionArguments: [courseId],
      };
  
      // ✅ Use correct method for signing & submitting
      const response = await account.signAndSubmitTransaction(transaction);
      console.log("✅ Transaction submitted:", response);
  
      setMessage("Enrollment successful!");
    } catch (error) {
      // Cast the error to an instance of Error
      const typedError = error as Error; 
      console.error("❌ Enrollment failed:", typedError);
      setMessage(`Transaction failed. Error: ${typedError.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Enroll in {courseName}</h2>
      <button
        onClick={handleEnroll}
        disabled={loading || !connected || !account}  // Ensure button is disabled if not connected
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Enrolling..." : "Enroll"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EnrollButton;
