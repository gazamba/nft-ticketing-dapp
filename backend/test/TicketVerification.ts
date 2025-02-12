import { expect } from "chai";
import { ethers } from "hardhat";
import { TicketVerification } from "../typechain-types";
import { TicketNFT } from "../typechain-types";

describe("TicketVerification", function () {
  let ticketNFT: TicketNFT;
  let ticketVerification: TicketVerification;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TicketNFT = await ethers.getContractFactory("TicketNFT");
    ticketNFT = await TicketNFT.deploy();
    await ticketNFT.waitForDeployment();

    const TicketVerification = await ethers.getContractFactory(
      "TicketVerification"
    );
    ticketVerification = await TicketVerification.deploy(ticketNFT.target);
    await ticketVerification.waitForDeployment();
  });

  it("Should deploy the TicketVerification contract with the correct ticket contract address", async function () {
    expect(await ticketVerification.ticketContract()).to.equal(
      ticketNFT.target
    );
  });

  it("Should return true if the address owns the ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";

    await ticketNFT.connect(owner).mintTicket(addr1.address, tokenURI);
    const ticketId = 0;

    const isVerified = await ticketVerification.verifyTicket(
      ticketId,
      addr1.address
    );
    expect(isVerified).to.equal(true);
  });

  it("Should return false if the address does not own the ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";

    await ticketNFT.connect(owner).mintTicket(addr1.address, tokenURI);
    const ticketId = 0;

    const isVerified = await ticketVerification.verifyTicket(
      ticketId,
      addr2.address
    );
    expect(isVerified).to.equal(false);
  });

  it("Should revert if the ticket does not exist", async function () {
    const nonExistentTicketId = 999;

    await expect(
      ticketVerification.verifyTicket(nonExistentTicketId, addr1.address)
    ).to.be.revertedWithCustomError(ticketNFT, "ERC721NonexistentToken");
  });
});
