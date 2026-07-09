import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
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
    if (partner.partnerStatus == "approved") {
      return NextResponse.json(
        { message: "Partner already approved" },
        { status: 400 },
      );
    }
    partner.partnerStatus = "approved";
    partner.partnerOnboardingSteps = 4;
    partner.videoKycStatus = "pending";
    await partner.save();
    const doc = await PartnerDocs.findOne({ owner: pid });
    if (!doc) {
      return NextResponse.json(
        { message: "Documents are not uploaded" },
        { status: 400 },
      );
    }
    const bank = await PartnerBank.findOne({ owner: pid });
    if (!bank) {
      return NextResponse.json(
        { message: "Bank detaiks not uploaded" },
        { status: 400 },
      );
    }
    doc.status = "approved";
    bank.status = "verified";
    await doc.save();
    await bank.save();
    return NextResponse.json(
      { message: "Partner Approved successfully" },
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
