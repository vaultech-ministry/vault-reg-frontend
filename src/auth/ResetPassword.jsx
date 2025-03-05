import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password has been reset successfully.");
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to reset password. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="max-w-md w-full text-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-gray-400">Enter your new password to reset it</p>
        </div>

        <form onSubmit={handleResetPassword} className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white pl-4 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 text-white pl-4 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Reset Password
          </button>

          {message && <p className="text-center text-sm text-gray-400 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

