import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }
    const totalPartner = await User.countDocuments({ role: "partner" });

    const totalApprovedPartner = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });
    const pendingPartnerUsers = await User.find({
      role: "partner",
      partnerStatus: "pending",
      partnerOnboardingSteps: { $gte: 3 },
    });

    const totalRejectedPartner = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });
    const totalPendingPartner = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });
    const partnerIds = pendingPartnerUsers.map((p) => p._id);
    const partnerVehicles = await Vehicle.find({ owner: { $in: partnerIds } });
    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.type]),
    );
    const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      vehicleType: vehicleTypeMap.get(String(p._id)),
    }));
    const pendingVehicles = await Vehicle.find({ status: "pending" }).populate(
      "owner",
    );
    return NextResponse.json(
      {
        pendingVehicles,
        stats: {
          totalPartner,
          totalApprovedPartner,
          totalPendingPartner,
          totalRejectedPartner,
        },

        pendingPartnersReviews,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(`Admin Dashboard error ${err}`);
    return NextResponse.json(
      { message: `Admin Dashboard error ${err}` },
      { status: 500 },
    );
  }
}
