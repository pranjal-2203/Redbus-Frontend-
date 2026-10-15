import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
function BusDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {
        bus,
        from,
        to,
        date,
        selectedSeats: previousSeats = []
    } = location.state || {};
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState(previousSeats);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const getSeats = async () => {
            try {
                const response = await api.get(`/buses/${id}/seats`);
                const allSeats = response.data.seats || [];
                const sortedSeats = [...allSeats].sort(
                    (a, b) => Number(a.seatNumber) - Number(b.seatNumber)
                );
                setSeats(sortedSeats);
                setSelectedSeats((previous) =>
                    previous.filter((selected) =>
                        sortedSeats.some(
                            (seat) =>
                                seat.id === selected.id &&
                                seat.status !== "booked"
                        )
                    )
                );
            } catch (error) {
                console.log(error);
                setError("Unable to load seats");
            } finally {
                setLoading(false);
            }
        };
        getSeats();
    }, [id]);
    const handleSeatClick = (seat) => {
        if (seat.status === "booked") return;
        const alreadySelected = selectedSeats.some(
            (item) => item.id === seat.id
        );
        if (alreadySelected) {
            setSelectedSeats(
                selectedSeats.filter((item) => item.id !== seat.id)
            );
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };
    const continueBooking = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }
        navigate("/boarding-dropping", {
            state: {
                busId: id,
                bus,
                from,
                to,
                date,
                selectedSeats,
                seatId: selectedSeats[0].id,
                seatNumber: selectedSeats[0].seatNumber
            }
        });
    };
    if (loading) {
        return <div className="p-6">Loading seats...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <nav className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="border px-4 py-2"
                >
                    Back
                </button>
            </nav>
            <h2 className="text-xl font-bold mb-4">
                Select Your Seat
            </h2>
            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}
            <div className="w-fit">
                <div className="grid grid-cols-4 gap-3">
                    {seats.map((seat) => {
                        const isSelected = selectedSeats.some(
                            (item) => item.id === seat.id
                        );
                        const isBooked = seat.status === "booked";
                        return (
                            <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={isBooked}
                                className={`w-14 h-12 ${
                                    isBooked
                                        ? "bg-gray-400"
                                        : isSelected
                                        ? "bg-red-500 text-white"
                                        : "bg-white"
                                }`}
                            >
                                {seat.seatNumber}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="border-t mt-6 pt-5">
                <p className="mb-3 font-semibold">
                    Selected Seats:
                </p>
                {selectedSeats.length > 0 ? (
                    <p className="mb-4">
                        {selectedSeats
                            .map((seat) => seat.seatNumber)
                            .join(", ")}
                    </p>
                ) : (
                    <p className="mb-4">No seat selected</p>
                )}
                <p className="mb-4">
                    Number of Seats: {selectedSeats.length}
                </p>
                <button
                    disabled={selectedSeats.length === 0}
                    onClick={continueBooking}
                    className={`px-6 py-2 border ${
                        selectedSeats.length === 0
                            ? "bg-gray-200 cursor-not-allowed"
                            : "border-red-500"
                    }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default BusDetails;
