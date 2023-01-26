import React from "react";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="header">
      <h1>Decentralized Lottery</h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;
