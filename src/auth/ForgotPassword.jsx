import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const api = import.meta.env.VITE_API_URL

  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to send password reset link. Try again later.");
    }
  };

  const handleBackToHome = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
        <button
            onClick={handleBackToHome}
            className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-400 focus:outline-none"
          >
            <ArrowLeft className="w-6 h-6" />
        </button>
      <div className="max-w-md w-full text-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleForgotPassword} className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full bg-gray-700 text-white pl-4 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Send Reset Link
          </button>

          {message && <p className="text-center text-sm text-gray-400 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

