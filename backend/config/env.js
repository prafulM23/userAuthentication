import dotenv from "dotenv";
dotenv.config()

export let APP_PASS = process.env.APP_PASS
export let PORT = process.env.PORT
export let JWT_KEY = process.env.JWT_KEY
export let MONGO_URL = process.env.MONGO_URL
export let APP_USER = process.env.APP_USER