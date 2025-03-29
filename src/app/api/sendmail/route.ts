import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  // Convert the incoming request to JSON
  const { email } = await request.json();

  await dbConnect();
  const user = await UserModel.findOne({ email });
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
    to: email,
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
