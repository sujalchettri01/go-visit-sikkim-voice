import React, { useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import cabsData, { getStartingPrice } from "../../data/cabs";
import ReCAPTCHA from "react-google-recaptcha";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

type TripType = "ONE_WAY" | "TWO_WAY";

interface FormData {
  pickUpLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
  tripType: TripType;
  name: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  numberOfPeople: number;
  specialRequests: string;
}

export default function CabBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const cab = cabsData.find((c) => c.id === id);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const urlPrice = Number(searchParams.get("price"));

  const price = cab ? urlPrice || getStartingPrice(cab, from || "Gangtok") : 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState<FormData>({
    pickUpLocation: from,
    dropLocation: to,
    pickUpDate: date,
    pickUpTime: time,
    returnDate: "",
    returnTime: "",
    tripType: "ONE_WAY",
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    numberOfPeople: 1,
    specialRequests: "",
  });

  if (!cab) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-700">Cab not found</p>
          <Link to="/cabs" className="mt-4 inline-block text-blue-600 underline">
            Back to Cabs
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfPeople" ? Number(value) : value,
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
      name: "Go Visit Sikkim",
      description: `Cab Booking - ${cab.cab_name}`,
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
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              paymentRecordId: orderData.paymentRecordId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingType: "vehicle",
              bookingData: {
                cab_name: cab.cab_name,
                tripType: formData.tripType,
                pickUpLocation: formData.pickUpLocation,
                dropLocation: formData.dropLocation,
                pickUpDate: formData.pickUpDate,
                pickUpTime: formData.pickUpTime,
                returnDate:
                  formData.tripType === "TWO_WAY"
                    ? formData.returnDate
                    : null,
                returnTime:
                  formData.tripType === "TWO_WAY"
                    ? formData.returnTime
                    : null,
                name: formData.name,
                email: formData.email,
                primaryPhone: formData.primaryPhone,
                secondaryPhone: formData.secondaryPhone || null,
                numberOfPeople: Number(formData.numberOfPeople),
                totalCost: String(price),
                specialRequests: formData.specialRequests || null,
              },
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success("Payment successful! Booking confirmed.");
            navigate(
              `/user/dashboard`
            );
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
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.pickUpLocation ||
      !formData.dropLocation ||
      !formData.pickUpDate ||
      !formData.pickUpTime
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // 3. TWO_WAY requires return date/time
    if (formData.tripType === "TWO_WAY") {
      if (!formData.returnDate || !formData.returnTime) {
        toast.error("Please provide return date and time for a two-way trip.");
        return;
      }
      if (new Date(formData.returnDate) < new Date(formData.pickUpDate)) {
        toast.error("Return date must be after pickup date.");
        return;
      }
    }

    setIsSubmitting(true);

    try {

      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCost: price,
          bookingType: "vehicle",
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/cabs"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors mb-6"
        >
          ← Back to Cabs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Form ── */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm order-2 lg:order-1">
            <h1 className="text-2xl font-bold text-slate-800">
              Book {cab.cab_name}
            </h1>
            <p className="text-slate-500 mt-1 mb-6">
              Complete the form below to confirm your cab booking
            </p>

            {/* Trip Type */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Trip Type
              </label>
              <div className="flex gap-3">
                {(["ONE_WAY", "TWO_WAY"] as TripType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, tripType: type }))
                    }
                    className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                      formData.tripType === type
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {type === "ONE_WAY" ? "One Way" : "Two Way"}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Personal Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="primaryPhone"
                  placeholder="+91 98XXXXXXXX"
                  value={formData.primaryPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Secondary Phone
                </label>
                <input
                  name="secondaryPhone"
                  placeholder="+91 98XXXXXXXX"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Trip Details */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Trip Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="pickUpLocation"
                  placeholder="Hotel / Area name"
                  value={formData.pickUpLocation}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Drop Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="dropLocation"
                  placeholder="Destination"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Pickup Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="pickUpDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.pickUpDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Pickup Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="pickUpTime"
                  type="time"
                  value={formData.pickUpTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Return fields — only for TWO_WAY */}
              {formData.tripType === "TWO_WAY" && (
                <>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Return Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="returnDate"
                      type="date"
                      min={formData.pickUpDate || new Date().toISOString().split("T")[0]}
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Return Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="returnTime"
                      type="time"
                      value={formData.returnTime}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Number of People <span className="text-red-500">*</span>
                </label>
                {/* <input
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  max={cab.seats ?? 10}
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
              </div>
            </div>

            {/* Special Requests */}
            <div className="mb-5">
              <label className="block text-sm text-slate-600 mb-1">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                rows={3}
                placeholder="Any special requirements, stops, or notes..."
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* reCAPTCHA */}
            <div className="mb-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onError={() => toast.error("Failed to load reCAPTCHA")}
              />
            </div>
          </div>

          {/* ── Summary Sidebar ── */}
          <div className="bg-white p-5 rounded-2xl shadow-sm h-fit order-1 lg:order-2 lg:sticky lg:top-6">
            <img
              src={cab.image}
              alt={cab.cab_name}
              className="w-full h-44 object-contain rounded-xl mb-4 bg-slate-50"
            />

            <h2 className="text-xl font-bold text-slate-800">{cab.cab_name}</h2>
            <p className="text-slate-400 text-sm mb-4">{cab.company}</p>

            <div className="bg-blue-50 rounded-xl p-4 space-y-3 text-sm">
              <h3 className="font-bold text-slate-700">Booking Summary</h3>

              <div className="flex justify-between">
                <span className="text-slate-500">Cab</span>
                <span className="font-semibold">{cab.cab_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Trip Type</span>
                <span className="font-semibold">
                  {formData.tripType === "ONE_WAY" ? "One Way" : "Two Way"}
                </span>
              </div>

              {formData.pickUpLocation && formData.dropLocation && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Route</span>
                  <span className="font-semibold text-right">
                    {formData.pickUpLocation} → {formData.dropLocation}
                  </span>
                </div>
              )}

              {formData.pickUpDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold">{formData.pickUpDate}</span>
                </div>
              )}

              {formData.tripType === "TWO_WAY" && formData.returnDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Return</span>
                  <span className="font-semibold">{formData.returnDate}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">People</span>
                <span className="font-semibold">{formData.numberOfPeople}</span>
              </div>

              <div className="flex justify-between border-t border-blue-100 pt-3 text-base">
                <span className="font-bold text-slate-700">Total</span>
                <span className="font-bold text-blue-600 text-lg">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 rounded-lg px-3 py-2">
              <span>⏳</span>
              <span>Payment pending — complete the form to proceed</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Payment...
                </span>
              ) : (
                "Proceed to Pay ₹" + price.toLocaleString("en-IN")
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              🔒 Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}