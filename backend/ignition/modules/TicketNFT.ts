import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketNFT = buildModule("TicketNFT", (m) => {
  const ticketNFT = m.contract("TicketNFT");

  return { ticketNFT };
});

export default TicketNFT;
