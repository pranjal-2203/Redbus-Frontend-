import { useState } from "react";
import { useNavigate } from "react-router-dom";
function FAQ() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(null);
    const faqs = [
        {
            question: "How can I book a bus ticket?",
            answer: "Enter your source, destination and travel date. Select a bus, choose your seat and complete the booking."
        },
        {
            question: "Can I select my seat?",
            answer: "Yes, you can select an available seat before continuing with the booking."
        },
        {
            question: "Can I cancel my booking?",
            answer: "Yes, you can cancel your booking from the My Bookings section."
        },
        {
            question: "Where can I see my booking?",
            answer: "After login, you can view your bookings from the My Bookings section."
        },
        {
            question: "Can I choose boarding and dropping points?",
            answer: "Yes, available boarding and dropping points can be selected during the booking process."
        },
        {
            question: "What if I have a problem with my booking?",
            answer: "You can contact support through the Contact Support section."
        }
    ];
    return (
        <div className="p-6">
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
            <h2 className="text-2xl font-bold mb-6">
                Frequently Asked Questions
            </h2>
            <div className="max-w-2xl">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-300 py-4"
                    >
                        <button
                            onClick={() =>
                                setOpen(open === index ? null : index)
                            }
                            className="w-full text-left font-semibold"
                        >
                            {faq.question}
                        </button>
                        {open === index && (
                            <p className="mt-3 text-gray-600">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default FAQ;

