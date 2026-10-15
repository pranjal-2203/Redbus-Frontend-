import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
function BoardingDropping() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        busId,
        bus,
        from,
        to,
        date,
        selectedSeats = [],
        seatId,
        seatNumber,
        boardingPoint: previousBoardingPoint,
        droppingPoint: previousDroppingPoint
    } = location.state || {};
    const [boardingPoints, setBoardingPoints] = useState([]);
    const [droppingPoints, setDroppingPoints] = useState([]);
    const [boardingText, setBoardingText] = useState(
        previousBoardingPoint?.pointName || ""
    );
    const [droppingText, setDroppingText] = useState(
        previousDroppingPoint?.pointName || ""
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [boardingError, setBoardingError] = useState("");
    const [droppingError, setDroppingError] = useState("");

    // Remove duplicate points by name
    const removeDuplicatePoints = (points = []) => {
        const uniquePoints = new Map();
        points.forEach((point) => {
            const name = point.pointName?.trim();
            if (name && !uniquePoints.has(name.toLowerCase())) {
                uniquePoints.set(name.toLowerCase(), {
                    ...point,
                    pointName: name
                });
            }
        });
        return Array.from(uniquePoints.values());
    };
    useEffect(() => {
        const getPoints = async () => {
            try {
                const response = await api.get(`/buses/${busId}/points`);
                const boarding = removeDuplicatePoints(
                    response.data.boardingPoints || []
                );
                const dropping = removeDuplicatePoints(
                    response.data.droppingPoints || []
                );
                setBoardingPoints(boarding);
                setDroppingPoints(dropping);
            } catch (err) {
                console.log("Points API Error:", err);
                setError("Unable to load boarding and dropping points");
            } finally {
                setLoading(false);
            }
        };
        if (busId) {
            getPoints();
        } else {
            setLoading(false);
            setError("Bus ID not found");
        }
    }, [busId]);
    const handleContinue = () => {
        setError("");
        setBoardingError("");
        setDroppingError("");
        const boardingPoint = boardingPoints.find(
            (point) =>
                point.pointName.trim().toLowerCase() ===
                boardingText.trim().toLowerCase()
        );
        const droppingPoint = droppingPoints.find(
            (point) =>
                point.pointName.trim().toLowerCase() ===
                droppingText.trim().toLowerCase()
        );
        let hasError = false;
        if (!boardingPoint) {
            setBoardingError("Please select a boarding point");
            hasError = true;
        }
        if (!droppingPoint) {
            setDroppingError("Please select a dropping point");
            hasError = true;
        }
        if (hasError) return;
        navigate("/passenger-details", {
            state: {
                busId,
                bus,
                from,
                to,
                date,
                selectedSeats,
                seatId: seatId || selectedSeats[0]?.id,
                seatNumber:
                    seatNumber || selectedSeats[0]?.seatNumber,
                boardingPoint,
                droppingPoint
            }
        });
    };
    if (loading) {
        return (
            <div className="p-6">
                Loading boarding and dropping points...
            </div>
        );
    }
    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    type="button"
                    onClick={() =>
                        navigate(`/bus/${busId}`, {
                            state: {
                                bus,
                                from,
                                to,
                                date,
                                selectedSeats,
                                seatId: seatId || selectedSeats[0]?.id,
                                seatNumber:
                                    seatNumber ||
                                    selectedSeats[0]?.seatNumber
                            }
                        })
                    }
                    className="border border-gray-400 px-4 py-2"
                >
                    Back
                </button>
            </div>
            <h2 className="text-xl font-bold mb-6">
                Boarding & Dropping Points
            </h2>

            {/* Bus Information */}
            {bus && (
                <div className="border p-4 mb-6 w-full max-w-sm">
                    <h3 className="font-bold text-lg">
                        {bus.busName}
                    </h3>
                    <p>{from} → {to}</p>
                    <p>Journey Date: {date}</p>
                    <p>Departure: {bus.departureTime}</p>
                    <p>Arrival: {bus.arrivalTime}</p>
                </div>
            )}

            {/* Selected Seats */}
            <p className="mb-6">
                Selected Seat(s):{" "}
                <strong>
                    {selectedSeats.length > 0
                        ? selectedSeats
                              .map((seat) => seat.seatNumber)
                              .join(", ")
                        : seatNumber || "None"}
                </strong>
            </p>
            {error && (
                <p className="text-red-600 mb-4">
                    {error}
                </p>
            )}

            {/* Boarding Point */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    Boarding Point *
                </label>
                <input
                    type="text"
                    value={boardingText}
                    onChange={(e) => {
                        setBoardingText(e.target.value);
                        setBoardingError("");
                    }}
                    placeholder="Select boarding point"
                    className="border border-gray-400 p-2 w-full max-w-sm"
                />
                {boardingError && (
                    <p className="text-red-600 text-sm mt-1">
                        {boardingError}
                    </p>
                )}
                <div className="mt-2">
                    {boardingPoints.map((point) => (
                        <button
                            key={point.id}
                            type="button"
                            onClick={() => {
                                setBoardingText(point.pointName);
                                setBoardingError("");
                            }}
                            className="block border border-gray-300 px-3 py-2 mb-1 w-full max-w-sm text-left bg-white text-black"
                        >
                            {point.pointName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dropping Point */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    Dropping Point *
                </label>
                <input
                    type="text"
                    value={droppingText}
                    onChange={(e) => {
                        setDroppingText(e.target.value);
                        setDroppingError("");
                    }}
                    placeholder="Select dropping point"
                    className="border border-gray-400 p-2 w-full max-w-sm"
                />
                {droppingError && (
                    <p className="text-red-600 text-sm mt-1">
                        {droppingError}
                    </p>
                )}
                <div className="mt-2">
                    {droppingPoints.map((point) => (
                        <button
                            key={point.id}
                            type="button"
                            onClick={() => {
                                setDroppingText(point.pointName);
                                setDroppingError("");
                            }}
                            className="block border border-gray-300 px-3 py-2 mb-1 w-full max-w-sm text-left bg-white text-black"
                        >
                            {point.pointName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Continue */}
            <button
                type="button"
                onClick={handleContinue}
                className="border border-gray-400 px-5 py-2"
            >
                Continue
            </button>
        </div>
    );
}

export default BoardingDropping;
