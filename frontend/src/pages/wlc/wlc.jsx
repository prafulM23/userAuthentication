import { useNavigate } from "react-router-dom"
import "./wlc.css"
const Wlc = () => {
    const navigate = useNavigate("")
    const token = localStorage.getItem("token")
    console.log("wlcome",token)
    const handleremove = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }
    return (
        <>
            <div className="wlc-box">
                <h1 >Welcome , User!</h1>
                <h4  >You Have Succesfully Sign-Up & Login </h4>
                <button className="btn" onClick={handleremove}>LogOut</button>
            </div>
        </>
    )
}
export default Wlc