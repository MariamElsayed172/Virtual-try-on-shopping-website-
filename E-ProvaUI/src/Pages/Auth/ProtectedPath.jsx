import { Navigate } from 'react-router'
import { useCookies } from 'react-cookie'
import { jwtDecode } from "jwt-decode";


export default function ProtectedPath({ children }) {
    const [cookies] = useCookies(['accessToken']);
    if (cookies.accessToken) {
        const { role } = jwtDecode(cookies.accessToken);
        if (role === "admin") {
            return children
        } else {
            return <Navigate to={"/e-prova/home"} />
        }
    } else {
        return <Navigate to={"/e-prova/login"} />
    }
}

