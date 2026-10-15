import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function ContactSupport() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {e.preventDefault();
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "Please enter your name";
        }
        if (!email.trim()) {
            newErrors.email = "Please enter your email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!message.trim()) {
            newErrors.message = "Please enter your message";
        }
        setErrors(newErrors);
        setSuccess("");
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            setLoading(true);
            await api.post("/support", {
                name: name.trim(),
                email: email.trim(),
                message: message.trim()
            });
            setSuccess("Your support request has been submitted successfully.");
            setName("");
            setEmail("");
            setMessage("");
            setErrors({});
        } catch (error) {
            setErrors({
                submit:
                    error.response?.data?.message ||
                    "Unable to submit your request. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6">
            <nav className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="border border-gray-400 px-4 py-2"
                >
                    Back
                </button>
            </nav>
            <h2 className="text-2xl font-bold mb-2">
                Contact Support
            </h2>
            <p className="mb-6">
                Have a problem with your booking? Contact our support team.
            </p>
            <form onSubmit={handleSubmit} noValidate className="max-w-lg">
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className="border border-gray-400 p-2 w-full"
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className="border border-gray-400 p-2 w-full"
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setErrors((prev) => ({ ...prev, message: "" }));
                        }}
                        className="border border-gray-400 p-2 w-full"
                        rows="5"
                        placeholder="Describe your problem"
                    />
                    {errors.message && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.message}
                        </p>
                    )}
                </div>
                {errors.submit && (
                    <p className="text-red-600 mb-4">
                        {errors.submit}
                    </p>
                )}
                {success && (
                    <p className="text-green-700 mb-4">
                        {success}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="border border-gray-400 px-5 py-2"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default ContactSupport;
