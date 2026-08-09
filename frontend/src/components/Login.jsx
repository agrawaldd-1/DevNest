import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices.js";

const Login = () => {
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setServerError("");

            const response = await loginUser(data);

            if (response.success) {
                localStorage.setItem("token", response.token);
                navigate("/dashboard");
            }
        } catch (error) {
            setServerError(
                error.response?.data?.message || "Invalid email or password"
            );
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-4">
                        
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to continue to SkillSync
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition ${
                                    errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                }`}
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition ${
                                    errors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                }`}
                            />

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {serverError && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <p className="text-center text-sm text-red-400">
                                    {serverError}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-800" />
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-slate-600">
                    Build Skills. Build Network. Build Career.
                </p>
            </div>
        </div>
    );
};

export default Login;

