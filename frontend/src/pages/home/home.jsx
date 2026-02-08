import "./home.css"
import { useNavigate } from "react-router-dom"
const Home = () => {
    let navigate = useNavigate()
    const signpage = () => {
        navigate("/signup")

    }
    const loginpage = () => {
        navigate("/login")

    }
    return (
        <>
            <div className="home-box">
                <h1>User Authentication System</h1>
                <h3>Welcome back! Login or sign up to  </h3>
                <h5>explore our secure system.</h5>

                <img  src="https://www.svgrepo.com/show/274065/add-user-button.svg" alt="" />

                <div className="btn-box" >
                    <button className="btn" onClick={signpage}>Sign-Up !</button>
                    <button className="btn" onClick={loginpage}>Login !</button>
                </div>
            </div>

        </>
    )
}
export default Home