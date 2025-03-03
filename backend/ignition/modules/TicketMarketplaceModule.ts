import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";
import EventFactoryModule from "./EventFactoryModule";

export default buildModule("TicketMarketplaceModule", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const { eventFactory } = m.useModule(EventFactoryModule);
  const ticketMarketplace = m.contract("TicketMarketplace", [
    ticketNFT,
    eventFactory,
  ]);
  return { ticketMarketplace };
});
