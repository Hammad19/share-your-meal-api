import mongoose from "mongoose";

// User Schema Definition
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Define User Model
const User = mongoose.model("user", UserSchema);

export default User;