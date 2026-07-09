import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { lon, lat, vehicleType } = await req.json();
    console.log({
      lat,
      lon,
      typeLat: typeof lat,
      typeLon: typeof lon,
    });
    if (!lat || !lon) {
      return NextResponse.json(
        { message: "Coordinates not found" },
        { status: 400 },
      );
    }
    if (!vehicleType) {
      return NextResponse.json(
        { message: "Vehicle Type not found" },
        { status: 400 },
      );
    }
    const partners = await User.find({
      role: "partner",
      isOnline: true,
      partnerStatus: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: 20000,
        },
      },
    });
    const partner_ids = partners.map((p) => p._id);
    console.log(partner_ids);
    if (partner_ids.length == 0) {
      return NextResponse.json([], { status: 200 });
    }
    const vehicles = await Vehicle.find({
      owner: {
        $in: partner_ids,
      },
      type: vehicleType,
      status: "approved",
      isActive: true,
    }).lean();
    if (vehicles.length == 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(vehicles, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}
