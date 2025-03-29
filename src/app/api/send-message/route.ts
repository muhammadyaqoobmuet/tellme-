import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { IMessage } from "@/models/message.models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as IMessage);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message:
          e instanceof Error ? e.message : "error while sending messages",
      },
      { status: 500 }
    );
  }
}
