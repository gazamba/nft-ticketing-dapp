import { NextRequest, NextResponse } from "next/server";
import { ticketNFTSchema } from "@/validationSchemas";
import { pinata } from "@/utils/config";

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { tickets, pinataGroupId } = await req.json();
  // const {tickets} = ticketNFTSchema.array().parse(body)
  try {
    const ticketCIDs = [];
    for (const ticket of tickets) {
      const metadata = {
        name: ticket.name,
        description: `Admission to Event ${params.eventId}`,
        image: `https://gateway.pinata.cloud/ipfs/fakeIdForNow`,
        attributes: [
          { trait_type: "Event ID", value: params.eventId },
          { trait_type: "Token ID", value: ticket.tokenId },
        ],
      };
      const upload = await pinata.upload
        .json(metadata)
        .addMetadata({
          name: `event-${params.eventId}-ticket-${ticket.tokenId}.json`,
        })
        .group(pinataGroupId);

      ticketCIDs.push(upload.IpfsHash);
    }

    return NextResponse.json(
      { tokenId: tickets.map((t: { tokenId: any }) => t.tokenId), ticketCIDs },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
