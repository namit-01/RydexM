import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "User is not Authenticated",
        },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email: session?.user.email });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 400 });
    } else {
      return NextResponse.json(user, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
