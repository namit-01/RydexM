import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    console.log("api hittt");
    await connectDb();
    const session = await auth();
    if (
      !session ||
      !session.user ||
      !session.user.email ||
      session.user.role != "admin"
    ) {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }
    console.log("beorepid");
    const pid = (await context.params).id;
    console.log("hiii", pid);
    const partner = await User.findById(pid);
    if (!partner || partner.role != "partner") {
      return NextResponse.json(
        { message: "Partner does not exist" },
        { status: 400 },
      );
    }

    const vehicle = await Vehicle.findOne({ owner: pid });
    const doc = await PartnerDocs.findOne({ owner: pid });
    const bank = await PartnerBank.findOne({ owner: pid });
    return NextResponse.json(
      {
        partner,
        bank: bank || null,
        documents: doc || null,
        vehicle: vehicle || null,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(`Admin get partner error ${err}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
