import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";
import { eventSchema } from "@/validationSchemas";

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    // const validation = eventSchema.safeParse(body);
    // if (!validation.success) {
    //   return NextResponse.json(validation.error.errors, { status: 400 });
    // }

    const json = {
      id: 999999999,
      name: "dasdas12",
      description: "dasdas",
      date: "2025-03-25T03:00:00.000Z",
      location: "dasdaddsa",
      ticketPrice: 10,
      totalTickets: 10,
    };

    const upload = await pinata.upload
      .json(json)
      .addMetadata({
        name: "file-grouped.json",
      })
      .group("PENDING GET GROUP FROM /API/GROUP"); // TODO:

    const cid = await pinata.gateways.convert(upload.IpfsHash);
    return NextResponse.json({ cid: cid });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
