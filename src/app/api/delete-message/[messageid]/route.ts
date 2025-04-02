import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";

export async function DELETE(
  req: NextRequest, // Ensure request type is correct
  { params }: { params: Promise<{ messageid: string }> } // Explicitly defining 'context'
) {
  const { messageid } = await params; // Destructuring for safety
  console.log(messageid);

  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageid)) {
      return NextResponse.json(
        { success: false, message: "Invalid message ID" },
        { status: 400 }
      );
    }

    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: messageid } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No message found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Error while deleting" },
      { status: 500 }
    );
  }
}
