import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("NFT");
  const Marketplace = await ethers.getContractFactory("Marketplace");

  const nft = await NFT.deploy();
  const marketplace = await Marketplace.deploy(10);

  await nft.deployed();
  await marketplace.deployed();

  console.log("nft", nft.address);
  console.log("marketplace", marketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
