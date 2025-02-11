import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual address

  const eventFactory = await ethers.getContractAt(
    "EventFactory",
    contractAddress
  );

  //   console.log("Creating an event...");
  //   const tx = await eventFactory.createEvent(
  //     "Web3Conf2025",
  //     "2025-10-15",
  //     "Paris",
  //     ethers.parseEther("1.5"),
  //     1000
  //   );
  //   await tx.wait();
  //   console.log("Event Created!");

  console.log("Listening for new events...");

  eventFactory.on(
    eventFactory.filters.EventCreated(),
    (eventId, name, organizer) => {
      console.log(
        `New event created! ID: ${eventId}, Name: ${name}, Organizer: ${organizer}`
      );
    }
  );

  // Fetch event details
  //   const event = await eventFactory.events(0);
  //   console.log("Event Data:", event);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
