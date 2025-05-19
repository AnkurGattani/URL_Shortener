import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
            unique: true,
        },
        password: {
            type: String, 
            required: true
        }
    }, 
    { timestamps: true }
);

userSchema.pre("save", async (next) => {
    if(!this.isModified('password'))    // if password(this) is not modified, return to next step (proceed further)
        return next();

    // else we generate a cryptographic salt of say 10 rounds and change the plain text password in 'this' to hashed password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Define 'matchPassword' method to compare while logging in, the entered password with the stored, hashed Password
userSchema.methods.matchPassword = async (enteredPassword) => {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;