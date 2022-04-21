// SETUP
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";

// SUBCOMPONENT
import Navbar from "./Navbar";
import Main from "./Main";

// SMART CONTRACTS
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";

// FRONTEND WEB3 APPLICATIONS NEEDS TO:
// 1) Connect App to Blockchain
// 2) Connect Browser to Blockchain (Metamask)

const App = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenContract, setTokenContract] = useState();
  const [ethSwapContract, setEthSwapContract] = useState();
  const [tokenBalance, setTokenBalance] = useState("0");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (ethSwapContract != undefined && tokenContract != undefined) {
      setLoading(false);
    }
  }, [ethSwapContract, tokenContract]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum Browser Detected. You should consider trying Metamask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    setAccount(accounts[0]);
    setBalance(ethBalance);

    // LOAD TOKEN CONTRACT REFERENCE
    const networkId = await web3.eth.net.getId();
    loadTokenContract(networkId, accounts[0]);
    loadEthSwapContract(networkId);
  };

  const loadTokenContract = async (_networkId, _account) => {
    const TokenNetwork = Token.networks[_networkId]; // the network where token contract exists
    // might not work if you change networks
    if (TokenNetwork) {
      // Token Contract representation in javascript. This is used for us to interact with the actual smart contract on the frontend.
      const token = new window.web3.eth.Contract(
        Token.abi,
        TokenNetwork.address
      );
      // call() when fetching info from blockchain [no gas]
      // send() when adding info to blockchain [will need gas]
      let userTokenBalance = await token.methods.balanceOf(_account).call();
      setTokenContract(token);
      setTokenBalance(userTokenBalance.toString());
    } else {
      window.alert("Token contract not found on the current detected network");
    }
  };

  const loadEthSwapContract = async (_networkId) => {
    const EthSwapNetwork = EthSwap.networks[_networkId];
    if (EthSwapNetwork) {
      const ethSwap = new window.web3.eth.Contract(
        EthSwap.abi,
        EthSwapNetwork.address
      );
      setEthSwapContract(ethSwap);
    } else {
      window.alert(
        "EthSwap contract not found on the current detected network"
      );
    }
  };

  return loading ? (
    <h1>LOADING BLOCKCHAIN DATA...</h1>
  ) : (
    <div>
      <Navbar {...{ account }} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <Main />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
