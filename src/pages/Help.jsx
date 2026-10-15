import React from "react";
import { Link } from "react-router-dom";
function Help() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600 mb-6">
          How can we help you?
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">
              Booking Help
            </h2>
            <p className="text-gray-600 mb-4">
              Need help with booking, seat selection or passenger details?
            </p>
            <Link
              to="/my-bookings"
              className="text-red-600 font-medium"
            >
              View My Bookings
            </Link>
          </div>
          <div className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">
              Cancellation & Refund
            </h2>
            <p className="text-gray-600 mb-4">
              Check your booking and cancellation details.
            </p>
            <Link
              to="/my-bookings"
              className="text-red-600 font-medium"
            >
              Check Booking
            </Link>
          </div>
          <div className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mb-4">
              Find answers to common questions.
            </p>
            <Link
              to="/faq"
              className="text-red-600 font-medium"
            >
              View FAQ
            </Link>
          </div>
          <div className="bg-white border rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">
              Contact Support
            </h2>
            <p className="text-gray-600 mb-4">
              Still need help? Contact our support team.
            </p>
            <Link
              to="/contact-support"
              className="text-red-600 font-medium"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Help;