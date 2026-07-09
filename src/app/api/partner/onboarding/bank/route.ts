import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "unauthorised" }, { status: 400 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 },
      );
    }
    const { accountHolder, accountNumber, ifsc, upi, mobileNumber } =
      await req.json();
    if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
      return NextResponse.json(
        { message: "Incomplete details" },
        { status: 400 },
      );
    }
    let bank = await PartnerBank.findOne({ owner: user._id });
    if (bank) {
      bank.accountHolder = accountHolder;
      bank.accountNumber = accountNumber;
      bank.ifsc = ifsc;
      bank.upi = upi;
      bank.status = "added";
      await bank.save();
    } else {
      bank = await PartnerBank.create({
        owner: user._id,
        accountHolder,
        accountNumber,
        upi,
        ifsc,
        status: "added",
      });
    }
    user.mobileNumber = mobileNumber;

    user.partnerOnboardingSteps = 3;

    user.partnerStatus = "pending";
    await user.save();
    return NextResponse.json(bank, { status: 200 });
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 },
      );
    }
    const b = await PartnerBank.findOne({ owner: user._id });
    if (!b) {
      return NextResponse.json(
        { message: "No bank account " },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ b }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
