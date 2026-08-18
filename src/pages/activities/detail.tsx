import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import activities from '../../data/activity';

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any | null>(null);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleBooking = () => navigate(`/activities/book/${id}`);

  const handleWhatsAppContact = () => {
    const phoneNumber = '917001103688';
    const message = encodeURIComponent(`Hi, I'm interested in ${activity?.name}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  useEffect(() => {
    if (!id) { setActivity(null); return; }
    const activityId = Number(id);
    if (Number.isNaN(activityId)) { setActivity(null); return; }
    const foundActivity = (activities as any[]).find((act) => Number(act.id) === activityId);
    setActivity(foundActivity ?? null);
  }, [id]);

  if (!activity) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-xl text-slate-500">
        <p>Activity not found.</p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Go back</button>
          <Link to="/activities" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">All activities</Link>
        </div>
      </div>
    );
  }

  const isTrek = activity.category === 'Trekking';

  const getDifficultyColor = (difficulty: string | undefined | null) => {
    if (!difficulty) return 'bg-gray-100 text-gray-700 border-gray-300';
    const d = difficulty.toLowerCase();
    if (d.includes('easy')) return 'bg-green-100 text-green-700 border-green-300';
    if (d.includes('moderate')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (d.includes('challenging')) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCategoryColor = (category: string | undefined | null) => {
    if (!category) return 'bg-gray-500';
    const colors: Record<string, string> = {
      Trekking: 'bg-green-600',
      'River Rafting': 'bg-blue-500',
      Cycling: 'bg-amber-500',
      'Upcoming Events': 'bg-purple-600',
      'Sports Events': 'bg-red-600',
      Adventure: 'bg-blue-500',
      Cultural: 'bg-purple-500',
      Wellness: 'bg-teal-500',
      Nature: 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabels = (category: string) => {
    const map: Record<string, { about: string; itinerary: string }> = {
      Trekking:          { about: 'About This Trek',     itinerary: 'Trek Itinerary'   },
      'River Rafting':   { about: 'About This Rafting',  itinerary: 'Rafting Routes'   },
      Cycling:           { about: 'About This Tour',     itinerary: 'Suggested Places' },
      'Upcoming Events': { about: 'About This Event',    itinerary: 'Event Schedule'   },
      'Sports Events':   { about: 'About This Event',    itinerary: 'Event Schedule'   },
    };
    return map[category] ?? { about: 'About This Experience', itinerary: 'Itinerary' };
  };

  const labels = getCategoryLabels(activity.category);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-end overflow-hidden"
        style={{ backgroundImage: `url('${activity.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`${getCategoryColor(activity.category)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
              {activity.category}
            </span>
            <span className={`${getDifficultyColor(activity.difficulty)} px-4 py-1 rounded-full text-sm font-semibold border`}>
              {activity.difficulty}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{activity.name}</h1>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md max-w-4xl">{activity.description}</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-2">Duration</div>
            <div className="text-2xl font-bold text-slate-800">{activity.duration}</div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-2">Best Season</div>
            <div className="text-2xl font-bold text-slate-800">{activity.bestSeason}</div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-2">Experience Level</div>
            <div className="text-xl font-bold text-slate-800">{activity.experienceLevel || activity.difficulty}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">{labels.about}</h2>
              <p className="text-lg leading-relaxed text-slate-600">{activity.longDescription || activity.description}</p>
            </div>

            {/* Highlights */}
            {activity.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.highlights.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">★</div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {activity.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">{labels.itinerary}</h2>
                <div className="space-y-5">
                  {activity.itinerary.map((item: any, idx: number) => {
                    const dayPhotos: string[] = isTrek ? (item.photos ?? []) : [];
                    const hasRoute = isTrek && item.origin && item.destination;

                    return (
                      <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {item.day > 0 ? `Day ${item.day}: ` : ''}{item.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-4">{item.details}</p>

                        {/* Photo strip — trekking only */}
                        {dayPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="col-span-2 h-40 rounded-lg overflow-hidden">
                              <img
                                src={dayPhotos[0]}
                                alt={`${item.title} - photo 1`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              {dayPhotos[1] && (
                                <div className="flex-1 rounded-lg overflow-hidden">
                                  <img
                                    src={dayPhotos[1]}
                                    alt={`${item.title} - photo 2`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {dayPhotos[2] && (
                                <div className="relative flex-1 rounded-lg overflow-hidden cursor-pointer group">
                                  <img
                                    src={dayPhotos[2]}
                                    alt={`${item.title} - photo 3`}
                                    className="w-full h-full object-cover"
                                  />
                                  {dayPhotos.length > 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-white text-sm font-semibold">
                                        +{dayPhotos.length - 3} photos
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Route map — trekking only */}
                        {hasRoute && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Route for today
                              </span>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                                  item.origin
                                )}&destination=${encodeURIComponent(
                                  item.destination
                                )}&travelmode=walking`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                              >
                                Open in Google Maps ↗
                              </a>
                            </div>

                            {mapsApiKey ? (
                              <div className="rounded-lg overflow-hidden border border-slate-200">
                                <iframe
                                  title={`Route from ${item.origin} to ${item.destination}`}
                                  width="100%"
                                  height="200"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  src={`https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${encodeURIComponent(
                                    item.origin
                                  )}&destination=${encodeURIComponent(
                                    item.destination
                                  )}&mode=walking`}
                                />
                              </div>
                            ) : (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                                  item.origin
                                )}&destination=${encodeURIComponent(
                                  item.destination
                                )}&travelmode=walking`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center h-[120px] rounded-lg border border-dashed border-slate-300 bg-white text-slate-500 text-sm hover:bg-slate-100 transition-colors"
                              >
                                {item.origin} → {item.destination} (tap to view route)
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {activity.features?.filter((f: string) => f).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Included Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.features.filter((f: string) => f).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What to Bring */}
            {activity.whatToBring?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">What to Bring</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activity.whatToBring.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
                      <span className="text-blue-500 mt-1 font-bold">→</span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents Required */}
            {activity.documentsRequired?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Documents Required</h2>
                <ul className="space-y-3">
                  {activity.documentsRequired.map((doc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                      <span className="text-purple-600 text-lg font-bold">•</span>
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation & Safety */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Preparation & Safety</h2>
              {activity.preparation && (
                <div className="border-l-4 border-blue-500 pl-4 py-2 mb-5">
                  <h3 className="font-bold text-slate-800 mb-1">Preparation</h3>
                  <p className="text-slate-600">{activity.preparation}</p>
                </div>
              )}
              {activity.safetyInfo && (
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h3 className="font-bold text-slate-800 mb-1">Safety Info</h3>
                  <p className="text-slate-600">{activity.safetyInfo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-4 border-2 border-blue-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Book This Experience</h3>
                <p className="text-slate-600">Secure your spot for an unforgettable adventure</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Duration</span>
                  <span className="text-slate-800 font-bold">{activity.duration}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Difficulty</span>
                  <span className={`${getDifficultyColor(activity.difficulty)} px-3 py-1 rounded-full text-sm font-semibold border`}>
                    {activity.difficulty}
                  </span>
                </div>
                {activity.experienceLevel && (
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Experience</span>
                    <span className="text-slate-800 font-bold text-right">{activity.experienceLevel}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Category</span>
                  <span className={`${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {activity.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Best Season</span>
                  <span className="text-slate-800 font-bold text-right">{activity.bestSeason}</span>
                </div>
              </div>
              <div className="space-y-3">
                {activity.actionLabel && (
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {activity.actionLabel}
                  </button>
                )}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  WhatsApp Inquiry
                </button>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Need Help?</h4>
                <p className="text-sm text-slate-600 mb-3">Contact our team for personalized assistance.</p>
                <p className="text-sm text-slate-600">Phone: <span className="font-semibold">+91 7001103688</span></p>
                <p className="text-sm text-slate-600">Email: <span className="font-semibold">govisitsikkim@gmail.com</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for an Adventure?</h2>
          <p className="text-xl text-white/90 mb-10">Join us for an unforgettable experience in the heart of the Himalayas</p>
          {activity.actionLabel && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleBooking}
                className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                {activity.actionLabel}
              </button>
            </div>
          )}
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-white font-semibold no-underline transition-all duration-200 hover:gap-4 text-lg group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to All Activities
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ActivityDetailPage;