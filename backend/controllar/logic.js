import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "../model/validation.js"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { JWT_KEY, APP_PASS, APP_USER } from "../config/env.js"

const otpgenerate = (length = 4) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += crypto.randomInt(0, 10).toString();
    }
    return otp
}

const transportar = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: APP_USER,
        pass: APP_PASS
    }
})


export const verify = async (req, res) => {
    try {
        const { getotp, getemail, isforgetMood } = req.body;
        if (!getotp || !getemail) {
            return res.status(400).json({ msg: "Missing Data" });
        }
        const exist = await user.findOne({ email: getemail })

        if (!exist) {
            (console.log("user not found"))
            return res.status(404).json({ msg: "user not found" });
        }

        if (!isforgetMood) {

            if (exist.isVerified) {
                return res.status(400).json({ msg: "User already verified" });
            }

            if (exist.otp !== getotp) {
                return res.status(400).json({ msg: "Wrong otp", otp: getotp });
            }

            if (Date.now() > exist.otpExpiry) {
                return res.status(400).json({ msg: "expired otp" });
            }

            exist.isVerified = true;
            exist.otp = undefined;
            exist.otpExpiry = undefined;
            await exist.save();

            const mailoption = {
                from: "prafulm2310@gmail.com",
                to: getemail,
                subject: "Welcome to our User Authentication System ",
                html: `
                <!DOCTYPE html>
               <html>
               <body style="font-family: Arial, sans-serif;">
               <h2>Welcome, ${exist.name}! 🎉</h2>
               <p>Thank you for signing up with <b>User Authentication System</b>.</p>
               <p style="margin-top:20px;">Best Regards,<br> User Authentication System 🚀</p>
               </body>
               </html>`
            }
            try {
                const resMail = await transportar.sendMail(mailoption)
                return res.status(200).json({ msg: " verified, signup successful" });

            } catch (error) {
                return res.status(400).json({ msg: "Mail Server Not Response" });
            }
        }
        else {
            if (exist.otp !== getotp) {
                return res.status(400).json({ msg: "Invalid otp" });
            }
            if (Date.now() > exist.otpExpiry) {
                return res.status(400).json({ msg: "expired otp" });
            }
            exist.otp = undefined;
            exist.otpExpiry = undefined;
            await exist.save();
            res.status(200).json({ msg: "OTP verified! reset your password." });
        }

    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export const sign_up = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const exist = await user.findOne({ email })
        if (exist && exist.isVerified) {
            return res.status(400).json({ msg: "User already exists and verified" });

        }
        const hasspassword = await bcrypt.hash(password, 12)
        const otp = otpgenerate(4)
        if (exist) {
            exist.otp = otp;
            exist.otpExpiry = Date.now() + 5 * 60 * 1000;
            await exist.save();
        }
        else {
            await user.create(
                {
                    name,
                    email,
                    password: hasspassword,
                    otp,
                    otpExpiry: Date.now() + 5 * 60 * 1000
                });
        }

        const mailoption = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: 'Verify your Gmail - User System',
            html: `<p>Hello ${name} 🎉</p><p>Your OTP is: <b>${otp}</b></p>`

        }
        try {
            const resMail = await transportar.sendMail(mailoption)
            res.status(200).json({ msg: "OTP sent to email" });
        } catch (error) {
            return res.status(400).json({ msg: "Mail Server Not Response" });
        }

    } catch (error) {
        res.status(500).json({ msg: "Backend error" });

    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Missing Data" });
        }
        const exist = await user.findOne({ email })

        if (!exist) {
            return res.status(404).json({ msg: "user not found" });
        }

        if (!exist.isVerified) {
            return res.status(400).json({ msg: "User not verified" });
        }

        const match = await bcrypt.compare(password, exist.password)
        if (!match) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, JWT_KEY, { expiresIn: "1h" });
        res.status(200).json({ msg: "Login successful", token });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });

    }
}

export const data = async (req, res) => {
    const data = await user.find().select("-password -otp -otpExpiry")
    res.send(data)
}

export const forget = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: "Missing Data" });
        }
        const exist = await user.findOne({ email })

        if (!exist) {
            return res.status(404).json({ msg: "user not found" });
        }
        if (!exist.isVerified) {
            return res.status(404).json({ msg: "user not found" });
        }
        const otp = otpgenerate(4)
        exist.otp = otp;
        exist.otpExpiry = Date.now() + 5 * 60 * 1000;
        const check = await exist.save();
        console.log("verifyyy", check)

        const mailoption = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: "Password Reset OTP - User Authentication System ",
            html: ` <p> Hello ${exist.name} 🎉</p>
                   <p>Your OTP for verification is: <b>${otp}</b></p>
             <p>This OTP will expire in 5 minutes.</p> `
        }
        try {
            const resMail = await transportar.sendMail(mailoption)
            res.status(200).json({ msg: "OTP sent to email " });

        } catch (error) {
            return res.status(400).json({ msg: "Mail Server Not Response" });
        }

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}


export const reset = async (req, res) => {
    try {
        const { newpass, getemail } = req.body

        if (!newpass || !getemail) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const exist = await user.findOne({ email: getemail })

        if (!exist) {
            return res.status(404).json({ msg: "user not found" });
        }

        const hasspassword = await bcrypt.hash(newpass, 10)
        const updatedata = await user.findOneAndUpdate({ email: getemail }, { $set: { password: hasspassword } })
        res.status(200).json({ msg: "Reset password done" });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }

}
