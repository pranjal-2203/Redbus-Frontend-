import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({name: "",email: "",phoneNo: "" });
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getProfile();
    }, []);
    const getProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setUser(response.data.user);
        } catch (error) {
            setError("Please login to view your profile");
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.put("/users/profile", {name: user.name,email: user.email,phone: user.phoneNo
            });
            setEdit(false);
            alert("Profile updated successfully");
            getProfile();
        } catch (error) {
            setError(
                error.response?.data?.message || "Profile update failed"
            );
        }
    };
    if (loading) {
        return <div className="p-6">Loading...</div>;
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white border rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-6">
                    Personal Information
                </h1>
                {error && (
                    <p className="text-red-600 mb-4">
                        {error}
                    </p>
                )}
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={user.name || ""}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    name: e.target.value
                                })
                            }
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email || ""}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    email: e.target.value
                                })
                            }
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            value={user.phoneNo || ""}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    phoneNo: e.target.value
                                })
                            }
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>
                    {!edit ? (
                        <button
                            type="button"
                            onClick={() => setEdit(true)}
                            className="border border-gray-400 px-5 py-2"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div>
                            <button
                                type="submit"
                                className="bg-red-600 text-white px-5 py-2 mr-3"
                            >
                                Update Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setEdit(false)}
                                className="border border-gray-400 px-5 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
                <button
                    onClick={() => navigate("/account")}
                    className="mt-5 text-red-600"
                >
                    Back to Account
                </button>

            </div>
        </div>
    );
}

export default Profile;





