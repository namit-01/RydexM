import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || session.user.role != "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const { action, roomId, reason } = await req.json();

    if (action != "approved" && action != "rejected") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
    const partner = await User.findOne({ videoKycRoomId: roomId });
    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 400 },
      );
    }
    if (partner.videoKycStatus == "approved") {
      return NextResponse.json(
        { message: "Already approved" },
        { status: 400 },
      );
    }
    if (action == "approved") {
      partner.videoKycStatus = "approved";
      partner.partnerOnboardingSteps = 5;
      partner.videoKycRejectionReason = undefined;
    } else {
      if (!reason) {
        return NextResponse.json(
          { message: "Rejection reason must provided" },
          { status: 400 },
        );
      }
      partner.videoKycStatus = "rejected";
      partner.videoKycRejectionReason = reason.trim();
    }
    await partner.save();
    return NextResponse.json(partner.videoKycStatus, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
