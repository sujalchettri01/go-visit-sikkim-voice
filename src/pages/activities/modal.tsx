import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import apiFetch from "../../wrapper/apiCall";

interface ActivityBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

type BookingPayload = {
  activity_name: string;
  startDate: string;
  pickUpLocation: string;
  name: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  status: string;
  moreDetails: string;
  recaptchaToken: string;
};

export default function ActivityBookingModal({
  isOpen,
  onClose,
  activityName,
}: ActivityBookingModalProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    pickUpLocation: "",
    startDate: "",
    moreDetails: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.pickUpLocation ||
      !formData.startDate
    ) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    const token = await recaptchaRef.current?.getValue();

    const bookingPayload: BookingPayload = {
      activity_name: activityName,
      startDate: new Date(formData.startDate).toISOString(),
      pickUpLocation: formData.pickUpLocation,
      name: formData.name,
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      status: "PENDING",
      moreDetails: formData.moreDetails,
      recaptchaToken: token || "",
    };

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:4000"}/api/activity-bookings`,
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

      toast.success("Booking confirmed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        primaryPhone: "",
        secondaryPhone: "",
        pickUpLocation: "",
        startDate: "",
        moreDetails: "",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(`Booking failed: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
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
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-5"
        >
          <header>
            <h2
              id="booking-title"
              className="text-xl font-bold text-slate-900 leading-tight"
            >
              Book {activityName}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Complete the form below to confirm your activity booking
            </p>
          </header>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold mb-2 text-slate-900"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold mb-2 text-slate-900"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="primaryPhone"
                  className="block text-xs font-semibold mb-2 text-slate-900"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="secondaryPhone"
                  className="block text-xs font-semibold mb-2 text-slate-900"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="pickUpLocation"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Pick Up Location *
                </label>
                <input
                  id="pickUpLocation"
                  name="pickUpLocation"
                  type="text"
                  required
                  value={formData.pickUpLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Hotel Grand Plaza, Downtown"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Start Date & Time *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="moreDetails"
                className="block text-xs font-semibold mb-2 text-slate-900"
              >
                Additional Details
              </label>
              <textarea
                id="moreDetails"
                name="moreDetails"
                rows={3}
                value={formData.moreDetails}
                onChange={handleInputChange}
                placeholder="Any special requirements or preferences..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none resize-y focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
              />
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Activity:</span>
                <span className="text-sm font-bold text-slate-900">
                  {activityName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Status:</span>
                <span className="text-sm font-semibold text-yellow-600">
                  Pending Confirmation
                </span>
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                aria-label="Cancel booking"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3.5 py-3 text-sm font-semibold text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Confirm booking"
              >
                {isSubmitting ? "Booking..." : "Book Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}