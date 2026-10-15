import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
function GovernmentBuses() {
const [searchParams] = useSearchParams();
const navigate = useNavigate();
const operator = searchParams.get("operator");
const [buses, setBuses] = useState([]);
useEffect(() => {
    const getBuses = async () => {
            try {
                const response = await api.get("/buses/government", { params: {operator: operator }});
                setBuses(response.data.buses);
            } catch (error) {
                console.log("Government buses error:", error);
            }
        }; if (operator) {
            getBuses();
        }
    }, [operator]);
    return (
        <div className="p-6">

            {/* Navbar */}
            <nav className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    onClick={() => navigate("/home")}
                    className="border border-gray-400 px-4 py-2"
                >
                    Back
                </button>
            </nav>

            {/* Page Heading */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    {operator} Bus Services
                </h2>
                <p className="mt-2">
                    Government bus services available on our platform.
                </p>
            </div>

            {/* Bus List */}
            <main>
                <h2 className="text-xl font-bold mb-4">
                    Available {operator} Buses
                </h2>
                {buses.length > 0 ? (
                    <div className="space-y-4">
                        {buses.map((bus) => (
                            <div
                                key={bus.id}
                                className="border border-gray-400 p-4"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {bus.busName}
                                        </h3>
                                        <p className="mt-2">
                                            {bus.from} → {bus.to}
                                        </p>
                                        <p className="mt-1">
                                            Travel Date: {bus.travelDate}
                                        </p>
                                        <p className="mt-1">
                                            Available Seats: {bus.totalSeats}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">
                                            ₹{bus.price}
                                        </p>
                                        <button
                                            onClick={() =>
                                                navigate(`/bus/${bus.id}`)
                                            }
                                            className="border border-gray-400 px-4 py-2 mt-3"
                                        >
                                            Select Seat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border border-gray-400 p-6">
                        <h3 className="text-lg font-bold">
                            No {operator} buses available
                        </h3>
                        <p className="mt-2">
                            Please check again later.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );}
export default GovernmentBuses;