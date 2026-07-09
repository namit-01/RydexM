import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const pid = (await context.params).id;
    const partner = await User.findById(pid);
    if (!partner || partner.role != "partner") {
      return NextResponse.json(
        { message: "Partner not exists" },
        { status: 400 },
      );
    }
    const { rs } = await req.json();

    partner.partnerStatus = "rejected";
    partner.rejectionReason = rs;
    await partner.save();

    return NextResponse.json(
      { message: "Partner rejected successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
