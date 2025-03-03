import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";
import { eventSchema } from "@/validationSchemas";
import { group } from "console";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //validate if name is empty later
    // if(!body){
    //   return NextResponse.json({status:400})
    // }

    const group = await pinata.groups.create({
      name: "My new group",
    });

    return NextResponse.json({ groupId: group.id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const body = req.json();
    //validate if name is empty later
    // if(!body){
    //   return NextResponse.json({status:400})
    // }

    const groups = await pinata.groups.list().name("GROUP NAME TO GET");

    const group = groups[0];

    // {groupId:group}
    return NextResponse.json({ groupId: group }, { status: 200 });

    //TO BE CONTINUED
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
