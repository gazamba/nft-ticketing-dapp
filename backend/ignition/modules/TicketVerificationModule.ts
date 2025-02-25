import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TicketNFTModule from "./TicketNFTModule";

export default buildModule("TicketVerification", (m) => {
  const { ticketNFT } = m.useModule(TicketNFTModule);
  const ticketVerification = m.contract("TicketVerification", [ticketNFT]);
  return { ticketVerification };
});
