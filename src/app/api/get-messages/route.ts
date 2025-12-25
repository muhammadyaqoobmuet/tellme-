import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "messages", // the collection name for messages
          localField: "messages",
          foreignField: "_id",
          as: "messages",
        },
      },
      // Unwind the messages array to sort each message individually
      { $unwind: "$messages" },
      // Sort messages by createdAt in descending order
      { $sort: { "messages.createdAt": -1 } },
      // Group them back into an array
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    console.log(user);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { message: "No messages", success: false },
        { status: 200 }
      );
    }

    return NextResponse.json({ messages: user[0].messages }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message:
          e instanceof Error ? e.message : "Error while fetching user messages",
      },
      { status: 500 }
    );
  }
}
