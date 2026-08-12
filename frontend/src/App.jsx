import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import FetchProfile from "./components/FetchProfile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import CreatePost from "./components/CreatePost.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path : "/profile",
        element:(<ProtectedRoute>
                <FetchProfile />
            </ProtectedRoute>)
    },
    {
        path : "/profile/edit",
        element:(<ProtectedRoute>
                <EditProfile />
            </ProtectedRoute>)
    },
    {
        path : "create-post",
        element : (
            <ProtectedRoute><CreatePost/></ProtectedRoute>
        )
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;