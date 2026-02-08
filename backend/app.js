import express from "express"
import cors from "cors"
import * as logic from "./controllar/logic.js"
import connectDB from "./model/connectMD.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();


const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://userauthentication-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
}));

app.post("/sign", logic.sign_up)
app.post("/login", logic.login)
app.post("/forget", logic.forget)
app.post("/verify", logic.verify)
app.post("/reset", logic.reset)

app.get("/read", logic.data)


const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});