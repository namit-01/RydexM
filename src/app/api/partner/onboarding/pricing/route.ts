import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user || session.user.role !== "partner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 400 },
      );
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle does not exist" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const baseFare = formData.get("baseFare");
    const pricePerKm = formData.get("pricePerKm");
    const waitingCharge = formData.get("waitingCharge");

    let updated = false;

    if (image instanceof File && image.size > 0) {
      vehicle.imageUrl = await uploadOnCloudinary(image);
      updated = true;
    }
    if (baseFare != null) {
      vehicle.baseFare = Number(baseFare);
      updated = true;
    }
    if (waitingCharge != null) {
      vehicle.waitingCharge = Number(waitingCharge);
      updated = true;
    }
    if (pricePerKm != null) {
      vehicle.pricePerKM = Number(pricePerKm);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 },
      );
    }

    vehicle.status = "pending";
    vehicle.rejectionReason = undefined;
    partner.partnerOnboardingSteps = 6;

    await vehicle.save();
    await partner.save();

    return NextResponse.json(vehicle, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function GET() {
  try {
    connectDb();
    const session = await auth();
    if (!session || !session.user || session.user.role != "partner") {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }
    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 400 },
      );
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle does not exist" },
        { status: 400 },
      );
    }
    return NextResponse.json(vehicle, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
