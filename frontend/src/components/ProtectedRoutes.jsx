import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    console.log("🔥 PROTECTED ROUTE RUNNING");
    console.log("🔥 TOKEN:", token);

    if (!token) {
        console.log("🚫 NO TOKEN → REDIRECTING");

        return <Navigate to="/" replace />;
    }

    console.log("✅ TOKEN EXISTS → DASHBOARD");

    return children;
};

export default ProtectedRoute;