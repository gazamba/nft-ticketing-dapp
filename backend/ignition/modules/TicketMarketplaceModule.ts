import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";

export default buildModule("TicketMarketplaceModule", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const ticketMarketplace = m.contract("TicketMarketplace", [ticketNFT]);
  return { ticketMarketplace };
});
