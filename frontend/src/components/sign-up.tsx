// components/sign-up.tsx
import React from 'react';

interface SignUpProps {
    onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [retypePassword, setRetypePassword] = React.useState('');
    const [showError, setShowError] = React.useState(false);

    function validatePassword(pwd: string) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/;
        return regex.test(pwd);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedPassword = password.trim();
        const trimmedRetypePassword = retypePassword.trim();

        if (!validatePassword(trimmedPassword) || trimmedPassword !== trimmedRetypePassword) {
            setShowError(true);
        } else {
            setShowError(false);
            console.log({ email, password });
            onClose(); // close popup after success
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black p-8 rounded-lg w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-3 text-xl">&times;</button>
                <h2 className="text-3xl font-bold text-center text-[#1D0E3C]">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="email"
                        placeholder="Input email address or phone number"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Input password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Retype password"
                        value={retypePassword}
                        onChange={e => setRetypePassword(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />
                    {showError && (
                        <div className="p-4 border border-red-500 text-red-600 text-sm rounded">
                            <p className="font-bold mb-1">Invalid password</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>From 8 to 32 characters</li>
                                <li>Includes lowercase letters and numbers</li>
                                <li>Include special characters (!,$,@,%,...)</li>
                                <li>Must include at least 1 uppercase letter</li>
                            </ul>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-[#1D0E3C] text-white hover:bg-[#311f5a] py-2 rounded transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
