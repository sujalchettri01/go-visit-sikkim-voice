import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import accommodations from "../../data/hotel";
import ReCAPTCHA from "react-google-recaptcha";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const HotelBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = accommodations.find((h) => h.id === parseInt(id || "0"));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    numberOfGuests: 1,
    selectedRoom: "",
    specialRequests: "",
  });

  if (!hotel)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Hotel not found
      </div>
    );

  // Calculate number of nights (minimum 1)
  const nights = (() => {
    if (!formData.checkInDate || !formData.checkOutDate) return 1;
    const diff =
      new Date(formData.checkOutDate).getTime() -
      new Date(formData.checkInDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  })();

  const totalPrice = hotel.pricePerNight * nights;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfGuests" ? Number(value) : value,
    }));
  };

  const openRazorpay = (orderData: any) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "GoVisit Sikkim",
      description: `Hotel Booking - ${hotel.name}`,
      order_id: orderData.orderId,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.primaryPhone,
      },
      theme: { color: "#2563eb" },

      handler: async function (response: any) {
        try {
          const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              paymentRecordId: orderData.paymentRecordId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingType: "hotel",
              bookingData: {
                hotel_name: hotel.name,
                roomType: formData.selectedRoom || hotel.roomTypes[0],
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                nights,
                name: formData.name,
                email: formData.email,
                primaryPhone: formData.primaryPhone,
                secondaryPhone: formData.secondaryPhone || null,
                numberOfGuests: Number(formData.numberOfGuests),
                specialRequests: formData.specialRequests || null,
                totalCost: String(totalPrice),
              },
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success("Payment successful! Booking confirmed.");
            navigate(`/user/dashboard`);
          } else {
            toast.error(
              result.message ||
                "Payment verification failed. Please contact support."
            );
          }
        } catch {
          toast.error(
            "Something went wrong after payment. Please contact support."
          );
        }
      },

      modal: {
        ondismiss: () => toast.info("Payment cancelled."),
      },
    });

    razorpay.open();
  };

  const handleSubmit = async () => {
    // 1. reCAPTCHA check
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    // 2. Required fields
    if (
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // 3. Date validation
    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalCost: totalPrice,
          bookingType: "hotel",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create payment order.");
      }

      openRazorpay(data);
    } catch (error: any) {
      toast.error(`Booking failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <Link to="/accommodations" className="text-blue-600 font-semibold">
        ← Back to Accommodations
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ── LEFT: FORM ── */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-1">Book {hotel.name}</h2>
          <p className="text-gray-500 mb-6">
            Complete the form below to confirm your hotel booking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in */}
            <div>
              <label className="font-semibold text-sm">Check-in Date *</label>
              <input
                name="checkInDate"
                type="date"
                min={today}
                value={formData.checkInDate}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="font-semibold text-sm">Check-out Date *</label>
              <input
                name="checkOutDate"
                type="date"
                min={formData.checkInDate || today}
                value={formData.checkOutDate}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="font-semibold text-sm">Full Name *</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-sm">Email *</label>
              <input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Primary Phone */}
            <div>
              <label className="font-semibold text-sm">Primary Phone *</label>
              <input
                name="primaryPhone"
                placeholder="+91-XXXXXXXXXX"
                value={formData.primaryPhone}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="font-semibold text-sm">Secondary Phone</label>
              <input
                name="secondaryPhone"
                placeholder="+91-XXXXXXXXXX"
                value={formData.secondaryPhone}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="font-semibold text-sm">Room Type *</label>
              <select
                name="selectedRoom"
                value={formData.selectedRoom}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg bg-white"
              >
                <option value="">Select a room type</option>
                {hotel.roomTypes.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="font-semibold text-sm">Number of Guests *</label>
              <input
                name="numberOfGuests"
                type="number"
                min="1"
                max="10"
                value={formData.numberOfGuests}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="mt-4">
            <label className="font-semibold text-sm">Special Requests</label>
            <textarea
              name="specialRequests"
              rows={4}
              placeholder="Any special requirements (early check-in, extra bed, dietary needs, etc.)..."
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg"
            />
          </div>

          {/* Policies */}
          <div className="mt-5 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-gray-700">
              Hotel Policies
            </h4>
            <ul className="space-y-1">
              {hotel.policies.map((policy, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-blue-500">•</span> {policy}
                </li>
              ))}
              <li className="text-sm text-gray-600 flex gap-2">
                <span className="text-blue-500">•</span> Check-in:{" "}
                {hotel.checkIn} | Check-out: {hotel.checkOut}
              </li>
            </ul>
          </div>
          <div className="mb-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onError={() => toast.error("Failed to load reCAPTCHA")}
              />
            </div>
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h3 className="text-xl font-bold">{hotel.name}</h3>
          <p className="text-gray-500 text-sm">{hotel.type}</p>
          <p className="text-gray-400 text-sm">📍 {hotel.location}</p>

          {/* Amenities preview */}
          <div className="mt-3 flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 4).map((a, i) => (
              <span
                key={i}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
              >
                ✓ {a}
              </span>
            ))}
          </div>

          {/* Booking Summary */}
          <div className="mt-5 bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-bold">Booking Summary</h4>

            <div className="flex justify-between text-sm">
              <span>Hotel:</span>
              <b className="text-right max-w-[60%]">{hotel.name}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Room:</span>
              <b>{formData.selectedRoom || "Not selected"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Check-in:</span>
              <b>{formData.checkInDate || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Check-out:</span>
              <b>{formData.checkOutDate || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Nights:</span>
              <b>{nights}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Guests:</span>
              <b>{formData.numberOfGuests}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Price / Night:</span>
              <b>₹{hotel.pricePerNight.toLocaleString("en-IN")}</b>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg">
              <span>Total:</span>
              <b className="text-blue-600">
                ₹{totalPrice.toLocaleString("en-IN")}
              </b>
            </div>

            <p className="text-xs text-gray-400">
              + taxes & fees applicable at checkout
            </p>
            <p className="text-sm text-yellow-600">Status: Pending Payment</p>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Processing..." : "Pay & Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage; 