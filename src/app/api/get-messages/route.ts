import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// get messages
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
      { $unwind: "$messages" }, // ✅ Fixed $unwind
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { messages: user[0].messages }, // ✅ Fixed array access
      { status: 200 }
    );
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