import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

// /api/groups req: {"name":"groupName"}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const group = await pinata.groups.create({
      name: name,
    });

    return NextResponse.json({ group: group }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

// /api/groups or /api/groups?name=something
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams);
    const name = searchParams.get("name");
    console.log(name);

    if (name) {
      const group = await pinata.groups.list().name(name);
      return NextResponse.json({ group: group }, { status: 200 });
    }

    const groups = await pinata.groups.list();

    return NextResponse.json({ groups: groups }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
