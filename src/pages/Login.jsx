import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {e.preventDefault();setError("");
        const newErrors = {};
        if (!email.trim() && !phone.trim()) {
            newErrors.email = "Please enter your email.";
            newErrors.phone = "Please enter your mobile number.";
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
            newErrors.phone = "Please enter a valid 10-digit mobile number.";
        }
        if (!password) {
            newErrors.password = "Please enter your password.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            await api.post("/users/login", {
                email: email.trim(),
                phone: phone.trim(),
                password
            });
            navigate("/home");
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;
            if (status === 404) {
                setError(
                    "Account not found. Please check your email or mobile number."
                );
            } else if (status === 401) {
                setError(
                    "Invalid email/mobile number or password."
                );
            } else {
                setError(message || "Unable to login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm"
                noValidate
            >
                <h1 className="text-2xl font-bold mb-6">
                    Login
                </h1>
                <div className="mb-4">
                    <label className="block mb-1">
                        Email
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({});
                            setError("");
                        }}
                        className="w-full border border-gray-400 p-2"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <p className="mb-4 text-sm">OR</p>
                <div className="mb-4">
                    <label className="block mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setErrors({});
                            setError("");
                        }}
                        className="w-full border border-gray-400 p-2"
                    />
                    {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">
                        Password
                    </label>
                    <div className="flex">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({});
                                setError("");
                            }}
                            className="border border-gray-400 p-2 flex-1 min-w-0"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="border border-gray-400 px-3"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>
                <p className="mb-4 text-sm">
                    Forgot Password?
                </p>
                {error && (
                    <p className="text-red-600 text-sm mb-3">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="border border-gray-400 px-5 py-2 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="mt-4">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-red-600"
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
}

export default Login;
