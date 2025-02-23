const {ethers} = require("ethers")

async function main() {

  // GET Transaction Hash -> low-level blockchain function
  // const txHash = "0x9be21f33ad94dd9459d08cefbd860d8c43a59fe7d3a555d84855511db785c30c";
  // const provider = hre.ethers.provider;
  // const tx = await provider.send("eth_getTransactionByHash", [txHash]);
  // console.log("Transaction Details:", tx);

  // GET NFT Owner
  // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
  // const ticketNFTABI = ["function owner() view returns (address)"];
  // const ticketNFTAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  // const ticketNFT = new ethers.Contract(ticketNFTAddress, ticketNFTABI, provider)
  // const owner = await ticketNFT.owner();
  // console.log(owner)

  // Mint Ticket NFT
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const addressTo = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  const tokenURI = ""

  // address to,
  // string memory tokenURI,
  // uint256 eventId

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
