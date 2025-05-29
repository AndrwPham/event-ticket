import React from 'react';

export default function SignUp() {
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

        if (trimmedPassword !== trimmedRetypePassword) {
            setShowError(true);
            console.log(`"${password}" === "${retypePassword}"`, password === retypePassword);
        } else {
            setShowError(false);
            console.log({ email, password }); // send to backend here
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
            <div className="w-full max-w-md p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-[#1D0E3C]">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <p className="text-center text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-pink-500 hover:underline">Log In</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
