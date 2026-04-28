import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import apiFetch from "../../wrapper/apiCall";

interface BikeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikeName: string;
  pricePerDay: number;
}


const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

type BookingPayload = {
  bike_name: string;
  bookingDate: string;
  bookingTime: string;
  name: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  numberOfPeople: number;
  totalCost: string;
  status: string;
  specialRequests: string;
  recaptchaToken: string;
};

export default function BikeBookingModal({
  isOpen,
  onClose,
  bikeName,
  pricePerDay,
}: BikeBookingModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    bike_name: bikeName,
    bookingDate: "",
    bookingTime: "",
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    numberOfPeople: 1,
    specialRequests: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfPeople" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.bookingDate ||
      !formData.bookingTime
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    const token = await recaptchaRef.current?.getValue();

    const bookingPayload: BookingPayload = {
      bike_name: bikeName,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      name: formData.name,
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      numberOfPeople: formData.numberOfPeople,
      totalCost: pricePerDay.toFixed(2),
      status: "PENDING",
      specialRequests: formData.specialRequests,
      recaptchaToken: token || "",
    };

    console.log(bookingPayload);

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:4000"}/bike-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!response || !response.ok) {
        throw new Error("Booking failed");
      }

      toast.success("Bike booking confirmed successfully!");

      // Reset form
      setFormData({
        bike_name: "",
        bookingDate: "",
        bookingTime: "",
        name: "",
        email: "",
        primaryPhone: "",
        secondaryPhone: "",
        numberOfPeople: 1,
        specialRequests: "",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(`Booking failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on ESC / click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onClick(e: MouseEvent) {
      if (!modalRef.current) return;
      if (modalRef.current.contains(e.target as Node)) return;
      onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" />
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6"
        >
          <header>
            <h2
              id="booking-title"
              className="text-2xl font-bold text-slate-900 leading-tight"
            >
              Book {bikeName}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Complete the form below to confirm your bike rental
            </p>
          </header>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Booking Date */}
              <div>
                <label
                  htmlFor="bookingDate"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Booking Date *
                </label>
                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  required
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Booking Time */}
              <div>
                <label
                  htmlFor="bookingTime"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Booking Time *
                </label>
                <input
                  id="bookingTime"
                  name="bookingTime"
                  type="time"
                  required
                  value={formData.bookingTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Primary Phone */}
              <div>
                <label
                  htmlFor="primaryPhone"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Primary Phone *
                </label>
                <input
                  id="primaryPhone"
                  name="primaryPhone"
                  type="tel"
                  required
                  value={formData.primaryPhone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Secondary Phone */}
              <div>
                <label
                  htmlFor="secondaryPhone"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Secondary Phone
                </label>
                <input
                  id="secondaryPhone"
                  name="secondaryPhone"
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Number of People */}
              <div>
                <label
                  htmlFor="numberOfPeople"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Number of Riders *
                </label>
                <input
                  id="numberOfPeople"
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  max="2"
                  required
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label
                htmlFor="specialRequests"
                className="block text-sm font-semibold mb-2 text-slate-900"
              >
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements (extra helmet, knee guards, etc.)..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none resize-y focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 space-y-3 border border-blue-100">
              <h3 className="font-bold text-slate-900 text-base">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Bike:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {bikeName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Riders:</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {formData.numberOfPeople}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-base font-bold text-slate-900">Price Per Day:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${pricePerDay.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Status:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    Pending Confirmation
                  </span>
                </div>
              </div>
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onLoad={() => {
                console.log("✅ reCAPTCHA loaded successfully");
                // setRecaptchaLoaded(true);
              }}
              onError={(error) => {
                console.error("❌ reCAPTCHA load error:", error);
                toast.error("Failed to load reCAPTCHA");
              }}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                aria-label="Cancel booking"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Confirm booking"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}