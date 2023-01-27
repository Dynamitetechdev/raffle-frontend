import console from "console-browserify";
import React, { useState } from "react";
import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ABI, contractaddress } from "../constant";
import { ethers } from "ethers";
import { Bell, useNotification } from "web3uikit";
const RaffleEntranceFee = () => {
  const [entranceFee, setEntranceFee] = useState("0");
  const [numWords, setNumWords] = useState("");
  const [interval, setInterval] = useState("");
  const [lastestBlockStamp, setLastestBlockstamp] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [winner, setWinner] = useState("");
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
    msgValue: entranceFee,
    params: {},
  });
  // a function to get our entranceFee
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  //get num words
  const { runContractFunction: getNumWords } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    params: {},
    functionName: "getNumWords",
  });

  // GET INTERVALS
  const { runContractFunction: getInterval } = useWeb3Contract({
    abi: ABI,
    functionName: "getInterval",
    contractAddress: raffleContractAddress,
    params: {},
  });

  // get lastest blockTimeStamp
  const { runContractFunction: getLastestTimeStamp } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "getLastestTimeStamp",
    params: {},
  });

  // get number of players
  const { runContractFunction: getPlayer } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "getPlayer",
    params: {},
  });

  // get recent winners
  const { runContractFunction: getRecentRaffleWinner } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleContractAddress,
    functionName: "getRecentRaffleWinner",
    params: {},
  });

  const updateUi = async () => {
    const entranceFeeTx = (await getEntranceFee()).toString();
    const numWordTx = (await getNumWords()).toString();
    const intervalTx = (await getInterval()).toString();
    const getLastestTimeStampTx = (await getLastestTimeStamp()).toString();
    const getPlayersTx = (await getPlayer()).toString();
    const getRecentRaffleWinnerTx = await getRecentRaffleWinner();
    setLastestBlockstamp(getLastestTimeStampTx);
    setInterval(intervalTx);
    setEntranceFee(entranceFeeTx);
    setNumWords(numWordTx);
    setNumberOfPlayers(getPlayersTx);
    setWinner(getRecentRaffleWinnerTx);
  };

  //we are using the use effect to check is web3 is enable so we can called the getEntrancefee wheneven anything occur in the webpage
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  // Handle Clicks
  const dispatch = useNotification();
  const handleEnterRaffle = async () => {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: (e) => {
        if (e.message.includes("User denied transaction signature")) {
          handleFailedNotification();
        }
      },
    });
  };
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleSuccessNotification();
    updateUi();
  };

  const handleSuccessNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Successful",
      position: "topR",
      icons: Bell,
    });
  };

  const handleFailedNotification = () => {
    dispatch({
      type: "error",
      message: "Transaction Failed",
      position: "topR",
    });
  };
  return (
    <div className="">
      {raffleContractAddress ? (
        <div className="dashboard">
          <h1>Welcome to your dashboard</h1>
          <button onClick={handleEnterRaffle}>EnterRaffle</button>
          {entranceFee && (
            <h1>
              Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </h1>
          )}
          <h1>Number Of Players: {numberOfPlayers}</h1>
          <h1>Recent Winner: {winner}</h1>
          <h1>Number of random values: {numWords}</h1>
          <h1>Raffle Interval: {interval}</h1>
          <h1>Lastest TimeStamp: {lastestBlockStamp}</h1>
        </div>
      ) : (
        <div className="">No Address Found</div>
      )}
    </div>
  );
};

export default RaffleEntranceFee;
