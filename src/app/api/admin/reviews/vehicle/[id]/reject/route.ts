import { auth } from "@/auth";
import connectDb from "@/lib/db";

import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

    const { reason } = await req.json();
    if (!reason) {
      return NextResponse.json(
        { message: "Rejection reason not provided" },
        { status: 400 },
      );
    }
    vehicle.status = "rejected";
    vehicle.rejectionReason = reason;

    await vehicle.save();
    return NextResponse.json({ message: "Rejected" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal srever error" },
      { status: 500 },
    );
  }
}
