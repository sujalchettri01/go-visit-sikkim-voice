import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import bikesData from "../../data/bikes";

const PICKUP_LOCATIONS = ["Gangtok", "Majhitar", "Singtam", "Namchi"];

declare global {
  interface Window { Razorpay: any; }
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function BikeBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const bike = bikesData.find((b: any) => String(b.id) === String(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",           // ← bookingTime for model
    pickupLocation: "",
    numberOfBikes: 1,
    specialRequests: "",
  });

  if (!bike) return <div className="p-10 text-center">Bike not found</div>;

  // ── Derived values ──────────────────────────────────────────────────────────
  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const diff =
      new Date(formData.returnDate).getTime() -
      new Date(formData.pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const rentalDays = calculateDays();
  const totalPrice = rentalDays * Number(bike.pricePerDay) * Number(formData.numberOfBikes || 1);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfBikes" ? Number(value) : value,
    }));
  };

  // ── Step 2: Open Razorpay → on success call /payments/verify ───────────────
  const openRazorpay = (orderData: any) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Go Visit Sikkim",
      description: `Bike Rental - ${bike.bike_name}`,
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
              bookingType: "bike",
              bookingData: {
                // ── Fields that map exactly to BikeBooking model ──
                bike_name: bike.bike_name,
                name: formData.name,
                email: formData.email,
                primaryPhone: formData.primaryPhone,
                secondaryPhone: formData.secondaryPhone || null,
                bookingDate: formData.pickupDate,      // → bookingDate (DATE)
                bookingTime: formData.pickupTime,      // → bookingTime (TIME)
                numberOfPeople: Number(formData.numberOfBikes), // → numberOfPeople
                totalCost: String(totalPrice),         // → totalCost (DECIMAL)
                specialRequests: formData.specialRequests || null,
                // ── Extra context (not in model but useful for admin) ──
                pickup_location: formData.pickupLocation,
                return_date: formData.returnDate,
                rental_days: rentalDays,
                company: bike.company,
              },
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success("Payment successful! Bike booking confirmed.");
            navigate(`/user/dashboard`);
          } else {
            toast.error(result.message || "Payment verification failed. Please contact support.");
          }
        } catch {
          toast.error("Something went wrong after payment. Please contact support.");
        }
      },

      modal: {
        ondismiss: () => toast.info("Payment cancelled."),
      },
    });

    razorpay.open();
  };

  // ── Step 1: Validate → create Razorpay order ───────────────────────────────
  const handleSubmit = async () => {
    // reCAPTCHA
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    // Required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.pickupDate ||
      !formData.returnDate ||
      !formData.pickupTime ||
      !formData.pickupLocation
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Date validation
    if (rentalDays <= 0) {
      toast.error("Return date must be after pickup date.");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Invalid bike price.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          totalCost: totalPrice,
          bookingType: "bike",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to create payment order.");

      openRazorpay(data);
    } catch (error: any) {
      toast.error(`Booking failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Link to="/bikes" className="text-blue-600 font-semibold">
        ← Back to Bikes
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* ── LEFT: FORM ── */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow order-2 lg:order-1">
          <h1 className="text-2xl font-bold">Book {bike.bike_name}</h1>
          <p className="text-slate-500 mt-1 mb-6">
            Complete the form below to confirm your bike rental
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Full Name *</label>
              <input name="name" placeholder="Enter your full name"
                value={formData.name} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Email *</label>
              <input name="email" type="email" placeholder="your.email@example.com"
                value={formData.email} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Primary Phone *</label>
              <input name="primaryPhone" placeholder="+91-XXXXXXXXXX"
                value={formData.primaryPhone} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Secondary Phone</label>
              <input name="secondaryPhone" placeholder="+91-XXXXXXXXXX"
                value={formData.secondaryPhone} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Pickup Date *</label>
              <input name="pickupDate" type="date" min={today}
                value={formData.pickupDate} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Return Date *</label>
              <input name="returnDate" type="date"
                min={formData.pickupDate || today}
                value={formData.returnDate} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            {/* ← NEW: pickupTime maps to model's bookingTime */}
            <div>
              <label className="font-semibold text-sm">Pickup Time *</label>
              <input name="pickupTime" type="time"
                value={formData.pickupTime} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

           <div>
              <label className="font-semibold text-sm">Pickup Location *</label>
              <select name="pickupLocation"
                value={formData.pickupLocation} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg bg-white">
                <option value="">Select a pickup location</option>
                {PICKUP_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-sm">Number of Bikes *</label>
              <input name="numberOfBikes" type="number" min="1" max="10"
                value={formData.numberOfBikes} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>
          </div>

          <div className="mt-4">
            <label className="font-semibold text-sm">Special Requests</label>
            <textarea name="specialRequests" rows={4}
              placeholder="Any special requirements (helmet size, luggage rack, etc.)..."
              value={formData.specialRequests} onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg" />
          </div>

                {/* Bike specs info box (disabled) */}

          <div className="mt-5">
            <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey}
              onError={() => toast.error("Failed to load reCAPTCHA")} />
          </div>
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div className="bg-white p-5 rounded-xl shadow h-fit order-1 lg:order-2">
          <img src={bike.image} alt={bike.bike_name}
            className="w-full h-40 sm:h-56 object-cover rounded-lg mb-4" />

          <h2 className="text-xl font-bold">{bike.bike_name}</h2>
          <p className="text-slate-500 text-sm">{bike.company}</p>
          <p className="text-slate-400 text-sm">📍 {bike.city}</p>

          <div className="mt-5 bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-bold">Booking Summary</h3>

            <div className="flex justify-between text-sm">
              <span>Pickup Date:</span>
              <b>{formData.pickupDate || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Return Date:</span>
              <b>{formData.returnDate || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Pickup Time:</span>
              <b>{formData.pickupTime || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Rental Days:</span>
              <b>{rentalDays > 0 ? `${rentalDays} day${rentalDays > 1 ? "s" : ""}` : "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>No. of Bikes:</span>
              <b>{formData.numberOfBikes}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Price/day:</span>
              <b>₹{Number(bike.pricePerDay).toLocaleString("en-IN")}</b>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg">
              <span>Total:</span>
              <b className="text-blue-600">
                ₹{totalPrice > 0 ? totalPrice.toLocaleString("en-IN") : "0"}
              </b>
            </div>

            <p className="text-xs text-gray-400">
              ₹{bike.pricePerDay} × {rentalDays} day{rentalDays !== 1 ? "s" : ""} × {formData.numberOfBikes} bike{formData.numberOfBikes !== 1 ? "s" : ""}
            </p>

            <p className="text-sm text-yellow-600">Status: Pending Payment</p>

            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-semibold disabled:opacity-60">
              {isSubmitting ? "Creating Payment..." : "Pay & Confirm Booking"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}