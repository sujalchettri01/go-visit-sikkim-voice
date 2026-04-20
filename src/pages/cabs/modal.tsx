import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

interface CabBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabName: string;
  pricePerDay: number;
}

type TripType = "ONE_WAY" | "TWO_WAY" | "ROUND_TRIP";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
console.log(siteKey);

type BookingPayload = {
  cab_name: string;
  tripType: TripType;
  pickUpLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
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

export default function CabBookingModal({
  isOpen,
  onClose,
  cabName,
  pricePerDay,
}: CabBookingModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    tripType: "ONE_WAY" as TripType,
    pickUpLocation: "",
    cab_name: cabName,
    dropLocation: "",
    pickUpDate: "",
    pickUpTime: "",
    returnDate: "",
    returnTime: "",
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    numberOfPeople: 1,
    specialRequests: "",
  });

  // Calculate total cost based on trip type and dates
  useEffect(() => {
    if (formData.pickUpDate && formData.tripType) {
      let cost = 0;
      
      if (formData.tripType === "ONE_WAY") {
        cost = pricePerDay;
      } else if (formData.tripType === "TWO_WAY" || formData.tripType === "ROUND_TRIP") {
        if (formData.returnDate && formData.pickUpDate) {
          const pickUp = new Date(formData.pickUpDate);
          const returnD = new Date(formData.returnDate);
          const days = Math.ceil((returnD.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24));
          cost = days > 0 ? days * pricePerDay : pricePerDay;
        } else {
          cost = pricePerDay * 2; // Default 2 days for round trip
        }
      }
      
      setTotalCost(cost);
    }
  }, [formData.pickUpDate, formData.returnDate, formData.tripType, pricePerDay]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      !formData.pickUpLocation ||
      !formData.dropLocation ||
      !formData.pickUpDate ||
      !formData.pickUpTime
    ) {
      alert("Please fill all required fields");
      return;
    }

    if ((formData.tripType === "TWO_WAY" || formData.tripType === "ROUND_TRIP") && 
        (!formData.returnDate || !formData.returnTime)) {
      alert("Please provide return date and time for two-way/round trip");
      return;
    }

    setIsSubmitting(true);

    const token = await recaptchaRef.current?.getValue();
    console.log(token);
    
    const bookingPayload: BookingPayload = {
      cab_name: cabName,
      tripType: formData.tripType,
      pickUpLocation: formData.pickUpLocation,
      dropLocation: formData.dropLocation,
      pickUpDate: formData.pickUpDate,
      pickUpTime: formData.pickUpTime,
      returnDate: formData.returnDate || formData.pickUpDate,
      returnTime: formData.returnTime || formData.pickUpTime,
      name: formData.name,
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      numberOfPeople: formData.numberOfPeople,
      totalCost: totalCost.toFixed(2),
      status: "PENDING",
      specialRequests: formData.specialRequests,
      recaptchaToken: token || "",
    };

    console.log(bookingPayload);
    

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:4000"}/api/vehicle-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      toast.success("Booking confirmed successfully!");

      // Reset form
      setFormData({
        tripType: "ONE_WAY",
        pickUpLocation: "",
        cab_name: "",
        dropLocation: "",
        pickUpDate: "",
        pickUpTime: "",
        returnDate: "",
        returnTime: "",
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
              Book {cabName}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Complete the form below to confirm your cab booking
            </p>
          </header>

          <div className="mt-5 space-y-4">
            {/* Trip Type */}
            <div>
              <label
                htmlFor="tripType"
                className="block text-sm font-semibold mb-2 text-slate-900"
              >
                Trip Type *
              </label>
              <select
                id="tripType"
                name="tripType"
                value={formData.tripType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
              >
                <option value="ONE_WAY">One Way</option>
                <option value="TWO_WAY">Two Way</option>
                <option value="ROUND_TRIP">Round Trip</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pick Up Location */}
              <div>
                <label
                  htmlFor="pickUpLocation"
                  className="block text-sm font-semibold mb-2 text-slate-900"
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
                  placeholder="e.g., MG Marg, Gangtok"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Drop Location */}
              <div>
                <label
                  htmlFor="dropLocation"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Drop Location *
                </label>
                <input
                  id="dropLocation"
                  name="dropLocation"
                  type="text"
                  required
                  value={formData.dropLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Pelling, Sikkim"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Pick Up Date */}
              <div>
                <label
                  htmlFor="pickUpDate"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Pick Up Date *
                </label>
                <input
                  id="pickUpDate"
                  name="pickUpDate"
                  type="date"
                  required
                  value={formData.pickUpDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Pick Up Time */}
              <div>
                <label
                  htmlFor="pickUpTime"
                  className="block text-sm font-semibold mb-2 text-slate-900"
                >
                  Pick Up Time *
                </label>
                <input
                  id="pickUpTime"
                  name="pickUpTime"
                  type="time"
                  required
                  value={formData.pickUpTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                />
              </div>

              {/* Return Date (for TWO_WAY/ROUND_TRIP) */}
              {(formData.tripType === "TWO_WAY" || formData.tripType === "ROUND_TRIP") && (
                <>
                  <div>
                    <label
                      htmlFor="returnDate"
                      className="block text-sm font-semibold mb-2 text-slate-900"
                    >
                      Return Date *
                    </label>
                    <input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      required
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="returnTime"
                      className="block text-sm font-semibold mb-2 text-slate-900"
                    >
                      Return Time *
                    </label>
                    <input
                      id="returnTime"
                      name="returnTime"
                      type="time"
                      required
                      value={formData.returnTime}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                    />
                  </div>
                </>
              )}

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
                  Number of People *
                </label>
                <input
                  id="numberOfPeople"
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  max="10"
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
                placeholder="Any special requirements (luggage, child seat, etc.)..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none resize-y focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 space-y-3 border border-blue-100">
              <h3 className="font-bold text-slate-900 text-base">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Vehicle:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {cabName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Trip Type:</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {formData.tripType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Passengers:</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {formData.numberOfPeople}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-base font-bold text-slate-900">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{totalCost.toFixed(2)}
                  </span>
                </div> */}
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