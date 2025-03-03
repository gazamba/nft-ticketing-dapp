import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";
import EventFactoryModule from "./EventFactoryModule";

export default buildModule("TicketVerification", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const { eventFactory } = m.useModule(EventFactoryModule);
  const ticketVerification = m.contract("TicketVerification", [
    ticketNFT,
    eventFactory,
  ]);
  return { ticketVerification };
});
