import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }

    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return NextResponse.json(
        { message: "partner not found" },
        { status: 400 },
      );
    }

    const count = await Booking.find({
      driver: partner._id,
      bookingStatus: "requested",
    });
    return NextResponse.json(count, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
