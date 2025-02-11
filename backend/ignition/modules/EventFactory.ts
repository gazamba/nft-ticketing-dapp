import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventFactory = buildModule("EventFactory", (m) => {
  const eventFactory = m.contract("EventFactory");

  return { eventFactory };
});

export default EventFactory;
