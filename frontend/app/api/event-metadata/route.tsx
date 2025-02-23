import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";
import { eventSchema } from "@/validationSchemas";

export async function POST(request: NextRequest) {
  // TODO: PENDING SECURE ENDPOINT, Group events in a parent folder?

  //   80$ = 40000000000000000 wei

  //expected body, test later
  // const body = {
  //   id: 1,
  //   name: "Web 3 Conference Test 01",
  //   description: "A conference about the future of Web 3.0 technologies. Test",
  //   date: "Friday, June 10, 2025",
  //   location: "Atlantis the Palm, Dubai",
  //   ticketPrice: 40000000000000000, // Wei price
  // };

  const body = await request.json();
  const validation = eventSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const upload = await pinata.upload.json(body, {
    metadata: { name: "json-test-01.json" },
  });
  const url = await pinata.gateways.convert(upload.IpfsHash);
  return NextResponse.json({ url: url });
}
