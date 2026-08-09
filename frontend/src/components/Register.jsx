import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices.js";

const Register = () => {
    const navigate = useNavigate();
    const [userError, setUserError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setUserError("");

            const response = await registerUser(data);

            if (response.success) {
                navigate("/");
            }
        } catch (error) {
            setUserError(
                error.response?.data?.message ||
                    "Unable to create your account. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-4">
                        <span className="text-white text-xl font-bold">
                            S
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Join SkillSync and start building your network
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                autoComplete="username"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Username must be at least 3 characters",
                                    },
                                })}
                                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition ${
                                    errors.username
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                }`}
                            />

                            {errors.username && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

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
                                placeholder="Create a password"
                                autoComplete="new-password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
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

                        {userError && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <p className="text-center text-sm text-red-400">
                                    {userError}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
                        >
                            {isSubmitting
                                ? "Creating account..."
                                : "Create account"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-800" />

                        <span className="text-xs text-slate-500">
                            ALREADY A MEMBER?
                        </span>

                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                            Sign in
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

export default Register;