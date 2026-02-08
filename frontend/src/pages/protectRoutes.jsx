import { Navigate, useLocation, useNavigate } from "react-router-dom"


const ProtectRoutes = ({ children }) => {
    let location = useLocation()

    const token = localStorage.getItem("token")
    let authpage = ["/login", "/signup", "/forget", "/"]

    if (token && authpage.includes(location.pathname)) {
        return <Navigate to="/wlc" replace />;
    }
    if (!token && !authpage.includes(location.pathname)) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectRoutes;