import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function MyBookings() {
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState("");
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [confirmCancelId, setConfirmCancelId] = useState(null);
    const [confirmRefundId, setConfirmRefundId] = useState(null);
    const getBookings = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setBookings([]);
            setSearched(false);
            const response = await api.get(
                `/bookings/lookup?bookingId=${encodeURIComponent(bookingId.trim())}&email=${encodeURIComponent(email.trim())}`
            );
            const result = response.data.booking
                ? [response.data.booking]
                : response.data.bookings || [];
            setBookings(result);
            setSearched(true);
            if (result.length === 0) {
                setError("Invalid Booking ID or Email. Please check your details.");
            }
        } catch (error) {
            setSearched(false);
            setError(
                error.response?.data?.message ||
                "Invalid Booking ID or Email. Please check your details."
            );
        } finally {
            setLoading(false);
        }
    };
    const cancelBooking = async (id) => {
        try {
            setProcessingId(id);
            setError("");
            await api.patch(`/bookings/${id}/cancel`);
            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === id
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );
            setConfirmCancelId(null);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to cancel booking. Please try again."
            );
        } finally {
            setProcessingId(null);
        }
    };
    const refundBooking = async (id) => {
        try {
            setProcessingId(id);
            setError("");
            await api.patch(`/bookings/${id}/refund`);
            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === id
                        ? { ...booking, status: "refunded" }
                        : booking
                )
            );
            setConfirmRefundId(null);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process refund. Please try again."
            );
        } finally {
            setProcessingId(null);
        }
    };
    return (
        <div className="p-6">
            <nav className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold">redBus</h1>
                <button
                    onClick={() => navigate("/home")}
                    className="border px-4 py-2"
                >
                    Home
                </button>
            </nav>
            <h2 className="text-xl font-bold mb-6">
                My Bookings
            </h2>
            {!searched && (
                <form
                    onSubmit={getBookings}
                    className="border p-5 max-w-md mb-6"
                >
                    <h3 className="font-semibold mb-4">
                        Find Your Booking
                    </h3>
                    <label className="block mb-2">
                        Booking ID
                    </label>
                    <input
                        type="text"
                        value={bookingId}
                        onChange={(e) => {
                            setBookingId(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter Booking ID"
                        required
                        className="border p-2 w-full mb-4"
                    />
                    <label className="block mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter booking email"
                        required
                        className="border p-2 w-full mb-4"
                    />
                    {error && (
                        <p className="text-red-600 text-sm mb-4">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="border px-4 py-2 disabled:opacity-50"
                    >
                        {loading ? "Searching..." : "Find Booking"}
                    </button>
                </form>
            )}
            {searched && (
                <>
                    {error && (
                        <p className="text-red-600 mb-4">
                            {error}
                        </p>
                    )}
                    <button
                        onClick={() => {
                            setBookings([]);
                            setBookingId("");
                            setEmail("");
                            setError("");
                            setSearched(false);
                            setConfirmCancelId(null);
                            setConfirmRefundId(null);
                        }}
                        className="border px-4 py-2 mb-5"
                    >
                        Search Another Booking
                    </button>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border p-5 mb-5"
                        >
                            <p>
                                <strong>Booking ID:</strong>{" "}
                                {booking.id}
                            </p>
                            <p>
                                <strong>Passenger:</strong>{" "}
                                {booking.passengerName ||
                                    booking.passenger_name ||
                                    "N/A"}
                            </p>
                            <p>
                                <strong>Seat Number:</strong>{" "}
                                {booking.seatNumber ||
                                    booking.seat_number ||
                                    booking.seatId ||
                                    booking.seat_id ||
                                    "N/A"}
                            </p>
                            <p>
                                <strong>Amount:</strong>{" "}
                                ₹{booking.amount ?? "N/A"}
                            </p>
                            <p className="mb-3">
                                <strong>Status:</strong>{" "}
                                {booking.status}
                            </p>
                            {booking.status === "confirmed" && (
                                <>
                                    <button
                                        onClick={() =>
                                            setConfirmCancelId(booking.id)
                                        }
                                        className="border px-4 py-2"
                                    >
                                        Cancel Booking
                                    </button>
                                    {confirmCancelId === booking.id && (
                                        <div className="border p-4 mt-3">
                                            <p className="mb-3">
                                                Are you sure you want to cancel this booking?
                                            </p>
                                            <button
                                                onClick={() =>
                                                    cancelBooking(booking.id)
                                                }
                                                disabled={processingId === booking.id}
                                                className="border px-4 py-2 mr-3 disabled:opacity-50"
                                            >
                                                {processingId === booking.id
                                                    ? "Cancelling..."
                                                    : "Yes, Cancel"}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setConfirmCancelId(null)
                                                }
                                                disabled={processingId === booking.id}
                                                className="border px-4 py-2"
                                            >
                                                No, Keep Booking
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            {booking.status === "cancelled" && (
                                <>
                                    <button
                                        onClick={() =>
                                            setConfirmRefundId(booking.id)
                                        }
                                        className="border px-4 py-2"
                                    >
                                        Process Refund
                                    </button>
                                    {confirmRefundId === booking.id && (
                                        <div className="border p-4 mt-3">
                                            <p className="mb-3">
                                                Do you want to process a refund for this booking?
                                            </p>
                                            <button
                                                onClick={() =>
                                                    refundBooking(booking.id)
                                                }
                                                disabled={processingId === booking.id}
                                                className="border px-4 py-2 mr-3 disabled:opacity-50"
                                            >
                                                {processingId === booking.id
                                                    ? "Processing..."
                                                    : "Yes, Process Refund"}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setConfirmRefundId(null)
                                                }
                                                disabled={processingId === booking.id}
                                                className="border px-4 py-2"
                                            >
                                                No, Go Back
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default MyBookings;
