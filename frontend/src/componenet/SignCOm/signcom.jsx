import { useEffect, useState } from "react"
import "./sign.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import OtpInput from "../OtpInput/OtpInput"

const Sign = () => {
    const [show, setshow] = useState(false)
    const [name, setname] = useState("")
    const [phone, setphone] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [output, setoutput] = useState(false)
    const [otpbox, setotpbox] = useState(false);
    const [otp, setOtp] = useState(Array(4).fill(""));

    const Backend_URL = "https://userauthentication-1-64yk.onrender.com"
    
    useEffect(() => {
        const read = async () => {
            try {
                const res = await axios.get("https://userauthentication-1-64yk.onrender.com/read")
                console.log(res.data)

            } catch (error) {
                console.log("backend error =  ", error)

            }
        }

        read()

    }, [])


    const naviagte = useNavigate()

    const handleshow = () => {
        setshow(false)
    }
    const handlehide = () => {
        setshow(true)
    }

    const handlesign = async () => {

        try {
            if (!name && !phone && !email && !password) {
                return setoutput("Plz fill FUll form")
            } else if (!name) {
                return setoutput("Name fill")
            } else if (!phone) {
                return setoutput("phone fill")
            } else if (!email) {
                return setoutput("email fill")
            } else if (!password) {
                return setoutput("password fill")
            }
            localStorage.setItem("email", email);
            const res = await axios.post("https://userauthentication-1-64yk.onrender.com/sign",
                { name, phone, email, password }
            )


            if (res.status == 200) {
                setoutput(<p style={{ color: "green" }}>{res.data.msg}</p>)
                setotpbox(true)
            } else {
                return setoutput(<p style={{ color: "red" }}>{res.data.msg}</p>)
            }

            setname("")
            setemail("")
            setpassword("")
            setphone("")


        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red" }}>
                        {error.response.data.msg || "Invalid OTP"}
                    </p>
                );
            } else {
                setoutput(<p style={{ color: "red" }}>Server not responding</p>);
            }
        }
    }

    const handleverify = async () => {

        try {
            const getemail = localStorage.getItem("email")
            const getotp = otp.join("")
            const forgetmood = false;
            const res = await axios.post("https://userauthentication-1-64yk.onrender.com/verify",
                { getotp, getemail, forgetmood }
            )
            if (res.status == 200) {
                setoutput(<p style={{ color: "green" }}>{res.data.msg}</p>)
                setTimeout(() => {
                    naviagte("/login")
                }, 1000);

            }
            console.log(res.data)

        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red" }}>
                        {error.response.data.msg || "Invalid OTP"}
                    </p>
                );
            } else {
                setoutput(<p style={{ color: "red" }}>Server not responding</p>);
            }
        }
    }
    return (
        <>
            <div className="Sign-box">
                {
                    output ? <p style={{ fontSize: "20px", color: "red" }}>{output}</p> : ""
                }
                {

                    otpbox ? <>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                            <h3>Sent otpbox Your Gmail</h3>

                            <OtpInput length={4} otp={otp} setOtp={setOtp} />
                            <button className="btn" onClick={handleverify}>Sign-up</button>

                        </div>

                    </>



                        :
                        <> <h2>Create Your Account</h2>
                            <p>Join us today – it’s quick and easy!</p>


                            <div className="sign-input-box">
                                <div className="sign-img-input-box" >
                                    <img src="https://www.svgrepo.com/show/532378/user-pen-alt.svg" alt="" />
                                    <input type="text" placeholder="Enter your name" value={name} onChange={(e) => { setname(e.target.value); setoutput(false) }} />
                                </div>
                                <div className="sign-img-input-box">
                                    <img src="https://www.svgrepo.com/show/472752/phone-call.svg" alt="" />
                                    <input type="number" className="num-input" placeholder="Enter your Phone" value={phone} onChange={(e) => { setphone(e.target.value); setoutput(false) }} />
                                </div>
                                <div className="sign-img-input-box">
                                    <img src="https://www.svgrepo.com/show/511921/email-1573.svg" alt="" />
                                    <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => { setemail(e.target.value); setoutput(false) }} />
                                </div>
                                <div className="sign-img-input-box">

                                    <img onClick={show ? handleshow : handlehide} src={show ? "https://www.svgrepo.com/show/380010/eye-password-show.svg" : "https://www.svgrepo.com/show/390427/eye-password-see-view.svg"} alt={show ? "show eye" : "hide eye"} />


                                    <input type={show ? "text" : "password"} placeholder="Enter your Password" value={password} onChange={(e) => { setpassword(e.target.value); setoutput(false) }} />
                                </div>


                            </div>
                            <button className="sign-btn" onClick={handlesign}>Click!</button> </>


                }
            </div>
        </>
    )
}
export default Sign