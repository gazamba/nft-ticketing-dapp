import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";
import { eventFormSchema } from "@/validationSchemas";

// /api/events/{eventId}/metadata req: eventSchema
export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    if (!params.eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      date,
      location,
      ticketPrice,
      totalTickets,
      pinataGroupId,
    } = body;

    const metadata = {
      name,
      description,
      category,
      date,
      location,
      ticketPrice,
      totalTickets,
    };

    const validation = eventFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const upload = await pinata.upload
      .json(metadata)
      .addMetadata({
        name: `event-${params.eventId}.json`,
      })
      .group(pinataGroupId);

    const cid = await pinata.gateways.convert(upload.IpfsHash);

    return NextResponse.json({ cid: cid }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
