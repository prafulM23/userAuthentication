import { useState } from "react"
import axios from "axios"
import "./forget.css"
import OtpInput from "../OtpInput/OtpInput";
import { useNavigate } from "react-router-dom";
const ForgetCom = () => {
    const [otpbox, setotpbox] = useState(false);
    const [email, setemail] = useState('');
    const [output, setoutput] = useState(false)
    const [otp, setOtp] = useState(Array(4).fill(""));
    const [reset, setreset] = useState(false)
    const [show1, setshow1] = useState(false)
    const [show2, setshow2] = useState(false)
    const [newpass, setnewpass] = useState("");
    const [confirmpass, setconfirmpass] = useState("");
    const navigate = useNavigate()



    const getotp = async () => {
        try {
            if (!email) {
                return (setoutput("Missing Gmail"));
            }

            const res = await axios.post("https://userauthentication-1-64yk.onrender.com/forget", { email })
            console.log(res.data)
            if (res.status == 200) {
                setoutput(<p style={{ color: "green",width:"200px" }}>{res.data.msg}</p>)
                setemail("")
                setotpbox(true)
            } else {
                setoutput(<p style={{ color: "red",width:"200px" }}>{res.data.msg}</p>)

            }



        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red",width:"200px" }}>
                        {error.response.data.msg || "Invalid otp"}
                    </p>
                );
            } else {
                setOutput(<p style={{ color: "red",width:"200px" }}>Server not responding</p>);
            }
        }


    }
    const handleverify = async () => {
        try {
            const getemail = localStorage.getItem("email")
            const forgetmood = true;
            const getotp = otp.join("")
            const res = await axios.post("http://localhost:8001/verify",
                { getotp, getemail, forgetmood }
            )
            if (res.status == 200) {
                setoutput(<p style={{ color: "red",width:"200px" }}> Reset Password</p>)
                setreset(true);
            }
            else {
                setoutput(<p style={{ color: "red",width:"200px" }}>{res.data.msg}</p>)
            }

        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red",width:"200px" }}>
                        {error.response.data.msg || "Invalid OTP"}
                    </p>
                );
            } else {
                setoutput(<p style={{ color: "red",width:"200px" }}>Server not responding</p>);
            }
        }



    }

    const handlereset = async () => {

        try {
            if (!newpass && !confirmpass) {
                return (setoutput("fill form"))
            }
            if (!newpass) {
                return (setoutput("fill newpassword"))
            }
            if (!confirmpass) {
                return (setoutput("fill confirmpassword"))
            }
            if (newpass !== confirmpass) {
                return (setoutput("Not Match Password"))


            }
            const getemail = localStorage.getItem("email")

            console.log(newpass, "and", confirmpass, "and", getemail)
            const res = await axios.post("http://localhost:8001/reset", { newpass, getemail })
            console.log(res.data)
            if (res.status == 200) {
                setoutput(<p style={{ color: "green",width:"200px" }}>{res.data.msg}</p>)
                navigate("/login")
                setconfirmpass("")
                setnewpass("")
            }


        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red",width:"200px" }}>
                        {error.response.data.msg || "Invalid OTP"}
                    </p>
                );
            } else {
                setoutput(<p style={{ color: "red",width:"200px" }}>Server not responding</p>);
            }

        }


    }


    const handleshow1 = () => {
        setshow1(false)
    }
    const handlehide1 = () => {
        setshow1(true)
    }
    const handleshow2 = () => {
        setshow2(false)
    }
    const handlehide2 = () => {
        setshow2(true)
    }

    return (
        <>

            <div className="forget-box">
                {
                    otpbox ? <>
                        {
                            reset ? <div className="forget-input-box" >
                                <h3>Reset Your Password</h3>
                                {
                                    output ? <p style={{ color: "red",width:"200px" }}>{output}</p> : ""
                                }
                                <div style={{ position: "relative" }}>
                                    <img onClick={show1 ? handleshow1 : handlehide1} src={show1 ? "https://www.svgrepo.com/show/380010/eye-password-show.svg" : "https://www.svgrepo.com/show/390427/eye-password-see-view.svg"} alt={show1 ? "show eye" : "hide eye"} />

                                    <input type={show1 ? "text" : "password"} placeholder="new password" value={newpass} onChange={(e) => { setnewpass(e.target.value); setoutput(false) }} />


                                </div>
                                <div style={{ position: "relative" }}>
                                    <img onClick={show2 ? handleshow2 : handlehide2} src={show2 ? "https://www.svgrepo.com/show/380010/eye-password-show.svg" : "https://www.svgrepo.com/show/390427/eye-password-see-view.svg"} alt={show2 ? "show eye" : "hide eye"} />
                                    <input type={show2 ? "text" : "password"} placeholder="confirm password" value={confirmpass} onChange={(e) => { setconfirmpass(e.target.value); setoutput(false) }} />

                                </div>
                                <button className="btn" onClick={handlereset}>Reset Password</button>
                            </div> :
                                <>
                                    <h4>OTP Sent Your Email</h4>
                                    <OtpInput length={4} otp={otp} setOtp={setOtp} />
                                    <button className="btn" onClick={handleverify}>Verify-OTP</button>
                                </>

                        }




                    </>

                        : <>
                            <h2>forget Your Account</h2>
                            <p>Join us today – it’s quick and easy!</p>
                            {
                                output ? <p style={{ color: "red" }}>{output}</p> : ""
                            }
                            <div className="forget-input-box">

                                <div className="forget-input-img">
                                    <img src="https://www.svgrepo.com/show/511921/email-1573.svg" alt="" />
                                    <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => { setemail(e.target.value); setoutput(false) }} />
                                </div>

                                <button className="forget-btn" onClick={getotp}>Get OTP!</button>



                            </div>


                        </>

                }






            </div>


        </>
    )
}
export default ForgetCom