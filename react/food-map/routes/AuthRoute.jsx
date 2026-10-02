import { Route, Routes } from "react-router-dom"
import Login from "../pages/Auth/Login"
import Join from "../pages/Auth/Join"

function AuthRoute(props) {
    return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
            </Routes>
    )
}

export default AuthRoute;