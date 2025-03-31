import React, { useState } from "react";
import { AptosClient } from "aptos";

// Initialize AptosClient
const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

interface UploadCourseProps {
  account: string | null;
  signAndSubmitTransaction: Function;
}

const UploadCourse: React.FC<UploadCourseProps> = ({ account, signAndSubmitTransaction }) => {
  const [courseName, setCourseName] = useState("");

  const handleUpload = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
  
    if (!courseName) {
      alert("Please enter a course name.");
      return;
    }
  
    try {
      const functionName = "0xYOUR_CONTRACT_ADDRESS::course::upload_course"; // Ensure this is a valid contract address and function name
      const args = [courseName];
  
      // Construct the payload for the transaction
      const payload = {
        type: "entry_function_payload",
        function: functionName,
        arguments: args,
        type_arguments: []
      };
  
      // Log the payload to debug the structure before sending the transaction
      console.log("Payload to be sent:", payload);
  
      // Check if the payload is correctly structured
      if (!payload.function || !Array.isArray(payload.arguments)) {
        throw new Error("Invalid payload structure: missing function or arguments.");
      }
  
      // Call signAndSubmitTransaction with the correctly formed payload
      const response = await signAndSubmitTransaction(payload);
  
      // Wait for the transaction to be confirmed
      const txnHash = response.hash;
      console.log("Transaction Hash:", txnHash);
      await client.waitForTransaction(txnHash);
  
      // Notify user of successful upload
      alert(`Course "${courseName}" uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Upload failed: ${errorMessage}`);
    }
  };
  
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Upload Course</h2>
      <input
        type="text"
        placeholder="Enter Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white w-full mt-2"
      />
      <button
        onClick={handleUpload}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        Upload Course
      </button>
    </div>
  );
};

export default UploadCourse;
