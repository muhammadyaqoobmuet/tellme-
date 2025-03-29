import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

export const usernameQureySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const qureyParam = {
      username: searchParams.get("username"),
    };

    // validate with zod and respone back
    const result = usernameQureySchema.safeParse(qureyParam);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "invalid params",
        },
        { status: 400 }
      );
    }

    console.log("result.data" + result.data);
    const { username } = result.data;

    const usernameExistsAndVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (usernameExistsAndVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "username taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "username available",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(
        {
          success: false,
          message: "error while checking username !please retry",
        },
        { status: 500 }
      );
    }
  }
}
