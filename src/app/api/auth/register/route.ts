import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDb();
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password should of more than 6 characters" },
        { status: 400 },
      );
    }
    let user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already exits" },
        { status: 400 },
      );
    }

    const otp = await Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
    if (user && !user.isEmailVerified) {
      user.name = name;
      user.otp = otp;
      user.email = email;
      user.otpExpires = otpExpiredAt;
      user.password = hashedPassword;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires: otpExpiredAt,
      });
    }
    await sendMail(
      email,
      "Verify your email - OTP",
      `
  <div style="font-family: Arial, sans-serif; background:#f6f8fa; padding:20px;">
    <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:10px; border:1px solid #eee;">
      
      <h2 style="color:#111; margin-bottom:10px;">Email Verification</h2>
      
      <p style="color:#555; font-size:14px;">
        Use the following One-Time Password (OTP) to verify your email address.
      </p>

      <div style="text-align:center; margin:25px 0;">
        <span style="
          display:inline-block;
          font-size:28px;
          letter-spacing:6px;
          font-weight:bold;
          padding:12px 20px;
          border:1px dashed #999;
          border-radius:8px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color:#777; font-size:13px;">
        This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
      </p>

      <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

      <p style="color:#aaa; font-size:12px; text-align:center;">
        If you did not request this, you can safely ignore this email.
      </p>

    </div>
  </div>
  `,
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
