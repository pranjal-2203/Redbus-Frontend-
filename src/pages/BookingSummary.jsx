import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
function BookingSummary() {
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
        boardingPoint,
        droppingPoint,
        passenger,
        passengers = [],
        contactDetails = {}
    } = location.state || {};
    const mobile =
        contactDetails.mobile ||
        location.state?.mobile ||
        passenger?.mobile ||
        "";
    const email =
        contactDetails.email ||
        location.state?.email ||
        passenger?.email ||
        "";
    const passengerList = passengers.length
        ? passengers
        : passenger
        ? [passenger]
        : [];
    const seatNumbers = selectedSeats
        .map((seat) =>
            typeof seat === "object"
                ? seat.seatNumber || seat.seat_number
                : seat
        )
        .filter(Boolean);
    const actualSeatNumbers = seatNumbers.length
        ? seatNumbers
        : [seatNumber].filter(Boolean);
    const actualSeatId =
        seatId ||
        selectedSeats[0]?.id ||
        selectedSeats[0]?.seatId ||
        selectedSeats[0]?.seat_id;
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const goBack = () => {
        navigate("/passenger-details", {
            state: {
                busId,
                bus,
                from,
                to,
                date,
                selectedSeats,
                seatId: actualSeatId,
                seatNumber: actualSeatNumbers[0],
                boardingPoint,
                droppingPoint,
                passengers: passengerList,
                passenger: passengerList[0],
                contactDetails: { mobile, email },
                mobile,
                email
            }
        });
    };
    if (
        !bus ||
        !busId ||
        !boardingPoint ||
        !droppingPoint ||
        passengerList.length === 0
    ) {
        return (
            <div className="p-6">
                <p className="text-red-600">
                    Booking details not found.
                </p>
                <button
                    onClick={() => navigate("/home")}
                    className="border border-gray-400 px-4 py-2 mt-4"
                >
                    Go Home
                </button>
            </div>
        );
    }
    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter coupon code");
            return;
        }
        try {
            setCouponLoading(true);
            setCouponError("");
            const response = await api.post("/coupons/validate", {
                code: couponCode.trim().toUpperCase(),
                amount: bus.price
            });
            setCoupon(response.data);
        } catch (err) {
            setCoupon(null);
            setCouponError(
                err.response?.data?.message ||
                "Unable to apply coupon"
            );
        } finally {
            setCouponLoading(false);
        }
    };
    const removeCoupon = () => {
        setCoupon(null);
        setCouponCode("");
        setCouponError("");
    };
    const discount = Number(coupon?.discount || 0);
    const finalAmount = coupon
        ? Number(coupon.finalAmount)
        : Number(bus.price);
    const handleBooking = async () => {
        try {
            setBookingLoading(true);
            setError("");
            const response = await api.post("/bookings", {
                userId: 1,
                busId,
                seatId: actualSeatId,
                boardingPointId: boardingPoint.id,
                droppingPointId: droppingPoint.id,
                passengerName: passengerList[0]?.name,
                passengerAge: passengerList[0]?.age,
                passengerGender: passengerList[0]?.gender,
                mobile,
                email,
                amount: finalAmount,
                couponCode: coupon?.coupon?.code || null,
                discount
            });
            navigate("/payment", {
                state: {
                    booking: response.data.booking,
                    bus,
                    from,
                    to,
                    date,
                    seatId: actualSeatId,
                    seatNumber: actualSeatNumbers[0],
                    seatNumbers: actualSeatNumbers,
                    selectedSeats,
                    passengers: passengerList,
                    passenger: passengerList[0],
                    contactDetails: { mobile, email },
                    boardingPoint,
                    droppingPoint,
                    originalAmount: bus.price,
                    discount,
                    finalAmount,
                    couponCode: coupon?.coupon?.code || null
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.message || "Booking failed"
            );
        } finally {
            setBookingLoading(false);
        }
    };
    return (
        <div className="p-6">
            <nav className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    onClick={goBack}
                    className="border border-gray-400 px-4 py-2"
                >
                    Back
                </button>
            </nav>
            <h2 className="text-xl font-bold mb-6">
                Booking Summary
            </h2>
            <div className="border p-4 mb-6">
                <h3 className="font-bold mb-3">Bus Details</h3>
                <p><strong>Bus:</strong> {bus.busName}</p>
                <p>
                    <strong>Route:</strong>{" "}
                    {from || bus.from} → {to || bus.to}
                </p>
                <p>
                    <strong>Travel Date:</strong>{" "}
                    {date || bus.travelDate}
                </p>
                <p><strong>Departure:</strong> {bus.departureTime}</p>
                <p><strong>Arrival:</strong> {bus.arrivalTime}</p>
                <p><strong>Duration:</strong> {bus.duration}</p>
                <p>
                    <strong>Seat(s):</strong>{" "}
                    {actualSeatNumbers.length
                        ? actualSeatNumbers.join(", ")
                        : "Seat number unavailable"}
                </p>
            </div>
            <div className="border p-4 mb-6">
                <h3 className="font-bold mb-3">
                    Boarding & Dropping
                </h3>
                <p>
                    <strong>Boarding:</strong>{" "}
                    {boardingPoint.pointName}
                </p>
                <p>
                    <strong>Dropping:</strong>{" "}
                    {droppingPoint.pointName}
                </p>
            </div>

            <div className="border p-4 mb-6">
                <h3 className="font-bold mb-3">
                    Passenger Details
                </h3>
                {passengerList.map((item, index) => (
                    <div key={item.seatId || index} className="mb-3">
                        {passengerList.length > 1 && (
                            <p className="font-medium">
                                Passenger {index + 1}
                            </p>
                        )}
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Age:</strong> {item.age}</p>
                        <p><strong>Gender:</strong> {item.gender}</p>
                        <p><strong>Mobile:</strong> {mobile}</p>
                        <p><strong>Email:</strong> {email}</p>
                    </div>
                ))}
            </div>
            <div className="border rounded-lg p-5 mb-6">
                <h3 className="font-bold mb-4">
                    Offers & Coupons
                </h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        disabled={coupon !== null}
                        className="border border-gray-400 px-4 py-2 flex-1"
                    />
                    {!coupon ? (
                        <button
                            onClick={applyCoupon}
                            disabled={couponLoading}
                            className="border border-red-600 text-red-600 px-5 py-2"
                        >
                            {couponLoading ? "Applying..." : "Apply"}
                        </button>
                    ) : (
                        <button
                            onClick={removeCoupon}
                            className="border border-gray-400 px-5 py-2"
                        >
                            Remove
                        </button>
                    )}
                </div>
                {couponError && (
                    <p className="text-red-600 mt-3">
                        {couponError}
                    </p>
                )}
                {coupon && (
                    <div className="mt-4 border p-4">
                        <p className="font-semibold">
                            Coupon {coupon.coupon.code} applied
                        </p>
                        <p className="mt-1">
                            You saved ₹{discount}
                        </p>
                    </div>
                )}
            </div>
            <div className="border-t pt-4">
                <h3 className="font-bold mb-4">Fare Details</h3>
                <div className="flex justify-between mb-2">
                    <span>Bus Fare</span>
                    <span>₹{bus.price}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span>Coupon Discount</span>
                        <span>- ₹{discount}</span>
                    </div>
                )}
                <div className="border-t pt-3 mt-3 flex justify-between">
                    <strong>Total Amount</strong>
                    <strong>₹{finalAmount}</strong>
                </div>
                {error && (
                    <p className="text-red-600 mt-4">{error}</p>
                )}
                <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="border border-gray-400 px-5 py-2 mt-5"
                >
                    {bookingLoading
                        ? "Creating Booking..."
                        : "Proceed to Payment"}
                </button>
            </div>
        </div>
    );
}

export default BookingSummary;
