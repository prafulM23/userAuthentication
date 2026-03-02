import { useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"
import axios from "axios"
const LoginCom = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState('');
    const [output, setoutput] = useState(false)
    const [show, setshow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const Backend_URL = import.meta.env.VITE_BACKEND_URL


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
            setLoading(true)
            const res = await axios.post(`${Backend_URL}/login`, { email, password })
            if (res.status == 200) {
                (setoutput(<p style={{ color: "green" }}>{res.data.msg}</p>));
                localStorage.setItem("token", res.data.token)
                setemail("")
                setpassword("")
                setLoading(false)
                navigate("/wlc")
            }

        } catch (error) {
            setLoading(false)
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
            <section className="login-section">

                <div className="login-box">
                    <h2>Login Your Account</h2>
                    {output ? <p style={{ color: "red", fontSize: "20px" }}>{output}</p> : ""}
                    <div className="login-input-box">
                        <div style={{ position: "relative" }}>
                            <img src="https://www.svgrepo.com/show/511921/email-1573.svg" alt="" />
                            <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => { setemail(e.target.value); setoutput(false) }} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <img onClick={show ? handleshow : handlehide} src={show ? "https://www.svgrepo.com/show/380010/eye-password-show.svg" : "https://www.svgrepo.com/show/390427/eye-password-see-view.svg"} alt="" />
                            <input type={show ? "text" : "password"} placeholder="Enter your Password" value={password} onChange={(e) => { setpassword(e.target.value); setoutput(false) }} />
                        </div>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", fontSize: "15px" }}>
                            <p onClick={handleforget}>Forget Password</p>
                            <p onClick={() => navigate("/signup")}>SignUp !</p>
                        </div>
                    </div>
                    <button className="login-btn" onClick={handlelogin}>{loading ? "Loading..." : "Login!"}</button>
                </div>

            </section>
        </>
    )
}
export default LoginCom