import connectDb from "@/lib/db";
import ChatMessage from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { bookingId, sender, text } = await req.json();
    if (!bookingId || !sender || !text) {
      return NextResponse.json(
        { message: "Incomplete information" },
        { status: 4000 },
      );
    }
    const chat = await ChatMessage.create({ bookingId, sender, text });
    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
