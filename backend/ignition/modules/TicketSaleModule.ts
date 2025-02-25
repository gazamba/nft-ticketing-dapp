import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";
import EventFactoryModule from "./EventFactoryModule";

export default buildModule("TicketSaleModule", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const { eventFactory } = m.useModule(EventFactoryModule);
  const ticketSale = m.contract("TicketSale", [ticketNFT, eventFactory]);

  m.call(eventFactory, "setTicketSale", [ticketSale], { id: "setTicketSale" });

  return { ticketSale };
});
