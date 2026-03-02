import mongoose from "mongoose";
import { MONGO_URL } from "../config/env.js";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (err) {
        console.log("DB Error", err);
    }
};

export default connectDB;
