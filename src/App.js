import "./App.css";
import { useState } from "react";
import Create from "pages/Create/Create";
import { ethers } from "ethers";

import NFTContract from "./contracts/NFT.json";
import MarketplaceContract from "./contracts/Marketplace.json";
import List from "pages/List";

window.contracts = {
  nft: NFTContract,
  marketplace: MarketplaceContract,
};

const NFTAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const MarketplaceAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

function App() {
  const [account, setAccount] = useState(null);

  const [nft, setNft] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  function loadContracts(signer) {
    const marketplace = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceContract.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress, NFTContract.abi, signer);
    setNft(nft);

    window.contracts = {
      nft,
      marketplace,
    };
  }

  function web3Handler() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();
    loadContracts(signer);
  }

  return (
    <div className="App">
      <header>
        <button
          onClick={async () => {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });

            setAccount(accounts[0]);

            web3Handler();
          }}
        >
          Connect
        </button>
      </header>

      <Create nft={nft} marketplace={marketplace} />
      {account && <List marketplace={marketplace} nft={nft} />}

      <p>{account}</p>
    </div>
  );
}

export default App;
