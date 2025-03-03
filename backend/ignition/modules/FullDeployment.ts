import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";
import EventFactoryModule from "./EventFactoryModule";
import TicketSaleModule from "./TicketSaleModule";
import TicketMarketplaceModule from "./TicketMarketplaceModule";
import TicketVerificationModule from "./TicketVerificationModule";

export default buildModule("FullDeployment", (m) => {
  const { eventFactory } = m.useModule(EventFactoryModule);
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const { ticketSale } = m.useModule(TicketSaleModule);
  const { ticketMarketplace } = m.useModule(TicketMarketplaceModule);
  const { ticketVerification } = m.useModule(TicketVerificationModule);

  m.call(eventFactory, "setTicketSale", [ticketSale]);
  m.call(ticketNFT, "setTicketSale", [ticketSale]);

  return {
    eventFactory,
    ticketNFT,
    ticketSale,
    ticketMarketplace,
    ticketVerification,
  };
});
