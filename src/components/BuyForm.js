import React, { useState } from "react";

import ETH_LOGO from "../eth-logo.png";
import TOKEN_LOGO from "../token-logo.png";

const BuyForm = ({ ethBalance, tokenBalance, buyTokens }) => {
  const [output, setOutput] = useState("0");
  const [input, setInput] = useState("0");

  const onSubmit = (e) => {
    e.preventDefault();
    let etherAmount = window.web3.utils.toWei(input, "Ether");
    buyTokens(etherAmount);
  };

  return (
    <form className="mb-3" onSubmit={onSubmit}>
      <div>
        <label className="float-left">Input</label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          required
          value={input}
          onChange={(e) => {
            let amount = e.target.value;
            setInput(amount);
            setOutput(amount * 100);
          }}
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ETH_LOGO} height="32" alt="" />
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">Output</label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(tokenBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          disabled
          value={output}
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={TOKEN_LOGO} height="32" alt="" />
            &nbsp; DApp
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">1 ETH = 100 DApp</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        SWAP!
      </button>
    </form>
  );
};

export default BuyForm;
