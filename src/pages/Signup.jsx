import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {e.preventDefault();setError("");
        if (!name || !email || !phone || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            await api.post("/users/signup", {name,email,phone,password });
            alert("Signup successful. Please login.");
            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message || "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6">
            <form
                onSubmit={handleSignup}
                className="w-96"
            >
                <h1 className="text-2xl font-semibold mb-6">
                    Create Account
                </h1>
                <div className="mb-4">
                    <label className="block mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                    />
                </div>
                {error && (
                    <p className="text-red-600 mb-3">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="border border-gray-400 px-5 py-2"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>
                <p className="mt-4">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-red-600"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;