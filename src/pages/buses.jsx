import { useLocation, useNavigate } from "react-router-dom";
function Buses() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        buses = [],
        from,
        to,
        date
    } = location.state || {};
    const formatTime = (time) => {
        if (!time) return "-";
        const [hour, minute] = time.split(":");
        const h = Number(hour);
        const period = h >= 12 ? "PM" : "AM";
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minute} ${period}`;
    };
    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
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

            {/* Route Details */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    {from} → {to}
                </h2>
                <p className="mt-2">
                    Travel Date: {date}
                </p>
            </div>
            <h2 className="text-xl font-bold mb-4">
                Available Buses
            </h2>
            {buses.length > 0 ? (
                <div className="space-y-4">
                    {buses.map((bus) => (
                        <div
                            key={bus.id}
                            className="border p-5 bg-white"
                        >
                            <div className="flex justify-between gap-6">

                                {/* Bus Information */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">
                                        {bus.busName}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {bus.operator || "Bus Operator"}
                                    </p>

                                    {/* Time Information */}
                                    <div className="flex flex-wrap gap-8 mt-4">
                                        <div>
                                            <p className="font-bold">
                                                {formatTime(bus.departureTime)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Departure
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {formatTime(bus.arrivalTime)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Arrival
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {bus.duration || "-"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Duration
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {bus.totalSeats}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Total Seats
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Seat Button */}
                                <div className="text-right min-w-32">
                                    <p className="text-sm text-gray-500">
                                        Starting from
                                    </p>
                                    <p className="text-2xl font-bold">
                                        ₹{bus.price}
                                    </p>
                                    <button
                                        onClick={() =>navigate(`/bus/${bus.id}`, {
                                            state: {
                                                    bus,
                                                    from,
                                                    to,
                                                    date
                                                }
                                            })
                                        }
                                        className="border border-red-500 px-5 py-2 mt-4"
                                    >
                                        Select Seat
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border p-6">
                    <h3 className="text-lg font-bold">
                        No buses available
                    </h3>
                    <p className="mt-2">
                        Try another route or travel date.
                    </p>
                    <button
                        onClick={() => navigate("/home")}
                        className="border border-gray-400 px-4 py-2 mt-4"
                    >
                        Search Again
                    </button>
                </div>
            )}
        </div>
    );
}

export default Buses;