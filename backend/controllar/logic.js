import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "../model/validation.js"
import nodemailer from "nodemailer"
import crypto from "crypto"
const jwt_key = "praful";
// import { Resend } from "resend";

// const resend = new Resend('re_eHVpVUF3_EpzZeSGmweX1kG8WofGMzLhA');

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "a20048001@smtp-brevo.com",
        pass: process.env.BREVO_PASS
    },
});


const otpgenerate = (length = 4) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += crypto.randomInt(0, 10).toString();
    }
    return otp
}


export const verify = async (req, res) => {
    try {
        const { getotp, getemail, forgetmood } = req.body;
        console.log(getemail, getotp, forgetmood)
        const exist = await user.findOne({ email: getemail })
        console.log("exits", exist.otp, "fron", getotp)
        if (!exist) {
            (console.log("user not found"))

            return res.status(404).json({ msg: "user not found" });
        }

        if (!forgetmood) {

            if (exist.isVerified) {
                (console.log("User already verified"))

                return res.status(400).json({ msg: "User already verified" });
            }
            if (exist.otp !== getotp) {
                (console.log("Wrong otp", typeof (exist.otp)))

                return res.status(400).json({ msg: "Invalid otp" });

            }
            if (Date.now() > exist.otpExpiry) {
                (console.log("time out otp"))

                return res.status(400).json({ msg: "expired otp" });

            }

            exist.isVerified = true;
            exist.otp = undefined;
            exist.otpExpiry = undefined;

            await exist.save();


            // --- RESEND EMAIL LOGIC ---
            const mailOption = {
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
                await transporter.sendMail(mailOption);
                console.log("successfully verify")

            } catch (mailError) {
                console.log("Mail Error:", mailError);
            }

            return res.status(200).json({ msg: " verified,signup successful" });
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

            console.log("reset password");
        }

    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ msg: "Internal server error" });
    }


}
export const sign_up = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
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
                    phone,
                    password: hasspassword,
                    otp,
                    otpExpiry: Date.now() + 5 * 60 * 1000
                });


        }


        // --- RESEND EMAIL LOGIC ---
        const mailOptions = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: "Your Account Verification OTP",
            html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Welcome to My Project</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #007bff;">${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
        </div>
    `,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully to:", email);
        } catch (error) {
            console.log("Email error:", error);
            throw error;
        }


        res.status(200).json({ msg: "OTP sent to email" });

    } catch (error) {
        res.status(500).json({ msg: "Backend error" });
        console.log("post api error", error)

    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
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

        const token = jwt.sign({ email }, jwt_key, { expiresIn: "1h" });
        console.log(token)
        res.status(200).json({ msg: "Login successful", token });

    } catch (error) {
        console.log("error login", error)
        res.status(500).json({ msg: "Internal server error" });

    }
}

export const data = async (req, res) => {
    // const data = await user.find().select("-password")
    const data = await user.find()
    res.send(data)

}
export const forget = async (req, res) => {
    try {
        const { email } = req.body;
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

        // --- RESEND EMAIL LOGIC ---
        const mailOptions = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: "Password Reset OTP - User Authentication System ",
            html: ` <p> Hello ${exist.name} 🎉</p>
                   <p>Your OTP for verification is: <b>${otp}</b></p>
             <p>This OTP will expire in 5 minutes.</p> `
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully to:", email);
        } catch (error) {
            console.log("Email error:", error);
            throw error;
        }
        res.status(200).json({ msg: "OTP sent to email " });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }

}


export const reset = async (req, res) => {
    try {
        const { newpass, getemail } = req.body
        console.log(getemail)

        const exist = await user.findOne({ email: getemail })
        console.log(exist)
        if (!exist) {
            return res.status(404).json({ msg: "user not found" });
        }
        const hasspassword = await bcrypt.hash(newpass, 10)

        const updatedata = await user.findOneAndUpdate({ email: getemail }, { $set: { password: hasspassword } })
        console.log("updateduser = > ", updatedata)

        res.status(200).json({ msg: "Reset password done" });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });

        console.log(error)


    }

}
