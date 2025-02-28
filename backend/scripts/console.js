const {ethers} = require("ethers")
const EventFactoryABI = require("../artifacts/contracts/EventFactory.sol/EventFactory.json");
const TicketNFTABI = require("../artifacts/contracts/TicketNFT.sol/TicketNFT.json");
const TicketSaleABI = require("../artifacts/contracts/TicketSale.sol/TicketSale.json");
const TicketMarketplaceABI = require("../artifacts/contracts/TicketMarketplace.sol/TicketMarketplace.json");
const TicketVerificationABI = require("../artifacts/contracts/TicketVerification.sol/TicketVerification.json");
const deployedAddresses = require("../ignition/deployments/chain-31337/deployed_addresses.json");

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
  // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // const addressTo = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  // const tokenURI = ""

  // address to,
  // string memory tokenURI,
  // uint256 eventId

  //provider can be used as signer to call read only view/pure functions directly
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Signer are necessary to perform function non read only
  const signer = await provider.getSigner(0);
  const signerAddress = await signer.getAddress();

  // Retrieve contract addresses
  const eventFactoryAddress = deployedAddresses["EventFactoryModule#EventFactory"];
  const ticketNFTAddress = deployedAddresses["TicketNFTModule#TicketNFT"];
  const ticketSaleAddress = deployedAddresses["TicketSaleModule#TicketSale"];
  const ticketMarketplaceAddress = deployedAddresses["TicketMarketplaceModule#TicketMarketplace"];
  const ticketVerificationAddress = deployedAddresses["TicketVerificationModule#TicketVerification"];

  const eventFactory = new ethers.Contract(eventFactoryAddress, EventFactoryABI.abi, signer)
  const ticketSale = new ethers.Contract(ticketSaleAddress, TicketSaleABI.abi, signer)

  // const nextEventId = await eventFactory.nextEventId();
  // console.log("Current Next Event ID:", nextEventId.toString());

  // Check and set ticketSale if not set
  const currentTicketSale = await eventFactory.ticketSale();
  if (currentTicketSale === ethers.ZeroAddress) {
    console.log("Setting TicketSale...");
    const setTx = await eventFactory.setTicketSale(ticketSaleAddress);
    await setTx.wait();
    console.log("TicketSale set to:", ticketSaleAddress);
  } else {
    console.log("TicketSale already set:", currentTicketSale);
  }

  // Call createEvent
  const metadataCID = "ipfs://event-metada-cid";
  const ticketMetadataBaseURI = "ipfs://event-metada-uri";
  const totalTickets = 100;
  const ticketPrice = ethers.parseEther("0.03");

  console.log("Creating event...");
  const tx = await eventFactory.createEvent(metadataCID, ticketMetadataBaseURI, totalTickets, ticketPrice);
  console.log("Transaction Hash:", tx.hash);

  // Wait and log event
  const receipt = await tx.wait();
  console.log("Event created in block:", receipt.blockNumber);

  eventFactory.on("EventCreated", (eventId, metadataCID, totalTickets, organizer, ticketMetadataBaseURI, event) => {
    console.log("EventCreated Detected:");
    console.log("  Event ID:", eventId.toString());
    console.log("  Metadata CID:", metadataCID);
    console.log("  Total Tickets:", totalTickets.toString());
    console.log("  Organizer:", organizer);
    console.log("  Ticket Metadata Base URI:", ticketMetadataBaseURI);
    console.log("  Tx Hash:", event.transactionHash);
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
