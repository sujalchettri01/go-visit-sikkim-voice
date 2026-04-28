import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import apiFetch from "../../wrapper/apiCall";

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelData: {
    name: string;
    pricePerNight: number;
    roomTypes?: string[];
  };
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

type BookingPayload = {
  hotel_name: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  roomType: string;
  name: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  totalCost: string;
  specialRequests?: string;
  status: string;
  recaptchaToken: string;
};

export default function HotelBookingModal({
  isOpen,
  onClose,
  hotelData,
}: HotelBookingModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    numberOfRooms: 1,
    specialRequests: "",
    roomType: hotelData.roomTypes?.[0] || "",
  });

  // Update room type when hotel data changes
  useEffect(() => {
    if (hotelData.roomTypes && hotelData.roomTypes.length > 0) {
      
      setFormData((prev) => ({
        ...prev,
        roomType: hotelData.roomTypes?.[0] || "",
      }));
    }
  }, [hotelData.roomTypes]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfGuests" || name === "numberOfRooms" 
        ? parseInt(value) || 1 
        : value,
    }));
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotalCost = () => {
    const nights = calculateNights();
    return (nights * hotelData.pricePerNight * formData.numberOfRooms).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.primaryPhone ||
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !formData.roomType
    ) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (calculateNights() <= 0) {
      toast.error("Check-out date must be after check-in date", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    const token = await recaptchaRef.current?.getValue();

    const bookingPayload: BookingPayload = {
      hotel_name: hotelData.name,
      checkInDate: new Date(formData.checkInDate).toISOString(),
      checkOutDate: new Date(formData.checkOutDate).toISOString(),
      numberOfGuests: formData.numberOfGuests,
      numberOfRooms: formData.numberOfRooms,
      roomType: formData.roomType,
      name: formData.name,
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      totalCost: calculateTotalCost(),
      specialRequests: formData.specialRequests,
      status: "PENDING",
      recaptchaToken: token || "",
    };

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:4000"}/accommodation-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!response || !response.ok) {
        throw new Error("Booking failed");
      }

      toast.success("Hotel booking confirmed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        primaryPhone: "",
        secondaryPhone: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        numberOfRooms: 1,
        specialRequests: "",
        roomType: hotelData.roomTypes?.[0] || "",
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

  const nights = calculateNights();
  const totalCost = calculateTotalCost();

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
              Book {hotelData.name}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Complete the form below to reserve your accommodation
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
                  htmlFor="checkInDate"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Check-in Date *
                </label>
                <input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  required
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="checkOutDate"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Check-out Date *
                </label>
                <input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  required
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  min={formData.checkInDate || new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="roomType"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Room Type *
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  required
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                >
                  {hotelData.roomTypes && hotelData.roomTypes.length > 0 ? (
                    hotelData.roomTypes.map((room, idx) => (
                      <option key={idx} value={room}>
                        {room}
                      </option>
                    ))
                  ) : (
                    <option value="Standard">Standard</option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="numberOfRooms"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Number of Rooms *
                </label>
                <input
                  id="numberOfRooms"
                  name="numberOfRooms"
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="numberOfGuests"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Number of Guests *
                </label>
                <input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={formData.numberOfGuests}
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
                id="specialRequests"
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements or preferences..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none resize-y focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
              />
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Hotel:</span>
                <span className="text-sm font-bold text-slate-900">
                  {hotelData.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Room Type:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formData.roomType}
                </span>
              </div>
              {nights > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">
                      ₹{hotelData.pricePerNight.toLocaleString()} × {nights} night(s) × {formData.numberOfRooms} room(s)
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{parseFloat(totalCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Total Cost:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{parseFloat(totalCost).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
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