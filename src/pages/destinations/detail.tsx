import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import packages from "../../data/package";

type Tour = any;

const TourDetailPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const tourId = params.id ? Number(params.id) : null;

  const [tour, setTour] = useState<Tour | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [numPeople, setNumPeople] = useState(7);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!tourId) return;

    const found = (packages as any[]).find(
      (t) => Number(t.id) === Number(tourId)
    );

    setTour(found ?? null);
    window.scrollTo(0, 0);
  }, [tourId]);

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
  const images = tour.images?.length ? tour.images : [heroImage];

  const pricingKeys = Object.keys(tour.pricingByPeople || {});
  const maxPeople = pricingKeys.length || 6;

  const computedPrice =
    tour?.pricingByPeople?.[numPeople] ??
    tour?.pricingByPeople?.[String(numPeople)] ??
    null;

  const startingPrice = (() => {
    const prices = Object.values(tour.pricingByPeople || {}) as number[];
    return prices.length ? Math.min(...prices) : Number(tour.price || 0);
  })();

  const handleBooking = () => {
    navigate(`/destinations/book/${tour.id}`);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "1234567890";
    const message = encodeURIComponent(`Hi, I'm interested in the ${title}`);

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

          <button
            onClick={handleBooking}
            className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-100 transition"
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {startingPrice > 0 && (
            <div className="bg-white rounded-xl shadow-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
                Starting From
              </div>
              <div className="text-3xl font-bold text-slate-800">
                ₹{startingPrice.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Duration
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {tour.duration}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Tour Type
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {tour.type}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
              Rating
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {tour.rating}/5 ({tour.reviewCount})
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                About This Tour
              </h2>

              <p className="text-lg leading-relaxed text-slate-600">
                {tour.description}
              </p>
            </div>

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
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                          Day {item.day}
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800">
                          {item.title}
                        </h3>
                      </div>

                      <ul className="space-y-3 ml-20">
                        {item.activities.map(
                          (activity: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-3 mt-1">
                                ●
                              </span>
                              <span className="text-slate-700">
                                {activity}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {tour.pricingByPeople && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-4xl font-bold text-slate-800 mb-2">
                  Total Rate of Package
                </h2>

                <p className="text-slate-500 mb-6">
                  Note: Price updates based on your group size. Since the
                  vehicle is reserved the vehicle cost remains the same, but the
                  total price may vary slightly because hotel rooms, meals,
                  lunch, and dinner arrangements change depending on the number
                  of people.
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setNumPeople((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    −
                  </button>

                  <span className="text-3xl font-bold text-slate-800 w-8 text-center">
                    {numPeople}
                  </span>

                  <button
                    onClick={() =>
                      setNumPeople((p) => Math.min(maxPeople, p + 1))
                    }
                    className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    +
                  </button>

                  <span className="text-slate-500 text-sm ml-2">people</span>
                </div>

                {computedPrice ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 flex justify-between items-center border border-blue-100">
                    <span className="text-slate-600 font-medium">
                      Total for {numPeople}{" "}
                      {numPeople === 1 ? "person" : "people"}
                    </span>

                    <span className="text-2xl font-bold text-blue-600">
                      ₹{computedPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-xl p-4 text-yellow-700 text-sm border border-yellow-200">
                    Pricing for {numPeople} people not available. Please
                    contact us.
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Book This Package
                </button>
              </div>
            )}
          </div>

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

              <div className="space-y-4 mb-8">
                {startingPrice > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">
                      Starting Price
                    </span>

                    <span className="text-slate-800 font-bold text-xl">
                      ₹{startingPrice.toLocaleString("en-IN")}
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

              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Book Now
                </button>

                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  WhatsApp Inquiry
                </button>
              </div>

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
                  ✉️{" "}
                  <span className="font-semibold">info@sikkimtours.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {images && images.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">
            Photo Gallery
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 h-64">
              {images[0] && (
                <div
                  className="relative flex-[2] rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                  onClick={() => setGalleryIndex(0)}
                >
                  <img
                    src={images[0]}
                    alt="Gallery 1"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              <div className="flex flex-col gap-2 flex-1">
                {images[1] && (
                  <div
                    className="relative flex-1 rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                    onClick={() => setGalleryIndex(1)}
                  >
                    <img
                      src={images[1]}
                      alt="Gallery 2"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {images[2] && (
                  <div
                    className="relative flex-1 rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                    onClick={() => setGalleryIndex(2)}
                  >
                    <img
                      src={images[2]}
                      alt="Gallery 3"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 h-44">
              {images.slice(3, 6).map((img: string, idx: number) => {
                const realIndex = idx + 3;
                const isLastVisibleImage = realIndex === 5;

                return (
                  <div
                    key={realIndex}
                    className="relative flex-1 rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                    onClick={() => {
                      if (isLastVisibleImage) {
                        navigate(`/gallery/destination/${tour.id}`);
                      } else {
                        setGalleryIndex(realIndex);
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${realIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {isLastVisibleImage ? (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          See More Photos
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-slate-500 text-sm mt-1">
              {images.length} photos
            </p>
          </div>
        </section>
      )}

      {galleryIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4"
          onClick={() => setGalleryIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold"
            onClick={() => setGalleryIndex(null)}
          >
            ×
          </button>

          <button
            className="absolute left-4 text-white text-5xl font-bold px-4"
            onClick={(e) => {
              e.stopPropagation();
              setGalleryIndex((i) => (i! > 0 ? i! - 1 : images.length - 1));
            }}
          >
            ‹
          </button>

          <img
            src={images[galleryIndex]}
            alt="Gallery full view"
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 text-white text-5xl font-bold px-4"
            onClick={(e) => {
              e.stopPropagation();
              setGalleryIndex((i) => (i! < images.length - 1 ? i! + 1 : 0));
            }}
          >
            ›
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {galleryIndex + 1} / {images.length}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default TourDetailPage;