import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import packages from "../../data/package";
import ReCAPTCHA from "react-google-recaptcha";

declare global {
  interface Window { Razorpay: any; }
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function DestinationBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const pkg = packages.find((p: any) => String(p.id) === String(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    travelDate: "",
    pickupLocation: "",
    people: 1,
    specialRequests: "",
  });

  if (!pkg) return <div className="p-10 text-center">Package not found</div>;

  const pricingByPeople = pkg.pricingByPeople || {};
  const totalPrice =
    pricingByPeople[formData.people] ||
    pricingByPeople[String(formData.people)] ||
    pkg.price || 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  // ── Step 2: Open Razorpay + verify on success ──────────────────────────────
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
      description: `Tour Booking - ${pkg.title}`,
      order_id: orderData.orderId,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.primaryPhone,
      },
      theme: { color: "#2563eb" },

      // ── Called only after successful payment ────────────────────────────
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
              bookingType: "package",
              bookingData: {
                name: formData.name,
                email: formData.email,
                primary_phone: formData.primaryPhone,
                secondary_phone: formData.secondaryPhone || null,
                nationality: "Indian",
                pickup_location: formData.pickupLocation,
                datetime: formData.travelDate,
                number_of_people: Number(formData.people),
                special_requests: formData.specialRequests || null,
                package_name: pkg.title,
                base_price: totalPrice,
                total_price: totalPrice,
              },
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success("Payment successful! Tour booking confirmed.");
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

  // ── Step 1: Validate → Create order → Open Razorpay ──────────────────────
  const handleSubmit = async () => {
    // reCAPTCHA
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    // Required fields
    if (!formData.name || !formData.email || !formData.primaryPhone ||
        !formData.travelDate || !formData.pickupLocation) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Invalid package price.");
      return;
    }

    // Date must be in future
    if (new Date(formData.travelDate) <= new Date()) {
      toast.error("Travel date must be a future date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials : "include",
        body: JSON.stringify({
          totalCost: totalPrice,
          bookingType: "package",
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Link to={`/destinations/${pkg.id}`} className="text-blue-600 font-semibold">
        ← Back to Package
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* ── LEFT: FORM ── */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow order-2 lg:order-1">
          <h1 className="text-2xl font-bold">Book {pkg.title}</h1>
          <p className="text-slate-500 mt-1 mb-6">
            Complete the form below to confirm your tour booking
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
              <label className="font-semibold text-sm">Travel Date *</label>
              <input name="travelDate" type="date" min={today}
                value={formData.travelDate} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Pickup Location *</label>
              <input name="pickupLocation" placeholder="Enter pickup location"
                value={formData.pickupLocation} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg" />
            </div>

            <div>
              <label className="font-semibold text-sm">Number of People *</label>
              <select name="people" value={formData.people} onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg bg-white">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Person" : "People"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="font-semibold text-sm">Special Requests</label>
            <textarea name="specialRequests" rows={4}
              placeholder="Any special requirements..."
              value={formData.specialRequests} onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg" />
          </div>

          <div className="mt-5">
            <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey}
              onError={() => toast.error("Failed to load reCAPTCHA")} />
          </div>
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div className="bg-white p-5 rounded-xl shadow h-fit order-1 lg:order-2">
          <img src={pkg.image} alt={pkg.title}
            className="w-full h-40 sm:h-56 object-cover rounded-lg mb-4" />

          <h2 className="text-xl font-bold">{pkg.title}</h2>
          <p className="text-slate-500">{pkg.duration}</p>

          <div className="mt-5 bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-bold">Booking Summary</h3>

            <div className="flex justify-between text-sm">
              <span>Package Type:</span>
              <b>{pkg.type}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>People:</span>
              <b>{formData.people}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Travel Date:</span>
              <b>{formData.travelDate || "Not selected"}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Pickup:</span>
              <b>{formData.pickupLocation || "Not entered"}</b>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg">
              <span>Total:</span>
              <b className="text-blue-600">₹{Number(totalPrice).toLocaleString("en-IN")}</b>
            </div>

            <p className="text-sm text-gray-600">Price updates based on group size.</p>
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