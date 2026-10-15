import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const {booking,bus,selectedSeats = [],seatNumbers,...otherDetails } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    if (!booking) {
        return (
            <div className="p-6">
                <p>Booking details not found.</p>
                <button
                    onClick={() => navigate("/home")}
                    className="border border-gray-400 px-4 py-2 mt-4"
                >
                    Go Home
                </button>
            </div>
        );
    }
    const actualSeatNumbers =
        seatNumbers ||
        selectedSeats
            .map((seat) =>
                typeof seat === "object"
                    ? seat.seatNumber || seat.seat_number
                    : seat
            )
            .filter(Boolean);
    const handlePayment = async () => {
        if (!paymentMethod) {
            setError("Please select payment method");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const response = await api.post("/payments", {
                bookingId: booking.id,
                amount: booking.amount,
                paymentMethod
            });
            navigate("/confirmation", {
                state: {
                    ...otherDetails,
                    booking,
                    bus,
                    payment: response.data.payment,
                    selectedSeats,
                    seatNumbers: actualSeatNumbers
                }
            });
        } catch (error) {
            setError(
                error.response?.data?.message || "Payment failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-6">
                Payment
            </h1>
            <p className="mb-4">
                Booking ID: {booking.id}
            </p>
            {actualSeatNumbers.length > 0 && (
                <p className="mb-4">
                    Booked Seat(s):{" "}
                    <strong>{actualSeatNumbers.join(", ")}</strong>
                </p>
            )}
            <p className="mb-6">
                Amount: <strong>₹{booking.amount}</strong>
            </p>
            <div className="mb-6">
                <label className="block mb-2">
                    Payment Method
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="border border-gray-400 p-2 w-80"
                >
                    <option value="">Select Payment Method</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>
            {error && (
                <p className="text-red-600 mb-4">
                    {error}
                </p>
            )}
            <div className="flex gap-3">
                <button
                    onClick={() =>
                        navigate("/booking-summary", {
                            state: location.state
                        })
                    }
                    disabled={loading}
                    className="border border-gray-400 px-5 py-2 rounded"
                >
                    Back
                </button>
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-red-600 text-white px-5 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}

export default Payment;
