import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import packages from "../../data/package";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import ReCAPTCHA from "react-google-recaptcha";

type Tour = any;

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface PackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: any;
}

type BookingPayload = {
  name: string;
  email: string;
  primary_phone: string;
  secondary_phone: string;
  nationality: string;
  pickup_location: string;
  datetime: string;
  number_of_people: number;
  special_requests: string;
  package_name: string;
  base_price: number;
  total_price: number;
};
function PackageBookingModal({
  isOpen,
  onClose,
  packageData,
}: PackageBookingModalProps) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  // const [recaptchatoken, setrecaptchatoken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primary_phone: "",
    secondary_phone: "",
    nationality: "",
    pickup_location: "",
    datetime: "",
    number_of_people: 1,
    special_requests: "",
  });

  // const bookingMutation = useMutation<any, Error, BookingPayload>({
  //   mutationFn: async (bookingData: BookingPayload) => {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BASE_URL || "http://localhost:4000"
  //       }/api/package-bookings`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(bookingData),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Booking failed");
  //     }

  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast.success("Booking confirmed successfully!", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //     setTimeout(() => {
  //       onClose();
  //       navigate("/");
  //     }, 1500);
  //   },
  //   onError: (error: any) => {
  //     toast.error(`Booking failed: ${error.message}`, {
  //       position: "top-right",
  //       autoClose: 4000,
  //     });
  //   },
  // });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== Form submission started ===");

    if (
      !formData.name ||
      !formData.email ||
      !formData.primary_phone ||
      !formData.nationality ||
      !formData.pickup_location ||
      !formData.datetime
    ) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Execute reCAPTCHA
      const token = await recaptchaRef.current?.getValue();

      console.log("reCAPTCHA token received:", token);

      if (!token) {
        console.error("Token is null or undefined");
        toast.error("Captcha verification failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        recaptchaRef.current?.reset();
        return;
      }

      console.log("Building booking payload...");

      const bookingPayload = {
        ...formData,
        number_of_people: Number(formData.number_of_people),
        package_name: packageData?.name || packageData?.title || "Tour Package",
        base_price: packageData?.price || 0,
        total_price:
          (packageData?.price || 0) * Number(formData.number_of_people),
        recaptchaToken: token,
      };

      console.log("Booking payload:", bookingPayload);
      console.log("Calling mutation...");

      // Call the mutation
      bookingMutation.mutate(bookingPayload);

      // Reset reCAPTCHA after submission
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error("=== Error in handleSubmit ===");
      console.error("Error details:", error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : "Unknown error",
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace",
      );

      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });

      recaptchaRef.current?.reset();
    }
  };

  // Also add logging to your mutation:
  const bookingMutation = useMutation<any, Error, BookingPayload>({
    mutationFn: async (bookingData: BookingPayload) => {
      console.log("=== Mutation function called ===");
      console.log("Sending data:", bookingData);

      const url = `${
        import.meta.env.VITE_BASE_URL || "http://localhost:4000"
      }/api/package-bookings`;
      console.log("POST URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Booking failed: ${errorText}`);
      }

      const result = await response.json();
      console.log("Success response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("=== onSuccess called ===");
      console.log("Success data:", data);

      toast.success("Booking confirmed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        console.log("Closing modal and navigating...");
        onClose();
        navigate("/");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("=== onError called ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);

      toast.error(`Booking failed: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

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
              Book Your Package
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Complete the form below to confirm your booking
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
                  htmlFor="primary_phone"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Primary Phone *
                </label>
                <input
                  id="primary_phone"
                  name="primary_phone"
                  type="tel"
                  required
                  value={formData.primary_phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="secondary_phone"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Secondary Phone
                </label>
                <input
                  id="secondary_phone"
                  name="secondary_phone"
                  type="tel"
                  value={formData.secondary_phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="nationality"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Nationality *
                </label>
                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  required
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Enter your nationality"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="number_of_people"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Number of People *
                </label>
                <input
                  id="number_of_people"
                  name="number_of_people"
                  type="number"
                  required
                  min="1"
                  value={formData.number_of_people}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="pickup_location"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Pickup Location *
                </label>
                <input
                  id="pickup_location"
                  name="pickup_location"
                  type="text"
                  required
                  value={formData.pickup_location}
                  onChange={handleInputChange}
                  placeholder="e.g., Hotel Taj, MG Road"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="datetime"
                  className="block text-xs font-semibold mb-2 text-slate-900"
                >
                  Pickup Date & Time *
                </label>
                <input
                  id="datetime"
                  name="datetime"
                  type="datetime-local"
                  required
                  value={formData.datetime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="special_requests"
                className="block text-xs font-semibold mb-2 text-slate-900"
              >
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                rows={3}
                value={formData.special_requests}
                onChange={handleInputChange}
                placeholder="Any special requirements or preferences..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none resize-y focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
              />
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Package:</span>
                <span className="text-sm font-bold text-slate-900">
                  {packageData?.name || packageData?.title}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Base Price:</span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹{packageData?.price || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">
                  Number of People:
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formData.number_of_people}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">
                  Total Price:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ₹
                  {(packageData?.price || 0) *
                    Number(formData.number_of_people)}
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
                disabled={bookingMutation.isPending}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3.5 py-3 text-sm font-semibold text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Confirm booking"
              >
                {bookingMutation.isPending ? "Booking..." : "Book Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const TourDetailPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const tourId = params.id ? Number(params.id) : null;

  const [tour, setTour] = useState<Tour | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const showNext = () =>
    setLightboxIndex((prev) => (prev! + 1) % tour.galleryImages.length);
  const showPrev = () =>
    setLightboxIndex(
      (prev) =>
        (prev! - 1 + tour.galleryImages.length) % tour.galleryImages.length,
    );

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex]);

  useEffect(() => {
    if (!tourId) return;
    const found = (packages as any[]).find(
      (t) => Number(t.id) === Number(tourId),
    );
    setTour(found ?? null);
  }, [tourId]);

  const handleBooking = () => {
    setIsModalOpen(true);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "1234567890";
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${tour?.title ?? tour?.name ?? ""}`,
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  if (!tour) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-xl text-slate-500">
        <p>Tour not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go back
        </button>
      </div>
    );
  }

  const title = tour.title ?? tour.name ?? "Untitled Tour";
  const heroImage = tour.heroImage ?? tour.image ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center overflow-hidden opacity-[0.95]"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.7) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        <div className="relative z-20 text-center text-white max-w-4xl px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md opacity-95">
            {tour.description}
          </p>
        </div>
      </div>

      {/* Tour Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tour.price > 0 && (
            <div className="bg-white rounded-xl shadow-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
                From
              </div>
              <div className="text-3xl font-bold text-slate-800">
                ₹ {tour.price}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Duration
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {tour.duration}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Tour Type
            </div>
            <div className="text-3xl font-bold text-slate-800">{tour.type}</div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Rating
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {tour.rating}/5 ({tour.reviewCount})
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <section className="py-8 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                About This Tour
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                {tour.description}
              </p>
            </div>

            {/* Inclusions, Exclusions, Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tour.inclusions && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b-2 border-slate-200">
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {tour.inclusions.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 font-bold mr-3 text-xl">
                          ✓
                        </span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.exclusions && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b-2 border-slate-200">
                    What's Not Included
                  </h3>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 font-bold mr-3 text-xl">
                          ✗
                        </span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.requirements && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b-2 border-slate-200">
                    What to Bring
                  </h3>
                  <ul className="space-y-3">
                    {tour.requirements.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 font-bold mr-3 text-xl">
                          →
                        </span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-4xl font-bold text-slate-800 mb-8">
                  Tour Plan
                </h2>
                <div className="space-y-8">
                  {tour.itinerary.map((item: any) => (
                    <div
                      key={item.day}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg"
                    >
                      <div className="flex items-start gap-4 mb-6">
                        {" "}
                        {/* ← items-start not items-center */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shrink-0 w-16 h-16 flex items-center justify-center sm:text-xl text-xs font-bold">
                          Day {item.day} {/* ← shrink-0 added */}
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-slate-800">
                          {item.title}
                        </h3>
                      </div>
                      <ul className="space-y-3 ml-20">
                        {item.activities.map((tour: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-3 mt-1">●</span>
                            <span className="text-slate-700">{tour}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {tour.amenities && tour.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-4xl font-bold text-slate-800 mb-8">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 gap-8">
                  {tour.amenities.filter((a: any) => a.included).length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                        <span className="text-3xl mr-2">✓</span> Included
                      </h3>
                      <ul className="space-y-4">
                        {tour.amenities
                          .filter((a: any) => a.included)
                          .map((amenity: any) => (
                            <li
                              key={amenity.id}
                              className="flex border-[1px] rounded-md p-2 border-gray-300 items-center"
                            >
                              <span className="text-green-500 text-2xl mr-3">
                                ✓
                              </span>
                              <span className="text-lg text-slate-700">
                                {amenity.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {tour.amenities.filter((a: any) => !a.included).length >
                    0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                        <span className="text-3xl mr-2">✗</span> Not Included
                      </h3>
                      <ul className="space-y-4">
                        {tour.amenities
                          .filter((a: any) => !a.included)
                          .map((amenity: any) => (
                            <li key={amenity.id} className="flex items-center">
                              <span className="text-red-500 text-2xl mr-3">
                                ✗
                              </span>
                              <span className="text-lg text-slate-700">
                                {amenity.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-4 border-2 border-blue-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Book This Tour
                </h3>
                <p className="text-slate-600">
                  Secure your spot for an unforgettable adventure
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-8">
                {tour.price > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Price</span>
                    <span className="text-slate-800 font-bold text-xl">
                      ₹{tour.price}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Duration</span>
                  <span className="text-slate-800 font-bold">
                    {tour.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Tour Type</span>
                  <span className="text-slate-800 font-bold">{tour.type}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Rating</span>
                  <span className="text-slate-800 font-bold">
                    {tour.rating}/5 ⭐
                  </span>
                </div>
              </div>

              {/* Booking Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Book Now
                </button>
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  WhatsApp Inquiry
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Need Help?</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Contact our team for personalized assistance with your booking
                  or any questions.
                </p>
                <p className="text-sm text-slate-600">
                  📞 <span className="font-semibold">+91 1234567890</span>
                </p>
                <p className="text-sm text-slate-600">
                  ✉️ <span className="font-semibold">info@sikkimtours.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {tour.galleryImages?.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">
            Gallery
          </p>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            {tour.name} in Sikkim
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {tour.galleryImages.map(
              (img: { src: string; alt: string }, i: number) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? "col-span-2 row-span-2" // hero: 2 cols, 2 rows tall
                      : i === 1
                        ? "col-span-1" // top right
                        : "col-span-1" // bottom row
                  }
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    onClick={() => openLightbox(i)}
                    className={`w-full object-cover rounded-xl cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-200 ${i === 0 ? "h-[370px]" : "h-[178px]"}`}
                  />
                </div>
              ),
            )}
          </div>

          <p className="text-sm text-slate-400 mt-3">
            {tour.galleryImages.length} photos
          </p>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-7 text-white text-4xl leading-none bg-transparent border-none cursor-pointer z-10"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-white/15 hover:bg-white/25 px-4 py-3 rounded-lg z-10"
          >
            ←
          </button>
          <img
            src={tour.galleryImages[lightboxIndex].src}
            alt={tour.galleryImages[lightboxIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-white/15 hover:bg-white/25 px-4 py-3 rounded-lg z-10"
          >
            →
          </button>
        </div>
      )}

      {/* FAQ */}
      {tour.faqs && tour.faqs.length > 0 && (
        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {tour.faqs.map((faq: any) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-slate-800 pr-4">
                      {faq.question}
                    </span>
                    <span className="text-3xl text-blue-600 font-bold flex-shrink-0">
                      {expandedFaq === faq.id ? "−" : "+"}
                    </span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-8 pb-6">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Book Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Contact us today to reserve your spot on this amazing tour
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBooking}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              Book Now
            </button>
            <button
              onClick={handleWhatsAppContact}
              className="bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              Contact via WhatsApp
            </button>
          </div>
        </div>
      </section>

      <PackageBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageData={tour}
      />
    </div>
  );
};

export default TourDetailPage;
