import SignUp from "./pages/SignUp"
import "./App.css"
import Home from "./pages/home/home"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Forget from "./pages/forget"
import Wlc from "./pages/wlc/wlc"
import ProtectRoutes from "./pages/protectRoutes"
const App = () => {
  const token = localStorage.getItem("token")
  return (
    <>

      <div className="App-box">

        <Routes>

          <Route path="/" element={
            <ProtectRoutes>
              <Home />
            </ProtectRoutes>
          }></Route>


          <Route path="/signup" element={
            <ProtectRoutes>
              <SignUp />
            </ProtectRoutes>
          }></Route>


          <Route path="/login" element={
            <ProtectRoutes>
              <Login />
            </ProtectRoutes>
          }></Route>

          <Route path="/forget" element={
            <ProtectRoutes>
              <Forget />
            </ProtectRoutes>

          }></Route>

          <Route path="/wlc" element={
            <ProtectRoutes>
              <Wlc />
            </ProtectRoutes>

          }></Route>


        </Routes>



      </div>

    </>

  )

}
export default App