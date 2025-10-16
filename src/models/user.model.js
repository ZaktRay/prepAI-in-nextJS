import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6
    },
    username : {
        type : String,
        required : true,
    },
    tests : {
        type : Array,
        default : []
    }
}, { timestamps: true })

userSchema.pre('save',async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;