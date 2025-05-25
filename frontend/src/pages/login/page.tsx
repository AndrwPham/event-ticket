import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = (pwd: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Invalid password');
      return;
    }

    setLoading(true);
    // try {
    //   const response = await axios.post(
    //     'http://localhost:5000/auth/login',
    //     {
    //       username,
    //       password,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   );

    //   if (response.status == 200) {
    //     console.log('Login successful:', response.data);
    //   // localStorage.setItem('token', response.data.token);
    //   // window.location.href = '/user';
    //   }
    // } catch (err: any) {
    //   // Handle specific error messages from backend
    //   setError(
    //     err.response?.data?.error || 'Login failed. Please check your credentials.'
    //   );
    //   console.error('Login error:', err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[#1D0E3C]">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Input username, email, or phone number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Input password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
            disabled={loading}
          />
          {error && (
            <div className="p-4 border border-red-500 text-red-600 text-sm rounded">
              <p className="font-bold mb-1">{error}</p>
              {error === 'Invalid password' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>From 8 to 32 characters</li>
                  <li>Includes lowercase letters and numbers</li>
                  <li>Include special characters (!,$,@,%,...)</li>
                  <li>Must include at least 1 uppercase letter</li>
                </ul>
              )}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded text-white ${
              loading
                ? 'bg-gray-300 opacity-50 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Continue'}
          </button>
          <p className="text-center text-sm">
            New here?{' '}
            <a href="/sign-up" className="text-pink-500 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;