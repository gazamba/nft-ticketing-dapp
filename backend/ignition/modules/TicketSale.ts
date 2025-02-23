import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketSale = buildModule("TicketSale", (m) => {
  const ticketSale = m.contract("TicketSale");

  const ticketNFT = m.contract("TicketNFT", [
    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  ]);

  return { ticketSale };
});

export default TicketSale;
