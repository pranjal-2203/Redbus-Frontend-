
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
function PassengerDetails() {
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
        passengers: previousPassengers = [],
        contactDetails: previousContact = {}
    } = location.state || {};
    const seats = selectedSeats.length
        ? selectedSeats
        : seatNumber
        ? [{ id: seatId, seatNumber }]
        : [];
    const [passengers, setPassengers] = useState(() =>
        seats.map((seat, index) => ({
            id: seat.id,
            seatId: seat.id,
            seatNumber: seat.seatNumber,
            name: previousPassengers[index]?.name || "",
            age: previousPassengers[index]?.age || "",
            gender: previousPassengers[index]?.gender || ""
        }))
    );
    const [mobile, setMobile] = useState(
        previousContact.mobile || location.state?.mobile || ""
    );
    const [email, setEmail] = useState(
        previousContact.email || location.state?.email || ""
    );
    const [errors, setErrors] = useState({});
    const updatePassenger = (index, field, value) => {
        setPassengers((previous) =>
            previous.map((passenger, i) =>
                i === index
                    ? { ...passenger, [field]: value }
                    : passenger
            )
        );
        setErrors((previous) => ({
            ...previous,
            [`${index}-${field}`]: ""
        }));
    };
    const handleContinue = () => {
        const newErrors = {};
        if (passengers.length === 0) {
            newErrors.seats = "Please select a seat first";
        }
        passengers.forEach((passenger, index) => {
            if (!passenger.name.trim()) {
                newErrors[`${index}-name`] = "Enter passenger name";
            }
            if (
                !passenger.age ||
                Number(passenger.age) < 1 ||
                Number(passenger.age) > 120
            ) {
                newErrors[`${index}-age`] = "Enter a valid age";
            }

            if (!passenger.gender) {
                newErrors[`${index}-gender`] = "Select gender";
            }
        });
        if (!/^\d{10}$/.test(mobile)) {
            newErrors.mobile = "Enter a 10-digit mobile number";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        const contactDetails = { mobile, email };
        navigate("/booking-summary", {
            state: {
                busId,
                bus,
                from,
                to,
                date,
                selectedSeats: seats,
                seatId: seatId || seats[0]?.id,
                seatNumber: seatNumber || seats[0]?.seatNumber,
                boardingPoint,
                droppingPoint,
                passengers,
                passenger: passengers[0],
                contactDetails,
                mobile,
                email
            }
        });
    };

    const handleBack = () => {
        navigate("/boarding-dropping", {
            state: {
                busId,
                bus,
                from,
                to,
                date,
                selectedSeats: seats,
                seatId: seatId || seats[0]?.id,
                seatNumber: seatNumber || seats[0]?.seatNumber,
                boardingPoint,
                droppingPoint,
                passengers,
                contactDetails: { mobile, email },
                mobile,
                email
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-5">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-red-600">
                    redBus
                </h1>
                <button
                    type="button"
                    onClick={handleBack}
                    className="border border-gray-400 px-4 py-2"
                >
                    Back
                </button>
            </div>
            <h2 className="text-xl font-bold mb-5">
                Passenger Details
            </h2>
            {errors.seats && (
                <p className="text-red-600 text-sm mb-3">
                    {errors.seats}
                </p>
            )}
            <div className="border border-gray-300 rounded p-4">
                {passengers.map((passenger, index) => (
                    <div key={passenger.seatId || index}>
                        <h3 className="font-medium mb-4">
                            Passenger {index + 1}
                            {passenger.seatNumber
                                ? ` - Seat ${passenger.seatNumber}`
                                : ""}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={passenger.name}
                                onChange={(e) =>
                                    updatePassenger(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter full name"
                                className="w-full border border-gray-300 rounded p-2"
                            />
                            {errors[`${index}-name`] && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors[`${index}-name`]}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">
                                Age *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="120"
                                value={passenger.age}
                                onChange={(e) =>
                                    updatePassenger(
                                        index,
                                        "age",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter age"
                                className="w-full border border-gray-300 rounded p-2"
                            />
                            {errors[`${index}-age`] && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors[`${index}-age`]}
                                </p>
                            )}
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm mb-1">
                                Gender *
                            </label>
                            <select
                                value={passenger.gender}
                                onChange={(e) =>
                                    updatePassenger(
                                        index,
                                        "gender",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors[`${index}-gender`] && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors[`${index}-gender`]}
                                </p>
                            )}
                        </div>
                        {index < passengers.length - 1 && (
                            <hr className="my-5" />
                        )}
                    </div>
                ))}
                <div className="mb-4">
                    <label className="block text-sm mb-1">
                        Mobile Number *
                    </label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                            setMobile(
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                            );

                            setErrors((previous) => ({
                                ...previous,
                                mobile: ""
                            }));
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {errors.mobile && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.mobile}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            setErrors((previous) => ({
                                ...previous,
                                email: ""
                            }));
                        }}
                        placeholder="Enter email address"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={handleContinue}
                className="mt-5 bg-red-600 text-white px-6 py-2 rounded"
            >
                Continue
            </button>
        </div>
    );
}

export default PassengerDetails;

