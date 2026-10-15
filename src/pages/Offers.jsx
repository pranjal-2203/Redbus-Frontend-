import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
function Offers() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState(
        location.state?.coupon || null
    );
    const [loading, setLoading] = useState(!location.state?.coupon);
    const [error, setError] = useState("");
    useEffect(() => {
        const getCoupon = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/coupons");
                const coupons = Array.isArray(response.data)
                    ? response.data
                    : response.data?.coupons || [];
                const selected = coupons.find(
                    (item) => String(item.id) === String(id)
                );

                if (selected) {
                    setCoupon(selected);
                } else {
                    setCoupon(null);
                    setError("This offer could not be found.");
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load offer details."
                );
            } finally {
                setLoading(false);
            }
        };
        getCoupon();
    }, [id]);
    if (loading) {
        return (
            <div className="p-6 text-center">
                Loading offer details...
            </div>
        );
    }
    if (error || !coupon) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate("/home")}
                        className="mb-5 underline"
                    >
                        ← Back to Home
                    </button>
                    <div className="border rounded-lg p-6">
                        <p>{error || "Offer not found."}</p>
                    </div>
                </div>
            </div>
        );
    }
    const code = coupon.code || "Offer";
    const discountType = String(
        coupon.discountType || coupon.discount_type || ""
    ).toUpperCase();
    const discountValue =
        coupon.discountValue ?? coupon.discount_value ?? 0;
    const minAmount =
        coupon.minAmount ?? coupon.min_amount;
    const maxDiscount =
        coupon.maxDiscount ?? coupon.max_discount;
    const expiryDate =
        coupon.expiryDate ||
        coupon.expiry_date ||
        coupon.validUntil ||
        coupon.valid_until ||
        coupon.endDate ||
        coupon.end_date;
    const description =
        coupon.description ||
        coupon.terms ||
        coupon.termsAndConditions ||
        coupon.terms_and_conditions;
    const isPercentage = discountType.includes("PERCENT");
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate("/home")}
                    className="mb-5 underline"
                >
                    ← Back to Home
                </button>
                <div className="border rounded-lg overflow-hidden">
                    <div className="border-b p-6">
                        <p className="text-sm">
                            Offers & Coupons
                        </p>
                        <h1 className="text-3xl font-bold mt-2">
                            {isPercentage
                                ? `${discountValue}% OFF`
                                : `₹${discountValue} OFF`}
                        </h1>
                        <p className="mt-2">
                            Use this coupon on your bus booking.
                        </p>
                    </div>
                    <div className="p-6">
                        <p className="text-sm">
                            Coupon Code
                        </p>
                        <div className="flex items-center justify-between gap-3 border border-dashed rounded-lg p-4 mt-2">
                            <span className="text-xl font-bold">
                                {code}
                            </span>
                            <button
                                onClick={() => GenUI.copy(code)}
                                className="border px-4 py-2 rounded"
                            >
                                Copy Code
                            </button>
                        </div>
                        {minAmount != null && (
                            <div className="border-b py-4">
                                <h2 className="font-semibold">
                                    Minimum Booking Amount
                                </h2>
                                <p className="mt-1">
                                    ₹{minAmount}
                                </p>
                            </div>
                        )}
                        {maxDiscount != null && (
                            <div className="border-b py-4">
                                <h2 className="font-semibold">
                                    Maximum Discount
                                </h2>
                                <p className="mt-1">
                                    ₹{maxDiscount}
                                </p>
                            </div>
                        )}
                        <div className="border-b py-4">
                            <h2 className="font-semibold">
                                How to Use
                            </h2>
                            <p className="mt-2">
                                Copy the coupon code, select your bus,
                                continue to Booking Summary and enter
                                the code in the Offers & Coupons section.
                                Apply it to check your discount before
                                proceeding to payment.
                            </p>
                        </div>
                        <div className="border-b py-4">
                            <h2 className="font-semibold">
                                Validity
                            </h2>
                            <p className="mt-1">
                                {expiryDate
                                    ? `Valid until ${new Date(
                                          expiryDate
                                      ).toLocaleDateString("en-IN")}`
                                    : "Expiry date is not available."}
                            </p>
                        </div>
                        {description && (
                            <div className="py-4">
                                <h2 className="font-semibold">
                                    Terms and Conditions
                                </h2>
                                <p className="mt-2">
                                    {description}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/home")}
                            className="border px-5 py-3 rounded-lg mt-4"
                        >
                            Book Your Bus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Offers;
