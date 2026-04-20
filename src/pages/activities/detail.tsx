import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import activities from "../../data/activity";
import ActivityBookingModal from "./modal"; // Import the modal

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const showNext = () =>
    setLightboxIndex((prev) => (prev! + 1) % activity.galleryImages.length);
  const showPrev = () =>
    setLightboxIndex(
      (prev) =>
        (prev! - 1 + activity.galleryImages.length) %
        activity.galleryImages.length,
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
    if (!id) {
      setActivity(null);
      return;
    }
    const activityId = Number(id);
    if (Number.isNaN(activityId)) {
      setActivity(null);
      return;
    }

    const foundActivity = (activities as any[]).find(
      (act) => Number(act.id) === activityId,
    );
    setActivity(foundActivity ?? null);
  }, [id]);

  const handleBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "1234567890";
    const message = encodeURIComponent(
      `Hi, I'm interested in ${activity?.name}`,
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (!activity) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-xl text-slate-500">
        <p>Activity not found.</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go back
          </button>
          <Link
            to="/activities"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          >
            All activities
          </Link>
        </div>
      </div>
    );
  }

  type Difficulty = "Easy" | "Moderate" | "Challenging" | "Very Challenging";

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      Easy: "bg-green-100 text-green-700 border-green-300",
      Moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Challenging: "bg-orange-100 text-orange-700 border-orange-300",
      "Very Challenging": "bg-red-100 text-red-700 border-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  type Category = "Adventure" | "Cultural" | "Wellness" | "Nature";

  const getCategoryColor = (category: Category) => {
    const colors = {
      Adventure: "bg-blue-500",
      Cultural: "bg-purple-500",
      Wellness: "bg-teal-500",
      Nature: "bg-green-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-end overflow-hidden"
        style={{ backgroundImage: `url('${activity.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0"></div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`${getCategoryColor(activity.category)} text-white px-4 py-1 rounded-full text-sm font-semibold`}
            >
              {activity.category}
            </span>
            <span
              className={`${getDifficultyColor(activity.difficulty)} px-4 py-1 rounded-full text-sm font-semibold border`}
            >
              {activity.difficulty}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {activity.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md max-w-3xl">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⏱️</span>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                Duration
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {activity.duration}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌤️</span>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                Best Season
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {activity.bestSeason}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💪</span>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                Difficulty
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {activity.difficulty}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">ℹ️</span>
                About This Activity
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 mb-6">
                {activity.description}
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  What Makes This Special
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  This {activity.name.toLowerCase()} experience offers a unique
                  opportunity to explore the beauty of Sikkim in an
                  unforgettable way. Whether you're seeking adventure, cultural
                  immersion, or natural beauty, this activity provides an
                  authentic experience with professional guidance and safety
                  measures.
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">✨</span>
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activity.features ?? []).map(
                  (feature: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* What to Expect Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">📋</span>
                What to Expect
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-bold text-slate-800 mb-1">Preparation</h3>
                  <p className="text-slate-600">
                    Our team will brief you on safety protocols and provide
                    necessary equipment.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-bold text-slate-800 mb-1">Experience</h3>
                  <p className="text-slate-600">
                    Enjoy the activity with professional guides ensuring your
                    safety and enjoyment.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-bold text-slate-800 mb-1">Conclusion</h3>
                  <p className="text-slate-600">
                    Take home unforgettable memories and photos from your
                    adventure.
                  </p>
                </div>
              </div>
            </div>

            {/* What to Bring Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">🎒</span>
                What to Bring
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(activity.whatToBring ?? []).map(
                  (item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-4 border-2 border-blue-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Book This Experience
                </h3>
                <p className="text-slate-600">
                  Secure your spot for an unforgettable adventure
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Duration</span>
                  <span className="text-slate-800 font-bold">
                    {activity.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Difficulty</span>
                  <span
                    className={`${getDifficultyColor(activity.difficulty)} px-3 py-1 rounded-full text-sm font-semibold border`}
                  >
                    {activity.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Category</span>
                  <span
                    className={`${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {activity.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">
                    Best Season
                  </span>
                  <span className="text-slate-800 font-bold text-right">
                    {activity.bestSeason}
                  </span>
                </div>
              </div>

              {/* Booking Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {activity.actionLabel ?? "Book Now"}
                </button>
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
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
      {activity.galleryImages?.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">
            Gallery
          </p>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            {activity.name} in Sikkim
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {activity.galleryImages.map(
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
            {activity.galleryImages.length} photos
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
            src={activity.galleryImages[lightboxIndex].src}
            alt={activity.galleryImages[lightboxIndex].alt}
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

      {/* Safety & Guidelines Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
            Safety & Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Safety First
              </h3>
              <p className="text-slate-600">
                All activities are conducted with strict safety protocols and
                experienced guides.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Requirements
              </h3>
              <p className="text-slate-600">
                Please follow all guidelines and bring necessary documents and
                equipment.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4">⚕️</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Health Check
              </h3>
              <p className="text-slate-600">
                Ensure you're in good health and consult a doctor if you have
                medical conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for an Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join us for an unforgettable experience in the heart of the
            Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleBooking}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              {activity.actionLabel}
            </button>
          </div>
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-white font-semibold no-underline transition-all duration-200 hover:gap-4 text-lg group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to All Activities
          </Link>
        </div>
      </section>

      {/* Booking Modal */}
      <ActivityBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        activityName={activity.name}
      />
    </div>
  );
};

export default ActivityDetailPage;
