import React from "react";
import { ApiError, isApiError, User } from "../types";

interface LogInProps {
    onClose: () => void;
    onSwitchToSignUp: () => void;
}

interface LoginResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: User & { activeRole: string };
}

export default function LogIn({ onClose, onSwitchToSignUp }: LogInProps) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setApiError(null);
        setIsLoading(true);

        try {
            // 1. API Call to the Backend
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: email, // The backend expects a 'username' field
                        password: password,
                        activeRole: "Attendee", // Hardcoding the role for now
                    }),
                },
            );

            const data: unknown = await response.json();

            // 2. Handle Backend Response
            if (!response.ok) {
                // Use our type guard to check for the known error shape
                if (isApiError(data)) {
                    throw new Error(
                        Array.isArray(data.message)
                            ? data.message.join(", ")
                            : data.message,
                    );
                }
                throw new Error("An unexpected error occurred.");
            }

            // 3. Handle Success
            const loginData = data as LoginResponse;
            console.log("Successfully logged in:", loginData);

            // In a real app, you would save these tokens and update the user state
            localStorage.setItem("accessToken", loginData.tokens.accessToken);
            localStorage.setItem("refreshToken", loginData.tokens.refreshToken);

            alert(`Login successful! Welcome, ${loginData.user.username}`);
            onClose(); // Close the modal on success
        } catch (error) {
            // 4. Handle Errors
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("An unexpected error occurred.");
            }
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative transform transition-all duration-300 scale-100">
                {/* Close Button */}
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
                        Log In
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Form */}
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
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email Address"
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
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            className="w-full border-slate-300 bg-slate-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311f5a] focus:border-transparent transition"
                        />
                    </div>

                    {/* API Error Message */}
                    {apiError && (
                        <div className="p-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg">
                            <p className="font-semibold">{apiError}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1D0E3C] text-white font-semibold hover:bg-[#311f5a] py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D0E3C] disabled:bg-slate-400"
                    >
                        {isLoading ? "Logging In..." : "Log In"}
                    </button>
                </form>

                <div className="text-sm text-center mt-6 space-y-4">
                    {/* FIX: Replaced '#' with a valid path */}
                    <a
                        href="/forgot-password"
                        className="text-gray-600 hover:underline block"
                    >
                        Forgot password?
                    </a>
                    <p>
                        Don’t have an account?{" "}
                        {/* FIX: Converted to a button for handling actions (switching modals) */}
                        <button
                            onClick={onSwitchToSignUp}
                            className="text-pink-500 font-medium hover:underline"
                        >
                            Create an account
                        </button>
                    </p>

                    <div className="flex items-center justify-center gap-4 mt-4">
                        <hr className="w-1/3 border-gray-300" />
                        <span className="text-sm text-gray-500">Or</span>
                        <hr className="w-1/3 border-gray-300" />
                    </div>

                    <div className="mt-4">
                        <button className="flex items-center justify-center gap-2 border px-4 py-2 rounded w-full text-gray-700 hover:bg-gray-100">
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                        By continuing past this page, you agree to the
                        Ticketbox’s{" "}
                        <a href="/terms-of-use" className="underline">
                            Terms of Use
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="underline">
                            Information Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
