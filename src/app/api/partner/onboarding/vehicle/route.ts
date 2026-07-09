import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";
const check = (number: string) => {
  const str = number;
  const chars = str.split("");

  for (let i = 0; i < chars.length; i++) {
    const code = chars[i].charCodeAt(0);

    // Check ranges
    if (
      (code >= 48 && code <= 57) || // 0–9
      (code >= 65 && code <= 90) || // A–Z
      (code >= 97 && code <= 122) // a–z
    ) {
      // valid character → continue
    } else {
      return false; // invalid character found
    }
  }

  return true;
};
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorised" }, { status: 400 });
    }
    const user = await User.findOne({ email: session?.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const { type, number, vehicleModel } = await req.json();
    if (!type || !number || !vehicleModel) {
      return NextResponse.json(
        { message: "missing information" },
        { status: 400 },
      );
    }
    if (!check(String(number))) {
      return NextResponse.json(
        { message: "Please Enter Valid Vehicle Number" },
        { status: 400 },
      );
    }
    const vehicleNumber = number.toUpperCase();
    console.log(type);
    console.log(number);
    console.log(vehicleModel);

    let vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;

      await vehicle.save();
    } else {
      const v = await Vehicle.findOne({ number: vehicleNumber });
      if (v) {
        return NextResponse.json(
          { message: "Vehicle number already exsist" },
          { status: 400 },
        );
      }
      vehicle = await Vehicle.create({
        owner: user._id,
        number: vehicleNumber,
        type: type,
        vehicleModel,
        isActive: true,
      });
    }
    if (user.partnerOnboardingSteps < 1) {
      user.partnerOnboardingSteps = 1;
    } else if (user.partnerOnboardingSteps > 2) {
      user.partnerOnboardingSteps = 3;
    }
    user.role = "partner";
    user.partnerStatus = "pending";
    await user.save();
    return NextResponse.json(vehicle, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authorized" },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not exits" }, { status: 400 });
    }
    const vehicle = await Vehicle.findOne({ owner: user._id });

    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
