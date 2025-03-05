import { login } from "../utils/auth";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const authValidation = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().min(4, "Password must be at least 4 characters").required("Required"),
});

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: authValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = await login(values);

        if (data.success) {
          toast.success("Login Successful");
          setIsAuth(true);
          navigate("/", { replace: true });
        } else {
          toast.error(data.error || "Login failed");
        }
      } catch (error) {
        toast.error("Something went wrong. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Vault Reg</h1>
          <p className="text-gray-400">Sign in to your account to manage member insights</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="kings@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                
              />
              <Mail className="absolute right-3 top-3 text-gray-400" />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
            
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <Link to="/forgotpassword" className="hover:text-yellow-400 transition">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full px-6 py-3 bg-indigo-600 text-gray-900 font-medium rounded-lg hover:bg-indigo-800 transition disabled:opacity-50"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
