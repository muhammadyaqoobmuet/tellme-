import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ success: false, message: "Code is required" });
    }

    await dbConnect();
 
    const user = await UserModel.findOne({ username: decodeURI(username) })
      .select("verifyCode verifyCodeExpiry isVerified") // Fetch only needed fields
      .lean(); // Convert Mongoose doc to a plain object (faster read)

    console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: "Incorrect code" },
        { status: 400 }
      );
    }

    if (new Date(user.verifyCodeExpiry) <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired, generate a new one",
        },
        { status: 400 }
      );
    }

    // Respond immediately, then update the user in the background
    const response = NextResponse.json(
      { success: true, message: "User verified" },
      { status: 200 }
    );

    // Update user in the background (non-blocking)
    UserModel.updateOne(
      { username: decodeURI(username) },
      { isVerified: true }
    ).exec();

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Error verifying user",
      },
      { status: 500 }
    );
  }
}
