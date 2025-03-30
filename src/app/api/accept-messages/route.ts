import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

// to change status of user  form accepting to not accepting messages
export async function POST(req: Request) {
  await dbConnect();
  try {
    // get session we have had created in auth
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated " },
        { status: 401 }
      );
    }

    const userId = user._id;

    const { acceptMessages } = await req.json();

    const findingUserAndUpdatingStatus = await UserModel.findOneAndUpdate(
      { _id: userId }, //  Correct filter (if userId is the MongoDB _id)
      { isAcceptingMessage: acceptMessages },
      { new: true } //  Returns the updated document
    );

    if (!findingUserAndUpdatingStatus) {
      return NextResponse.json(
        { success: false, message: "User not found " },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        findingUserAndUpdatingStatus,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message:
          e instanceof Error
            ? e.message
            : "error while fetching user status of acccepting messages",
      },
      { status: 500 }
    );
  }
}

// to get message status of user is it accecpting messages or not
export async function GET() {
  await dbConnect();
  try {
    // one point to note down that we gets eesion then we get user from that session because we have injected that session  from next auth
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated " },
        { status: 401 }
      );
    }

    const userId = user._id;

    const userAccpetingMessages = await UserModel.findOne({
      _id: userId,
    });

    if (!userAccpetingMessages) {
      return NextResponse.json(
        { success: false, message: "User not found with that id " },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: userAccpetingMessages.isAcceptingMessage },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message:
          e instanceof Error
            ? e.message
            : "error while fetching user status of acccepting messages",
      },
      { status: 500 }
    );
  }
}
