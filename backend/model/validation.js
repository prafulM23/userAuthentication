
import mongoose from "mongoose";
const authSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }

})

export default mongoose.model("sign_data", authSchema)

