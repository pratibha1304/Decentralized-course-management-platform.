import React, { useState, useEffect } from "react";
import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react"; 
import { AptosClient, Network } from "aptos"; 
import UploadCourse from "./UploadCourse"; // Adjust the path if needed

const aptosClient = new AptosClient(Network.DEVNET);

const WalletConnect = () => {
  const { connect, disconnect, account, connected, signAndSubmitTransaction } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && account?.address) {
        console.log("Fetching balance for:", account.address);

        try {
          const resources = await aptosClient.getAccountResources(account.address); 

          const aptBalanceResource = resources.find((resource) =>
            resource.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
          );

          if (aptBalanceResource && aptBalanceResource.data) {
            const coinStoreData = aptBalanceResource.data as { coin: { value: string } }; 
            const coin = coinStoreData.coin;

            if (coin && coin.value) {
              setBalance(coin.value);
            } else {
              setBalance("0");
            }
          } else {
            setBalance("0");
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0");
        }
      }
    };

    fetchBalance();
  }, [connected, account]);

  const handleConnect = async () => {
    try {
      console.log("Connecting to Petra Wallet...");
      await connect("Petra" as WalletName);
      console.log("Connected!", account?.address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {connected ? (
        <>
          <p className="text-green-400">Connected: {account?.address}</p>
          <p className="text-yellow-400">Balance: {balance || "Loading..."} APT</p>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
          <UploadCourse account={account?.address ?? null} signAndSubmitTransaction={signAndSubmitTransaction} />
        </>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleConnect}
        >
          Connect Petra Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
