import { useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"
import axios from "axios"
const LoginCom = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState('');
    const [output, setoutput] = useState(false)
    const [show, setshow] = useState(false)
    const navigate = useNavigate()
    const handleforget = () => {
        navigate("/forget")

    }
    const handleshow = () => {
        setshow(false)
    }
    const handlehide = () => {
        setshow(true)
    }

    const handlelogin = async () => {
        try {
            if (!email && !password) {
                return (setoutput("Fill you detail !"))
            } else if (!email) {
                return (setoutput("Missing your email !"))
            } else if (!password) {
                return (setoutput("Missing your password !"))
            }
            console.log(email, password)
            const res = await axios.post("https://userauthentication-wd58.onrender.com/login", { email, password })
            console.log(res.data)
            if (res.status == 200) {
                (setoutput(<p style={{ color: "green" }}>{res.data.msg}</p>));
                localStorage.setItem("token", res.data.token)
                console.log(res.data.token)
                setemail("")
                setpassword("")

                navigate("/wlc")


            }

        } catch (error) {
            console.log(error);
            if (error.response) {
                setoutput(
                    <p style={{ color: "red" }}>
                        {error.response.data.msg || "Invalid password"}
                    </p>
                );
            } else {
                setoutput(<p style={{ color: "red" }}>Server not responding</p>);
            }
        }
    }

    return (
        <>

            <div className="login-box">
                <h2>Login Your Account</h2>
                <p>Join us today – it’s quick and easy!</p>
                {output ? <p style={{ color: "red", fontSize: "20px" }}>{output}</p> : ""}
                <div className="login-input-box">
                    <div style={{ position: "relative" }}>
                        <img src="https://www.svgrepo.com/show/511921/email-1573.svg" alt="" />
                        <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => { setemail(e.target.value); setoutput(false) }} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <img onClick={show ? handleshow : handlehide} src={show ? "https://www.svgrepo.com/show/380010/eye-password-show.svg" : "https://www.svgrepo.com/show/390427/eye-password-see-view.svg"} alt="" />
                        {/* <img style={{width:"28px",position:"absolute",right:"9px",top:"2px"}}    src="https://www.svgrepo.com/show/390427/eye-password-see-view.svg" alt="" /> */}
                        <input type={show ? "text" : "password"} placeholder="Enter your Password" value={password} onChange={(e) => { setpassword(e.target.value); setoutput(false) }} />
                    </div>
                   <div style={{display:"flex",gap:"10px",justifyContent:"space-between",fontSize:"15px"}}>
                     <p onClick={handleforget}>Forget Password</p>
                    <p onClick={()=>navigate("/signup")}>SignUp !</p>
                   </div>
                </div>
                <button className="login-btn" onClick={handlelogin}>Login!</button>




            </div>

        </>
    )
}
export default LoginCom