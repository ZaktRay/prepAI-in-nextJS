import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/lib/db";

export async function GET(request){
  try{
    await connectDB();
    const token = request.cookies.get("token")?.value;
    const id = verifyToken(token).id;
    const user = await User.findById(id);
    if(!user){
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json({success : true , user},{ status: 200 });
  }
  catch(err){
    console.log(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}