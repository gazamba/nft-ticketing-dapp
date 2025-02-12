import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketMarketplace = buildModule("TicketMarketplace", (m) => {
  const ticketMarketplace = m.contract("TicketMarketplace");

  return { ticketMarketplace };
});

export default TicketMarketplace;
