'use server'
import User from "@/models/user.model";
import { connectDB } from "@/lib/db"
import { createToken } from "@/lib/jwt";


export async function signUp(data){
    await connectDB();
    try {
        const {name, username, email, password} = data;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return{
                success: false,
                message: 'user with this email already exists', 
                status : 400
            }
        }

        const user = await User.create({ name, email, username, password });

        return {
            success: true,
            message: 'user successfully registered',
            token: createToken(user._id)
        }
    } catch (err) {
        console.log(err);
         return { success: false, message: "Internal Server Error", status: 500 };
    }


}