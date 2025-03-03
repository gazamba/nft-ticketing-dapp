import hre from "hardhat";

// SCRIPT TO VERIFY MULTIPLE CONTRACTS TO BLOCKCHAIN
// to run npx hardhat run scripts/verify.ts --network sepolia
async function main() {
  const addresses = {
    eventFactory: "0xb16E99d9796CbaB6d4CCD55b081b8BbB5f2451f0",
    ticketNFT: "0x6652f242A5Ae5DC167e4F0C53dE2AF734A2b73A9",
    ticketSale: "0x6E4Ef5F24fE9c71B6457b46a77ac3a8e4e11231A",
    ticketMarketplace: "0x98CcD7AD898199b8F36b74028cf7d6304fF7C555",
    ticketVerification: "0x40a28B073C34e4eFE30C6b64E0BE65C8b851FC5D",
  };

  await hre.run("verify:verify", { address: addresses.eventFactory });
  await hre.run("verify:verify", {
    address: addresses.ticketNFT,
    constructorArguments: [addresses.eventFactory],
  });
  await hre.run("verify:verify", {
    address: addresses.ticketSale,
    constructorArguments: [addresses.ticketNFT, addresses.eventFactory],
  });
  await hre.run("verify:verify", {
    address: addresses.ticketMarketplace,
    constructorArguments: [addresses.ticketNFT, addresses.eventFactory],
  });
  await hre.run("verify:verify", {
    address: addresses.ticketVerification,
    constructorArguments: [addresses.ticketNFT, addresses.eventFactory],
  });
}

main().catch(console.error);
