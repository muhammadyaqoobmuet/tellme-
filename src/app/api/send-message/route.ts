import { dbConnect } from "@/lib/dbConnect";
import { IMessage, MessageModel } from "@/models/message.models";
import { UserModel } from "@/models/user.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = new MessageModel({
      _id: new mongoose.Types.ObjectId(),
      user: user._id, // (optional: add reference to user if needed)
      content,
      createdAt: new Date(),
    });
    await newMessage.save();

    // **Push only the message _id into the user's messages array**
    user.messages.push(newMessage._id);
    await user.save();

    return Response.json(
      {
        message: "Message sent successfully",
        success: true,
        newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
