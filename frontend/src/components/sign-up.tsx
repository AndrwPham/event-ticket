import React from "react";
import { ApiError, isApiError, User } from "../types";

interface SignUpProps {
    onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps) {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [retypePassword, setRetypePassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [showValidationError, setShowValidationError] = React.useState(false);

    function validatePassword(pwd: string) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/;
        return regex.test(pwd);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setShowValidationError(false);
        setApiError(null);

        const trimmedPassword = password.trim();
        const trimmedRetypePassword = retypePassword.trim();

        if (
            !validatePassword(trimmedPassword) ||
            trimmedPassword !== trimmedRetypePassword
        ) {
            setShowValidationError(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: trimmedPassword,
                    }),
                },
            );

            const data: unknown = await response.json();

            if (!response.ok) {
                if (isApiError(data)) {
                    const errorMessage = Array.isArray(data.message)
                        ? data.message.join(", ")
                        : data.message;
                    throw new Error(errorMessage);
                }
                throw new Error(
                    "An unexpected error occurred during registration.",
                );
            }

            const registeredUser = data as User;
            console.log("Successfully registered:", registeredUser);

            alert("Registration successful! You can now log in.");
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("An unknown error occurred.");
            }
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative transform transition-all duration-300 scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-[#1D0E3C]">
                        Sign Up
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Get started with your free account today.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            required
                            className="w-full border-slate-300 bg-slate-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311f5a] focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="username"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            required
                            className="w-full border-slate-300 bg-slate-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311f5a] focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            className="w-full border-slate-300 bg-slate-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311f5a] focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="retypePassword"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="retypePassword"
                            type="password"
                            placeholder="Retype Password"
                            value={retypePassword}
                            onChange={(e) => {
                                setRetypePassword(e.target.value);
                            }}
                            required
                            className="w-full border-slate-300 bg-slate-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311f5a] focus:border-transparent transition"
                        />
                    </div>

                    {showValidationError && (
                        <div className="p-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg">
                            <p className="font-semibold mb-2">
                                Password does not meet requirements:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Must be 8 to 32 characters long</li>
                                <li>
                                    Must include at least one uppercase and one
                                    lowercase letter
                                </li>
                                <li>Must include at least one number</li>
                                <li>
                                    Must include at least one special character
                                </li>
                                {password.trim() !== retypePassword.trim() && (
                                    <li>Passwords must match</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {apiError && (
                        <div className="p-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg">
                            <p className="font-semibold">{apiError}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1D0E3C] text-white font-semibold hover:bg-[#311f5a] py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D0E3C] disabled:bg-slate-400"
                    >
                        {isLoading ? "Signing Up..." : "Continue"}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-sm">
                        OR
                    </span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-slate-500">
                        Sign up with a social account
                    </p>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    By continuing, you agree to our{" "}
                    <button
                        onClick={() => {}}
                        className="underline hover:text-slate-600 text-left"
                    >
                        Terms of Service
                    </button>
                    .
                </p>
            </div>
        </div>
    );
}
