import { useLocation, useNavigate } from "react-router-dom";
function Confirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        booking,
        bus,
        payment,
        selectedSeats,
        seatNumbers
    } = location.state || {};
    if (!booking) {
        return (
            <div className="p-6">
                <p>Booking details not found.</p>
                <button
                    onClick={() => navigate("/home")}
                    className="border px-4 py-2 mt-4"
                >
                    Go Home
                </button>
            </div>
        );
    }
    const bookedSeats =
        seatNumbers ||
        selectedSeats?.map((seat) =>
            seat.seatNumber || seat.seat_number
        ).filter(Boolean) ||
        [
            booking.seatNumber ||
            booking.seat_number
        ].filter(Boolean);
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="border rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">
                    Booking Confirmed
                </h1>
                <p className="mb-6">
                    Your bus ticket has been booked successfully.
                </p>
                <div className="border-t py-4">
                    <p className="mb-3">
                        <strong>Booking ID:</strong> {booking.id}
                    </p>
                    <p className="mb-3">
                        <strong>Bus:</strong>{" "}
                        {bus?.busName || booking.busName || "N/A"}
                    </p>
                    <p className="mb-3">
                        <strong>Seat Number:</strong>{" "}
                        {bookedSeats.length > 0
                            ? bookedSeats.join(", ")
                            : "Seat number not provided"}
                    </p>
                    <p className="mb-3">
                        <strong>Passenger:</strong>{" "}
                        {booking.passengerName || "N/A"}
                    </p>
                    <p className="mb-3">
                        <strong>Amount:</strong>{" "}
                        ₹{booking.amount ?? "N/A"}
                    </p>
                    <p className="mb-3">
                        <strong>Payment Status:</strong>{" "}
                        {payment?.status || "N/A"}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/my-bookings")}
                    className="border px-4 py-2 mt-4"
                >
                    My Bookings
                </button>
                <button
                    onClick={() => navigate("/home")}
                    className="border px-4 py-2 mt-4 ml-3"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}

export default Confirmation;
