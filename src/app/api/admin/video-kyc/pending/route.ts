import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }

    const partners = await User.find({
      role: "partner",
      partnerOnboardingSteps: 4,
      videoKycStatus: { $in: ["pending", "in_progress"] },
    });

    return NextResponse.json(partners, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
