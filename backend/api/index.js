import "../config/env.js"

import express from "express"
import cors from "cors"
import * as logic from "../controllar/logic.js"
import connectDB from "../model/connectMD.js";

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(cors());

app.post("/sign", logic.sign_up)
app.post("/login", logic.login)
app.post("/forget", logic.forget)
app.post("/verify", logic.verify)
app.post("/reset", logic.reset)
app.get("/read", logic.data)


export default app

