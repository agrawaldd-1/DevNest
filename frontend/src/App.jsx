import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import "./App.css";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

import FetchProfile from "./components/FetchProfile.jsx";
import EditProfile from "./components/EditProfile.jsx";

import CreatePost from "./components/CreatePost.jsx";
import ViewPost from "./components/ViewPost.jsx";

import CreateProject from "./components/CreateProject.jsx";
import Projects from "./components/Projects.jsx";
import ViewProject from "./components/ViewProject.jsx";

import Shorts from "./components/Shorts.jsx";
import CreateShort from "./components/CreateShort.jsx";
import ViewShort from "./components/ViewShort.jsx";

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
        path: "/profile",
        element: (
            <ProtectedRoute>
                <FetchProfile />
            </ProtectedRoute>
        ),
    },

    {
        path: "/profile/edit",
        element: (
            <ProtectedRoute>
                <EditProfile />
            </ProtectedRoute>
        ),
    },

    {
        path: "/create-post",
        element: (
            <ProtectedRoute>
                <CreatePost />
            </ProtectedRoute>
        ),
    },

    {
        path: "/posts/:postId",
        element: (
            <ProtectedRoute>
                <ViewPost />
            </ProtectedRoute>
        ),
    },

    {
        path: "/projects",
        element: (
            <ProtectedRoute>
                <Projects />
            </ProtectedRoute>
        ),
    },

    {
        path: "/projects/create",
        element: (
            <ProtectedRoute>
                <CreateProject />
            </ProtectedRoute>
        ),
    },

    {
        path: "/projects/:projectId",
        element: (
            <ProtectedRoute>
                <ViewProject />
            </ProtectedRoute>
        ),
    },

    {
        path: "/shorts",
        element: (
            <ProtectedRoute>
                <Shorts />
            </ProtectedRoute>
        ),
    },

    {
        path: "/shorts/create",
        element: (
            <ProtectedRoute>
                <CreateShort />
            </ProtectedRoute>
        ),
    },
    {
    path: "/shorts/:shortId",
    element: (
        <ProtectedRoute>
            <ViewShort />
        </ProtectedRoute>
    ),
},
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;