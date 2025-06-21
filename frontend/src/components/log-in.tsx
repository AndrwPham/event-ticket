import React from "react";
import { useAuth } from "../context/AuthContext"; // We assume AuthContext.tsx is in src/context
import { ApiError, isApiError, User } from "../types";

interface LogInProps {
    onClose: () => void;
    onSwitchToSignUp: () => void;
}

interface LoginResponse {
    user: User;
}

export default function LogIn({ onClose, onSwitchToSignUp }: LogInProps) {
    const { login } = useAuth();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setApiError(null);
        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // The fetch 'credentials' option is needed to send cookies to the backend
                    credentials: "include",
                    body: JSON.stringify({
                        username: email,
                        password: password,
                        activeRole: "Attendee",
                    }),
                },
            );

            const data: unknown = await response.json();

            if (!response.ok) {
                if (isApiError(data)) {
                    const message = Array.isArray(data.message)
                        ? data.message.join(", ")
                        : data.message;
                    throw new Error(message);
                }
                throw new Error("An unexpected error occurred.");
            }

            const loginData = data as LoginResponse;

            // Call the global login function from our context with the user data
            login(loginData.user);

            onClose(); // Close the modal on success
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("An unknown error occurred.");
            }
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
