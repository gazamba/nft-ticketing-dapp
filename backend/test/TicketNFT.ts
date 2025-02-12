import { expect } from "chai";
import { ethers } from "hardhat";
import { TicketNFT } from "../typechain-types";

describe("TicketNFT", function () {
  let ticketNFT: TicketNFT;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TicketNFT = await ethers.getContractFactory("TicketNFT");
    ticketNFT = await TicketNFT.deploy();
    await ticketNFT.waitForDeployment();
  });

  it("Should deploy the contract with the correct name and symbol", async function () {
    expect(await ticketNFT.name()).to.equal("EventTicket");
    expect(await ticketNFT.symbol()).to.equal("ETK");
  });

  it("Should allow the owner to mint a ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";

    await expect(ticketNFT.connect(owner).mintTicket(addr1.address, tokenURI))
      .to.emit(ticketNFT, "Transfer")
      .withArgs(ethers.ZeroAddress, addr1.address, 0);

    expect(await ticketNFT.ownerOf(0)).to.equal(addr1.address);

    expect(await ticketNFT.tokenURI(0)).to.equal(tokenURI);
  });

  it("Should increment the token ID after minting", async function () {
    const tokenURI1 = "https://example.com/ticket/1";
    const tokenURI2 = "https://example.com/ticket/2";

    await ticketNFT.connect(owner).mintTicket(addr1.address, tokenURI1);
    expect(await ticketNFT.ownerOf(0)).to.equal(addr1.address);

    await ticketNFT.connect(owner).mintTicket(addr2.address, tokenURI2);
    expect(await ticketNFT.ownerOf(1)).to.equal(addr2.address);
  });

  it("Should not allow non-owners to mint tickets", async function () {
    const tokenURI = "https://example.com/ticket/1";

    await expect(
      ticketNFT.connect(addr1).mintTicket(addr1.address, tokenURI)
    ).to.be.revertedWithCustomError(ticketNFT, "OwnableUnauthorizedAccount");
  });

  it("Should return the correct token URI after minting", async function () {
    const tokenURI = "https://example.com/ticket/1";

    await ticketNFT.connect(owner).mintTicket(addr1.address, tokenURI);

    expect(await ticketNFT.tokenURI(0)).to.equal(tokenURI);
  });
});
