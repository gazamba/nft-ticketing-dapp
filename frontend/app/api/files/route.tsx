import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    // const data = await request.formData();
    // const file: File | null = data.get("file") as unknown as File;
    // const uploadData = await pinata.upload.file(file);
    // const url = await pinata.gateways.convert(uploadData.IpfsHash);

    const data = await request.json();
    const upload = await pinata.upload.json({
      content: data,
      name: "TO BE DEFINED",
    });
    const url = await pinata.gateways.convert(upload.IpfsHash);
    // url = "IpfsHash": "QmXLM5D33rzCogZVtL9Qz8fJbnaT74SPaZyMv5cxSL4ds3" = CID

    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
