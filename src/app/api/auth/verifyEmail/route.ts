import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Please send email" },
        { status: 400 },
      );
    }
    if (!otp) {
      return NextResponse.json({ message: "Please send otp" }, { status: 400 });
    }
    await connectDb();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User Does not exist" },
        { status: 400 },
      );
    }
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email Already Verified" },
        { status: 200 },
      );
    }
    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Otp Does Not Matched" },
        { status: 400 },
      );
    }
    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return NextResponse.json({ message: "Otp Expired" }, { status: 400 });
    }
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return NextResponse.json({ message: "Otp Verified" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error ${err}` },
      { status: 500 },
    );
  }
}
