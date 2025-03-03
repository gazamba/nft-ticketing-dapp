import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import EventFactoryModule from "./EventFactoryModule";

export default buildModule("TicketNFTModule", (m) => {
  const { eventFactory } = m.useModule(EventFactoryModule);
  const ticketNFT = m.contract("TicketNFT", [eventFactory]);
  return { ticketNFT };
});
