import mongoose, { Document, Model, Schema } from "mongoose";
import { IMessage } from "./message.models";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: IMessage[];
}

export const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^(?!.*@(tempmail\.com|mailinator\.com|10minutemail\.net|example\.com))[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"], // Fixed typo
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

// nextjs Run on edge it doesnot know either app is already booted instead it bootup again and again so to avoid overhead use checks

export const UserModel =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
