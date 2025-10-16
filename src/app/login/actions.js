'use server'
import { connectDB } from "@/lib/db"
import User from "@/models/user.model";
import { createToken } from "@/lib/jwt";

export async function submitLogin(data) {
  await connectDB();
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "User with this email does not exist", status: 400 };
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return { success: false, message: "Invalid password", status: 400 };
    }

    const token = createToken(user._id);

    return { success: true, message: "Login successful", token, status: 200 };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
