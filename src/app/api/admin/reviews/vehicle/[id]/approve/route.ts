import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || session.user.role != "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }
    const vid = (await context.params).id;
    const vehicle = await Vehicle.findOne({ _id: vid }).populate("owner");
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 400 },
      );
    }
    const partner = await User.findOne({ _id: vehicle.owner._id });
    if (!partner) {
      return NextResponse.json(
        { message: "partner not found" },
        { status: 400 },
      );
    }
    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    partner.partnerOnboardingSteps = 7;
    await partner.save();
    await vehicle.save();
    return NextResponse.json({ message: "Approved" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal srever error" },
      { status: 500 },
    );
  }
}
