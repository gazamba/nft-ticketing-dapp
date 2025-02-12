import { expect } from "chai";
import { ethers } from "hardhat";
import { EventFactory } from "../typechain-types";

describe("EventFactory", function () {
  let eventFactory: EventFactory;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners(); // mock accounts for testing

    const EventFactory = await ethers.getContractFactory("EventFactory");
    eventFactory = await EventFactory.deploy();
    await eventFactory.waitForDeployment();
  });

  it("Should create a new event and emit EventCreated", async function () {
    const name = "Web3 Conference";
    const date = "2023-12-25";
    const location = "New York";
    const ticketPrice = ethers.parseEther("0.1");
    const totalTickets = 1000;

    await expect(
      eventFactory
        .connect(addr1)
        .createEvent(name, date, location, ticketPrice, totalTickets)
    )
      .to.emit(eventFactory, "EventCreated")
      .withArgs(0, name, addr1.address);

    const event = await eventFactory.events(0);
    expect(event.eventId).to.equal(0);
    expect(event.name).to.equal(name);
    expect(event.date).to.equal(date);
    expect(event.location).to.equal(location);
    expect(event.ticketPrice).to.equal(ticketPrice);
    expect(event.totalTickets).to.equal(totalTickets);
    expect(event.organizer).to.equal(addr1.address);
  });

  it("Should increment the nextEventId after creating an event", async function () {
    const name = "Web3 Conference";
    const date = "2023-12-25";
    const location = "New York";
    const ticketPrice = ethers.parseEther("0.1");
    const totalTickets = 1000;

    await eventFactory
      .connect(addr1)
      .createEvent(name, date, location, ticketPrice, totalTickets);
    const nextEventId = await eventFactory.getNextEventId();
    expect(nextEventId).to.equal(1);
  });

  it("Should allow multiple events to be created", async function () {
    const name1 = "Web3 Conference";
    const date1 = "2023-12-25";
    const location1 = "New York";
    const ticketPrice1 = ethers.parseEther("0.1");
    const totalTickets1 = 1000;

    const name2 = "AI Conference";
    const date2 = "2024-01-01";
    const location2 = "Los Angeles";
    const ticketPrice2 = ethers.parseEther("0.2");
    const totalTickets2 = 2000;

    await eventFactory
      .connect(addr1)
      .createEvent(name1, date1, location1, ticketPrice1, totalTickets1);
    await eventFactory
      .connect(addr1)
      .createEvent(name2, date2, location2, ticketPrice2, totalTickets2);

    const event1 = await eventFactory.events(0);
    const event2 = await eventFactory.events(1);

    expect(event1.name).to.equal(name1);
    expect(event2.name).to.equal(name2);
  });
});
