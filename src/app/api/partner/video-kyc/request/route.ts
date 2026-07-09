import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || session.user.role != "partner") {
      return NextResponse.json({ message: "unathorized" }, { status: 400 });
    }
    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 400 },
      );
    }
    if (partner.videoKycStatus != "rejected") {
      return NextResponse.json(
        { message: "Not allowed for this request" },
        { status: 400 },
      );
    } else {
      partner.videoKycStatus = "pending";
      partner.videoKycRejectionReason = undefined;
      partner.videoKycRoomId = undefined;
      await partner.save();
      return NextResponse.json({ message: "succes" }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
