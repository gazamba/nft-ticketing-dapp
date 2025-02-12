import { expect } from "chai";
import { ethers } from "hardhat";
import { TicketMarketplace } from "../typechain-types";
import { TicketNFT } from "../typechain-types";

describe("TicketMarketplace", function () {
  let ticketNFT: TicketNFT;
  let ticketMarketplace: TicketMarketplace;
  let owner: any;
  let seller: any;
  let buyer: any;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const TicketNFT = await ethers.getContractFactory("TicketNFT");
    ticketNFT = await TicketNFT.deploy();
    await ticketNFT.waitForDeployment();

    const TicketMarketplace = await ethers.getContractFactory(
      "TicketMarketplace"
    );
    ticketMarketplace = await TicketMarketplace.deploy(ticketNFT.target);
    await ticketMarketplace.waitForDeployment();
  });

  it("Should allow the owner to list a ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";
    const ticketId = 0;
    const price = ethers.parseEther("0.1");

    await ticketNFT.connect(owner).mintTicket(seller.address, tokenURI);

    await expect(ticketMarketplace.connect(seller).listTicket(ticketId, price))
      .to.emit(ticketMarketplace, "TicketListed")
      .withArgs(ticketId, seller.address, price);

    const listing = await ticketMarketplace.listings(ticketId);
    expect(listing.ticketId).to.equal(ticketId);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.price).to.equal(price);
  });

  it("Should not allow non-owners to list a ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";
    const ticketId = 0;
    const price = ethers.parseEther("0.1");

    await ticketNFT.connect(owner).mintTicket(seller.address, tokenURI);

    await expect(
      ticketMarketplace.connect(buyer).listTicket(ticketId, price)
    ).to.be.revertedWith("Not the owner");
  });

  it("Should allow a buyer to purchase a listed ticket", async function () {
    const tokenURI = "https://example.com/ticket/1";
    const ticketId = 0;
    const price = ethers.parseEther("0.1");

    await ticketNFT.connect(owner).mintTicket(seller.address, tokenURI);

    await ticketNFT.connect(seller).approve(ticketMarketplace.target, ticketId);
    await ticketMarketplace.connect(seller).listTicket(ticketId, price);

    await expect(
      ticketMarketplace.connect(buyer).buyTicket(ticketId, { value: price })
    )
      .to.emit(ticketMarketplace, "TicketSold")
      .withArgs(ticketId, buyer.address);

    expect(await ticketNFT.ownerOf(ticketId)).to.equal(buyer.address);

    const listing = await ticketMarketplace.listings(ticketId);
    expect(listing.ticketId).to.equal(0);
    expect(listing.seller).to.equal(ethers.ZeroAddress);
    expect(listing.price).to.equal(0);
  });

  it("Should not allow buying a ticket with incorrect Ether value", async function () {
    const tokenURI = "https://example.com/ticket/1";
    const ticketId = 0;
    const price = ethers.parseEther("0.1");

    await ticketNFT.connect(owner).mintTicket(seller.address, tokenURI);

    await ticketMarketplace.connect(seller).listTicket(ticketId, price);

    await expect(
      ticketMarketplace
        .connect(buyer)
        .buyTicket(ticketId, { value: ethers.parseEther("0.05") })
    ).to.be.revertedWith("Incorrect price");
  });

  it("Should not allow buying a non-listed ticket", async function () {
    const ticketId = 0;

    await expect(
      ticketMarketplace.connect(buyer).buyTicket(ticketId, { value: 0 })
    ).to.be.revertedWithCustomError(ticketNFT, "ERC721NonexistentToken");
  });

  it("Should protect against reentrancy attacks", async function () {
    const MaliciousBuyer = await ethers.getContractFactory("MaliciousBuyer");
    const maliciousBuyer = await MaliciousBuyer.deploy(
      ticketMarketplace.target
    );

    const tokenURI = "https://example.com/ticket/1";
    const ticketId = 0;
    const price = ethers.parseEther("0.1");

    await ticketNFT.connect(owner).mintTicket(seller.address, tokenURI);

    await ticketMarketplace.connect(seller).listTicket(ticketId, price);

    await expect(maliciousBuyer.attack(ticketId, { value: price })).to.be
      .reverted;
  });
});
