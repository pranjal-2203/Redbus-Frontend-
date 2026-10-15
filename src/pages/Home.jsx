import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Home() {
    const navigate = useNavigate();
   const [from, setFrom] = useState(
    () => sessionStorage.getItem("busFrom") || ""
);
const [to, setTo] = useState(
    () => sessionStorage.getItem("busTo") || ""
);
const [date, setDate] = useState(
    () => sessionStorage.getItem("busDate") || ""
);
    const [routes, setRoutes] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [fromCities, setFromCities] = useState([]);
    const [toCities, setToCities] = useState([]);
    const [showFromCities, setShowFromCities] = useState(false);
    const [showToCities, setShowToCities] = useState(false);
    const [fromError, setFromError] = useState("");
    const [toError, setToError] = useState("");
    const [dateError, setDateError] = useState("");

    // From city search
    const handleFromChange = async (value) => {
        setFrom(value);
        setFromError("");
        if (!value.trim()) {
            setFromCities([]);
            setShowFromCities(false);
            return;
        }
        try {
            const response = await api.get("/cities", {
                params: { search: value }
            });
            setFromCities(response.data.cities || []);
            setShowFromCities(true);
        } catch (error) {
            console.log("From city search error:", error);
            setFromCities([]);
        }
    };

    // To city search
    const handleToChange = async (value) => {
        setTo(value);
        setToError("");
        if (!value.trim()) {
            setToCities([]);
            setShowToCities(false);
            return;
        }
        try {
            const response = await api.get("/cities", {
                params: { search: value }
            });
            setToCities(response.data.cities || []);
            setShowToCities(true);
        } catch (error) {
            console.log("To city search error:", error);
            setToCities([]);
        }
    };

    // Popular routes and coupons
    useEffect(() => {
        const getData = async () => {
            try {
                const routesResponse = await api.get(
                    "/buses/popular-routes"
                );
                setRoutes(routesResponse.data.routes || []);
                const couponsResponse = await api.get("/coupons");
                setCoupons(couponsResponse.data.coupons || []);
            } catch (error) {
                console.log("Home data error:", error);
            }
        };
        getData();
    }, []);

    // Search buses
const searchBuses = async () => {
    let hasError = false;
    setFromError("");
    setToError("");
    setDateError("");
    if (!from.trim()) {
        setFromError("Please enter source city");
        hasError = true;
    }
    if (!to.trim()) {
        setToError("Please enter destination city");
        hasError = true;
    }
    if (!date) {
        setDateError("Please select travel date");
        hasError = true;
    }
    if (hasError) {
        return;
    }

    // Save search details
    sessionStorage.setItem("busFrom", from);
    sessionStorage.setItem("busTo", to);
    sessionStorage.setItem("busDate", date);
    try {
        const response = await api.get("/buses/search", {
            params: {
                from,
                to,
                date
            }
        });
        navigate("/buses", {
            state: {
                buses: response.data.buses || [],
                from,
                to,
                date
            }
        });
    } catch (error) {
        console.log("Bus search error:", error);
    }
};

    // Swap cities
    const swapCity = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
        setFromError("");
        setToError("");
    };
    return (
        <div className="min-h-screen p-5">

            {/* Navbar */}
            <nav className="border-b pb-4 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-red-600">
                        redBus
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/help")}
                        >
                            Help
                        </button>
                        <button
                            onClick={() => navigate("/my-bookings")}
                        >
                            My Bookings
                        </button>
                        <button
                            onClick={() => navigate("/account")}
                        >
                            Account
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search */}
            <section className="border p-5 mb-8">
                <p className="mb-5">
                    Search and book your bus tickets easily.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_50px_1fr_1fr_1fr] gap-3 items-start">

                    {/* From */}
                    <div className="relative">
                        <label className="block mb-1">
                            From
                        </label>
                        <input
                            type="text"
                            placeholder="Enter source city"
                            value={from}
                            onChange={(e) =>
                                handleFromChange(e.target.value)
                            }
                            className={`w-full border p-2 ${
                                fromError
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {fromError && (
                            <p className="text-red-600 text-sm mt-1">
                                {fromError}
                            </p>
                        )}
                        {showFromCities &&
                            fromCities.length > 0 && (
                                <div className="absolute bg-white border w-full z-10">
                                    {fromCities.map((city) => (
                                        <button
                                            key={city.id}
                                            type="button"
                                            onClick={() => {
                                                setFrom(city.name);
                                                setFromError("");
                                                setShowFromCities(false);
                                            }}
                                            className="block w-full text-left p-2 hover:bg-gray-100"
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>
                    {/* Swap */}
                    <div className="flex justify-center pt-7">
                        <button
                            onClick={swapCity}
                            className="border rounded-full w-9 h-9 flex items-center justify-center"
                        >
                            ⇄
                        </button>
                    </div>

                    {/* To */}
                    <div className="relative">
                        <label className="block mb-1">
                            To
                        </label>
                        <input
                            type="text"
                            placeholder="Enter destination city"
                            value={to}
                            onChange={(e) =>
                                handleToChange(e.target.value)
                            }
                            className={`w-full border p-2 ${
                                toError
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {toError && (
                            <p className="text-red-600 text-sm mt-1">
                                {toError}
                            </p>
                        )}
                        {showToCities &&
                            toCities.length > 0 && (
                                <div className="absolute bg-white border w-full z-10">
                                    {toCities.map((city) => (
                                        <button
                                            key={city.id}
                                            type="button"
                                            onClick={() => {
                                                setTo(city.name);
                                                setToError("");
                                                setShowToCities(false);
                                            }}
                                            className="block w-full text-left p-2 hover:bg-gray-100"
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block mb-1">
                            Travel Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            min={
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(e) => {
                                setDate(e.target.value);
                                setDateError("");
                            }}
                            className={`w-full border p-2 ${
                                dateError
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {dateError && (
                            <p className="text-red-600 text-sm mt-1">
                                {dateError}
                            </p>
                        )}
                    </div>

                    {/* Search */}
                    <div className="pt-7">
                        <button
                            onClick={searchBuses}
                            className="bg-blue-600 text-white px-4 py-2 w-full"
                        >
                            Search Buses
                        </button>
                    </div>
                </div>
            </section>

            {/* Popular Routes */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3">
                    Popular Bus Routes
                </h2>
                {routes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {routes.map((route, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setFrom(route.from);
                                    setTo(route.to);
                                    setFromError("");
                                    setToError("");
                                }}
                                className="border p-4 text-left hover:bg-gray-50"
                            >
                                {route.from} → {route.to}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p>No routes available.</p>
                )}
            </section>

{/* Offers and Coupons */}
<section className="mb-8">
    <h2 className="text-xl font-bold mb-3">
        Offers and Coupons
    </h2>
    {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {coupons.map((coupon) => (
                <button
                    key={coupon.id}
                    type="button"
                    onClick={() =>
                        navigate(`/offers/${coupon.id}`, {
                            state: { coupon }
                        })
                    }
                    className="border p-3 bg-white text-left"
                >
                    <h3 className="font-bold text-base">
                        {coupon.code}
                    </h3>
                    <p className="text-sm mt-1">
                        {String(
                            coupon.discountType ||
                            coupon.discount_type ||
                            ""
                        ).toUpperCase().includes("PERCENT")
                            ? `Get ${coupon.discountValue ?? coupon.discount_value}% OFF`
                            : `Get ₹${coupon.discountValue ?? coupon.discount_value} OFF`}
                    </p>
                    {(coupon.minAmount ?? coupon.min_amount) > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum booking amount: ₹
                            {coupon.minAmount ?? coupon.min_amount}
                        </p>
                    )}
                    {(coupon.maxDiscount ?? coupon.max_discount) != null && (
                        <p className="text-xs text-gray-500 mt-1">
                            Maximum discount: ₹
                            {coupon.maxDiscount ?? coupon.max_discount}
                        </p>
                    )}
                    <p className="text-sm mt-3 underline">
                        View Offer Details
                    </p>
                </button>
            ))}
        </div>
    ) : (
        <p>No coupons available.</p>
    )}
</section>

            {/* Government Buses */}
            <section className="border p-5 mb-8">
                <h2 className="text-xl font-bold mb-2">
                    Government Bus Services
                </h2>
                <p className="mb-4">
                    Select a bus operator to view available buses.
                </p>
                <div className="flex flex-wrap gap-3">
                    {["MSRTC", "TSRTC", "APSRTC", "KSRTC"].map(
                        (operator) => (
                            <button
                                key={operator}
                                onClick={() =>
                                    navigate(
                                        `/government-buses?operator=${operator}`
                                    )
                                }
                                className="border px-4 py-2"
                            >
                                {operator}
                            </button>
                        )
                    )}
                </div>
            </section>

            {/* Why Book */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3">
                    Why Book With Us?
                </h2>
                <ul className="list-disc pl-5">
                    <li>Different bus operators and routes</li>
                    <li>Easy bus search</li>
                    <li>Seat selection and ticket booking</li>
                    <li>Customer support</li>
                </ul>
            </section>

            {/* Download App */}
            <section className="border p-5 mb-8">
                <h2 className="text-xl font-bold">
                    Book Your Bus Tickets Easily
                </h2>
                <p className="my-3">
                    Manage your trips and bus bookings.
                </p>
                <a
                    href="https://www.redbus.in/download-app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                >
                    Download App
                </a>
            </section>

            {/* Help */}
            <section className="border p-5">
                <h2 className="text-xl font-bold">
                    Need Help?
                </h2>
                <p className="my-3">
                    Check FAQs or contact our support team.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/faq")}
                        className="border px-4 py-2"
                    >
                        FAQs
                    </button>
                    <button
                        onClick={() =>
                            navigate("/contact-support")
                        }
                        className="border px-4 py-2"
                    >
                        Contact Support
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;