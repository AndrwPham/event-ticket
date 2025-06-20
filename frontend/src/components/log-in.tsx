import React from "react";

interface LogInProps {
    onClose: () => void;
    onSwitchToSignUp: () => void;
}

export default function LogIn({ onClose, onSwitchToSignUp }: LogInProps) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // send the email and password to your server here.
        console.log("Login attempt:", { email, password });
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black p-8 rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-xl"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold text-center text-[#1D0E3C]">
                    Log In
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="email"
                        placeholder="Input email address or phone number"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        required
                        className="w-full border rounded px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Input password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        required
                        className="w-full border rounded px-4 py-2"
                    />

                    {/* REMOVED: The invalid password error message block was here. */}

                    <button
                        type="submit"
                        className="w-full bg-[#1D0E3C] text-white hover:bg-[#311f5a] py-2 rounded transition"
                    >
                        Continue
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
