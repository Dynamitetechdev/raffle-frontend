import console from "console-browserify";
import React, { useState } from "react";
import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ABI, contractaddress } from "../constant";
const RaffleEntranceFee = () => {
  const [entranceFee, setEntranceFee] = useState("");
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log(chainId);
  const raffleContractAddress =
    chainId in contractaddress ? contractaddress[chainId][0] : null;
  console.log(raffleContractAddress);

  // a function to run our enterRaffle
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "pay",
    msgValue: "",
    params: {},
  });

  // a function to get our entranceFee
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const updateUi = async () => {
    const entranceFeeTx = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeTx);
    console.log(entranceFeeTx);
  };

  //we are using the use effect to check is web3 is enable so we can called the getEntrancefee wheneven anything occur in the webpage
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="">
      <div className="dashboard">
        <h1>Welcome to your dashboard</h1>
        <h1>{entranceFee}</h1>
      </div>
    </div>
  );
};

export default RaffleEntranceFee;
