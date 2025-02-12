import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketVerification = buildModule("TicketVerification", (m) => {
  const ticketVerification = m.contract("TicketVerification");

  return { ticketVerification };
});

export default TicketVerification;
