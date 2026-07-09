import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Vehicle from "@/models/vehicle.model";
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unautghorized" }, { status: 400 });
    }
    console.log("Vehicle model:", Vehicle.modelName);

    const user = await User.findOne({ email: session.user.email });
    let booking;
    if (user.role == "partner") {
      booking = await Booking.findOne({
        driver: user._id,
      }).populate("user vehicle driver");
    } else {
      booking = await Booking.findOne({
        user: user._id,
        bookingStatus: { $in: ["confirmed", "started"] },
      }).populate("user vehicle driver");
    }

    await booking.populate("vehicle");

    console.log(booking);
    return NextResponse.json(booking, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `error while getting partner my-active ${err}` },
      { status: 500 },
    );
  }
}
