import React, { useState } from "react";

import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

const Main = ({ ethBalance, tokenBalance, buyTokens, sellTokens }) => {
  const [form, setForm] = useState("buy");

  const renderForm = () => {
    if (form === "buy")
      return <BuyForm {...{ ethBalance, tokenBalance, buyTokens }} />;
    else if (form === "sell")
      return <SellForm {...{ ethBalance, tokenBalance, sellTokens }} />;
  };

  return (
    <div id="content" className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={(event) => {
            setForm("buy");
          }}
        >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-light"
          onClick={(event) => {
            setForm("sell");
          }}
        >
          Sell
        </button>
      </div>
      <div className="card mb-4">
        <div className="='card-body">{renderForm()}</div>
      </div>
    </div>
  );
};

export default Main;
