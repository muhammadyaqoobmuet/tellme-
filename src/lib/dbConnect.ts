import { error } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // now flow here read from here
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }

  // first see here
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      process.exit(1);
    }
  }
}

export { dbConnect };
