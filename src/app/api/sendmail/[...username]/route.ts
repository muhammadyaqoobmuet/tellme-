import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import nodemailer from "nodemailer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // Convert the incoming request to JSON
  const { username } = await params;

  await dbConnect();
  const user = await UserModel.findOne({ username });
  const verificationCode = user?.verifyCode;
  // Create the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yaqoobahmed45700@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  // Setup email options
  const mailOptions = {
    from: "yaqoobahmed45700@gmail.com",
    to: user?.email,
    subject: "Verify Your Email Address",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Failed to send email",
        error: "at sending mail ",
      }),
      { status: 500 }
    );
  }
}
