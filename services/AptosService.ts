import { Aptos, AptosConfig, Network, InputViewFunctionData } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const getAccountBalance = async (address: string) => {
  try {
    const resources = await aptos.getAccountResources({ accountAddress: address });

    const accountResource = resources.find((r) => r.type.includes("0x1::coin::CoinStore"));

    if (accountResource && "data" in accountResource && accountResource.data && "coin" in accountResource.data) {
      return (accountResource.data as { coin: { value: string } }).coin.value;
    }

    return "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};

export const viewCourses = async () => {
  try {
    const payload: InputViewFunctionData = {
      function_: "0xYourContractAddress::course_module::get_courses", // ✅ FIXED: Corrected property name
      type_arguments: [],
      arguments: [],
    };

    const result = await aptos.view({ payload }); // ✅ FIXED: Now passing payload correctly

    return result;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export default aptos;
