import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role != "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }
    await connectDb();
    const pid = (await context.params).id;
    const partner = await User.findById(pid);
    if (!partner || partner.role != "partner") {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 400 },
      );
    }
    const roomId = `kyc-${partner._id}-${Date.now()}`;
    partner.videoKycRoomId = roomId;
    partner.videoKycStatus = "in_progress";
    partner.partnerOnboardingSteps = 4;
    await partner.save();
    return NextResponse.json({ roomId }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
