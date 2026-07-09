import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    console.log(session);
    if (!session || !session.user) {
      return NextResponse.json({ message: "anauthorized" }, { status: 400 });
    }
    const user = await User.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 },
      );
    }
    const formdata = await req.formData();
    console.log(formdata);
    const aadhar = formdata.get("aadhar") as Blob | null;
    const license = formdata.get("license") as Blob | null;
    const rc = formdata.get("rc") as Blob | null;
    if (!aadhar || !license || !rc) {
      return NextResponse.json(
        { message: "missing documents" },
        { status: 400 },
      );
    }
    let aadharUrl;
    let licenseUrl;
    let rcUrl;

    if (aadhar) {
      let url = await uploadOnCloudinary(aadhar);
      console.log("url", url);
      if (!url) {
        return NextResponse.json(
          { message: "aadhar upload failed" },
          { status: 500 },
        );
      }
      aadharUrl = url;
    }
    if (rc) {
      let url = await uploadOnCloudinary(rc);
      if (!url) {
        return NextResponse.json(
          { message: "rc upload failed" },
          { status: 500 },
        );
      }
      rcUrl = url;
    }
    if (license) {
      let url = await uploadOnCloudinary(license);
      if (!url) {
        return NextResponse.json(
          { message: "license upload failed" },
          { status: 500 },
        );
      }
      licenseUrl = url;
    }
    let p = await PartnerDocs.findOne({ owner: user._id });
    if (p) {
      p.aadharUrl = aadharUrl;
      p.rcUrl = rcUrl;
      p.licenseUrl = licenseUrl;
      await p.save();
    } else {
      p = await PartnerDocs.create({
        aadharUrl: aadharUrl,
        rcUrl: rcUrl,
        licenseUrl: licenseUrl,
        owner: user._id,
      });
    }
    if (user.partnerOnboardingSteps < 2) {
      user.partnerOnboardingSteps = 2;
    } else {
      user.partnerOnboardingSteps = 3;
    }

    user.role = "partner";
    user.partnerStatus = "pending";
    await user.save();
    return NextResponse.json(
      {
        message: "Documents uploaded successfully",
        urls: {
          aadhar: aadharUrl,
          license: licenseUrl,
          rc: rcUrl,
        },
        partnerDocs: p,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Internal server error ${err}` },
      { status: 500 },
    );
  }
}
