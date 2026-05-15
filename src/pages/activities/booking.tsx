import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import activities from "../../data/activity";

declare global {
  interface Window { Razorpay: any; }
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function ActivityBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const activity = activities.find((a) => a.id === Number(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    date: "",
    numberOfPeople: 1,
    nationality: "",
    pickUpLocation: "",      // ← maps to model's pickUpLocation
    specialRequests: "",     // ← maps to model's moreDetails
  });

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Activity not found
      </div>
    );
  }

  // Price calculation — if your activity data has a price per person
  const pricePerPerson = activity.price || 0;
  const totalPrice = pricePerPerson * formData.numberOfPeople;

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfPeople" ? Number(value) : value,
    }));
  };

  // ── Step 2: Razorpay → verify ──────────────────────────────────────────────
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
      description: `Activity Booking - ${activity.name}`,
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
              bookingType: "activity",
              bookingData: {
                // ── Exact model field names ──────────────────────────
                activity_name: activity.name,
                startDate: formData.date,           // → start_date
                pickUpLocation: formData.pickUpLocation, // → pick_up_location
                name: formData.name,
                email: formData.email,
                primaryPhone: formData.primaryPhone,  // → primary_phone
                secondaryPhone: formData.secondaryPhone || null,
                nationality: formData.nationality || null,
                numberOfPeople: Number(formData.numberOfPeople),
                totalCost: String(totalPrice),
                moreDetails: formData.specialRequests || null, // → more_details
              },
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success("Payment successful! Activity booking confirmed.");
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

  // ── Step 1: Validate → create order ───────────────────────────────────────
  const handleSubmit = async () => {
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.date ||
      !formData.nationality ||
      !formData.pickUpLocation
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (new Date(formData.date) <= new Date()) {
      toast.error("Please select a future date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalCost: totalPrice || 1,  // fallback to 1 if activity is free
          bookingType: "activity",
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
      <Link to="/activities" className="text-blue-600 font-semibold">
        ← Back to Activities
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* ── LEFT: FORM ── */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow order-2 lg:order-1">
          <h1 className="text-2xl font-bold">Book {activity.name}</h1>
          <p className="text-slate-500 mt-1 mb-6">
            Complete the form below to confirm your activity booking
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
              <label className="font-semibold text-sm">Nationality *</label>
              <input name="nationality" placeholder="e.g. Indian"
                value={formData.nationality} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Number of People *</label>
              <input name="numberOfPeople" type="number" min="1" max="20"
                value={formData.numberOfPeople} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Preferred Start Date *</label>
              <input name="date" type="date" min={today}
                value={formData.date} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            {/* pickUpLocation maps directly to model's pickUpLocation */}
            <div>
              <label className="font-semibold text-sm">Pickup Location *</label>
              <input name="pickUpLocation" placeholder="Enter pickup location"
                value={formData.pickUpLocation} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>
          </div>

          {/* specialRequests → moreDetails in model */}
          <div className="mt-4">
            <label className="font-semibold text-sm">Special Requests / More Details</label>
            <textarea name="specialRequests" rows={4}
              placeholder="Any special requirements or questions about the activity..."
              value={formData.specialRequests} onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg" />
          </div>

          {/* Activity info box */}
          <div className="mt-5 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-gray-700">Activity Info</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Duration: {activity.duration}</li>
              <li>• Difficulty: {activity.difficulty}</li>
              <li>• Best Season: {activity.bestSeason}</li>
              {activity.minAge && <li>• Minimum Age: {activity.minAge} years</li>}
              {activity.includes && <li>• Includes: {activity.includes}</li>}
            </ul>
          </div>

          <div className="mt-5">
            <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey}
              onError={() => toast.error("Failed to load reCAPTCHA")} />
          </div>
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div className="bg-white p-5 rounded-xl shadow h-fit order-1 lg:order-2">
          <img src={activity.image} alt={activity.name}
            className="w-full h-48 object-cover rounded-lg mb-4" />

          <h2 className="text-xl font-bold">{activity.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{activity.category}</p>

          <div className="mt-5 bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-bold">Booking Summary</h3>

            <div className="flex justify-between text-sm">
              <span>Duration:</span>
              <b>{activity.duration}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Difficulty:</span>
              <b>{activity.difficulty}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Best Season:</span>
              <b>{activity.bestSeason}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>People:</span>
              <b>{formData.numberOfPeople}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <b>{formData.date || "—"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Pickup:</span>
              <b>{formData.pickUpLocation || "—"}</b>
            </div>

            {pricePerPerson > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Price/person:</span>
                  <b>₹{pricePerPerson.toLocaleString("en-IN")}</b>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg">
                  <span>Total:</span>
                  <b className="text-blue-600">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </b>
                </div>
                <p className="text-xs text-gray-400">
                  ₹{pricePerPerson} × {formData.numberOfPeople} {formData.numberOfPeople === 1 ? "person" : "people"}
                </p>
              </>
            )}

            <p className="text-sm text-yellow-600 pt-2 border-t">
              Status: Pending Payment
            </p>

            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-semibold disabled:opacity-60">
              {isSubmitting ? "Processing..." : "Pay & Confirm Booking"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}