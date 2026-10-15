import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
function Account() {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border rounded-lg">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-semibold mb-2">
                            Log in to manage your bookings
                        </h1>
                        <Link
                            to="/login"
                            className="inline-block bg-red-600 text-white px-6 py-2 rounded mt-3"
                        >
                            Log in
                        </Link>
                        <p className="mt-4 text-gray-600">
                            Don't have an account?
                        </p>
                        <Link
                            to="/signup"
                            className="text-red-600 font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">
                            My details
                        </h2>
                        <Link
                            to="/my-bookings"
                            className="block py-3 border-b hover:bg-gray-50"
                        >
                            My Bookings
                        </Link>
                        <Link
                            to="/profile"
                            className="block py-3 hover:bg-gray-50"
                        >
                            Personal Information
                        </Link>
                    </div>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            More
                        </h2>
                        <Link
                            to="/offers"
                            className="block py-3 border-b hover:bg-gray-50"
                        >
                            Offers
                        </Link>
                        <Link
                            to="/help"
                            className="block py-3 border-b hover:bg-gray-50"
                        >
                            Help & Support
                        </Link>
                        <Link
                            to="/faq"
                            className="block py-3 border-b hover:bg-gray-50"
                        >
                            FAQ
                        </Link>
                        <button
                            onClick={() => setShowLogout(true)}
                            className="block py-3 text-left text-red-600"
                        >
                            Logout
                        </button>
                        {showLogout && (
                            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                                <p className="font-medium mb-4">
                                    Are you sure you want to logout?
                                </p>
                                <button
                                    onClick={() => setShowLogout(false)}
                                    className="border px-4 py-2 rounded mr-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;