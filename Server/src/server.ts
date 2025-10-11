import app from "@/app.js";
import dotenv from "dotenv";
import { connectDB } from "@/config/dbConnect";

dotenv.config();

const ConnectToDBThenStartServer = async () => {
  const PORT = process.env.PORT || 8000;
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

ConnectToDBThenStartServer();