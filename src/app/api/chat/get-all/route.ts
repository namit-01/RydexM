import connectDb from "@/lib/db";
import ChatMessage from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId } = await req.json();

    const chat = await ChatMessage.find({
      bookingId,
    }).sort({
      createdAt: 1,
    });

    return NextResponse.json(chat);
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
