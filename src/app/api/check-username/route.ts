import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";

import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  const usernameValidation = z
    .string()
    .min(2, "username should be of atleast two chars")
    .max(20, "username should be less than 20 chars")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "username must contains CAPITAL lowercase and digits and does not cotains special chars"
    );

  const usernameQuerySchema = z.object({
    username: usernameValidation,
  });

  type UsernameQuery = z.infer<typeof usernameQuerySchema>;
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const qureyParam: UsernameQuery = {
      username: searchParams.get("username"),
    };

    // validate with zod and respone back
    const result = usernameQuerySchema.safeParse(qureyParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username parameter",
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
