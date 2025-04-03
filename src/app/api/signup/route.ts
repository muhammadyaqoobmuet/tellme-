import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    await dbConnect();

    // checking username to find out if it's usable
    const existingUserByNameAndVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByNameAndVerified) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    // find email conditions
    const existingUserByEmail = await UserModel.findOne({ email });
    let user;
    let verifyCode;

    if (existingUserByEmail) {
      // User exists with this email
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // Update the details with new password
        const hashPassword = await bcrypt.hash(password, 10);
        // fix verify code
        const verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        const verifyCodeExpiry = new Date(Date.now() + 3600000);

        existingUserByEmail.username = username;
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

        user = await existingUserByEmail.save();
      }
    } else {
      // First time user with this email
      const hashPassword = await bcrypt.hash(password, 10);
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(verifyCode);
      const expiryDate = new Date(Date.now() + 3600000);

      user = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      await user.save();
    }

    // Create email transporter
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
      text: `Your verification code is: ${verifyCode}`,
      // You could also use HTML for a nicer email
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for signing up! Please use the code below to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verifyCode}</strong>
          </div>
          <p>This code will expire in 1 hour.</p>
        </div>
      `,
    };

    // Send the email (without awaiting to speed up response)
    const emailPromise = transporter.sendMail(mailOptions);

    // Return success response immediately
    const response = Response.json({
      success: true,
      message: "User created successfully. Verification email sent.",
      userId: user._id,
    });

    // Handle email sending in the background
    emailPromise.catch((error) => {
      console.error("Failed to send verification email:", error);
      // Optionally log this to a monitoring system
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during signup",
      },
      { status: 500 }
    );
  }
}
