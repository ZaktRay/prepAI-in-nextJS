'use server'
import User from "@/models/user.model";
import { connectDB } from "@/lib/db"
import { createToken } from "@/lib/jwt";
import {setCookie} from "@/lib/cookie";


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
        const token = createToken(user._id);
        setCookie(token);
        
        return {
            success: true,
            message: 'user successfully registered',
            token
        }
    } catch (err) {
        console.log(err);
         return { success: false, message: "Internal Server Error", status: 500 };
    }


}