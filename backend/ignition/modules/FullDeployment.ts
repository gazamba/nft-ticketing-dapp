import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";
import EventFactoryModule from "./EventFactoryModule";
import TicketSaleModule from "./TicketSaleModule";
import TicketMarketplaceModule from "./TicketMarketplaceModule";
import TicketVerificationModule from "./TicketVerificationModule";

export default buildModule("FullDeployment", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const { eventFactory } = m.useModule(EventFactoryModule);
  const { ticketSale } = m.useModule(TicketSaleModule);
  const { ticketMarketplace } = m.useModule(TicketMarketplaceModule);
  const { ticketVerification } = m.useModule(TicketVerificationModule);
  return {
    ticketNFT,
    eventFactory,
    ticketSale,
    ticketMarketplace,
    ticketVerification,
  };
});
