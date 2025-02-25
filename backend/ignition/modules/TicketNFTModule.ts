import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TicketNFTModule", (m) => {
  const ticketNFT = m.contract("TicketNFT");

  return { ticketNFT };
});
