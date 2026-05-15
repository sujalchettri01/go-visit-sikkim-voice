import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import accommodations from "../../data/hotel";
import HotelBookingModal from "./modal";

const roomDetails: any = {
  "Deluxe Room": {
    desc: "Comfortable stay with modern amenities and scenic views.",
    includes: ["Free Cancellation", "Breakfast Included", "Free Wi-Fi", "King Size Bed", "24x7 Room Service"],
  },
  "Premium Suite": {
    desc: "Spacious suite with premium interiors and mountain views.",
    includes: ["Free Cancellation", "Breakfast Included", "Living Area", "Mountain View", "Premium Toiletries"],
  },
  "Royal Suite": {
    desc: "Luxury suite with elegant design and top-class facilities.",
    includes: ["Free Cancellation", "Breakfast Included", "Jacuzzi", "Private Balcony", "Mini Bar"],
  },
  "Presidential Suite": {
    desc: "Ultimate luxury stay with premium privacy and personalized services.",
    includes: ["Free Cancellation", "All Meals Included", "Private Lounge", "Butler Service", "Panoramic View"],
  },
};

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = accommodations.find((acc) => acc.id === parseInt(id));
    setAccommodation(found);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedImages) return;
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
      if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
      if (e.key === "Escape") setSelectedImages(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedImages]);

  if (!accommodation) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const mapQuery = `${accommodation.name}, ${accommodation.location}, Sikkim`;

  const previewImages =
    accommodation.galleryImages?.length > 0
      ? accommodation.galleryImages
      : [accommodation.image];

  const closeSlider = () => {
    setSelectedImages(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (!selectedImages) return;
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    if (!selectedImages) return;
    setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      {/* TOP BAR */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{accommodation.name}</h1>
          <p className="text-sm text-gray-500">📍 {accommodation.location}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Starting from</div>
          <div className="text-2xl font-bold text-blue-600">₹{accommodation.pricePerNight}</div>
          <button
            onClick={() => navigate(`/accommodations/book/${accommodation.id}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded mt-2"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* HOTEL IMAGE GALLERY */}
      <div className="relative grid md:grid-cols-3 gap-2 p-4">
        <img
          src={accommodation.image}
          alt={accommodation.name}
          className="col-span-2 h-[300px] w-full object-cover rounded-lg"
        />
        <div className="grid grid-cols-2 gap-2">
          {previewImages.slice(0, 4).map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={`${accommodation.name} gallery ${index + 1}`}
              className="h-[145px] w-full object-cover rounded"
            />
          ))}
        </div>
        <Link
          to={`/gallery/accommodation/${accommodation.id}`}
          className="absolute bottom-8 right-8 bg-black/80 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-black"
        >
          See more images
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 p-4">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                ⭐ {accommodation.rating}
              </span>
              <span className="text-gray-500">{accommodation.type}</span>
            </div>
            <p className="text-gray-700">{accommodation.longDescription}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-24 rounded-xl overflow-hidden block"
                >
                  <img
                    src="https://res.cloudinary.com/djsguxriw/image/upload/v1777470666/Google_Maps_icon__2015-2020_kqlav0.svg"
                    alt="map"
                    className="h-full w-full object-cover"
                  />
                </a>
                <div>
                  <h3 className="text-lg font-bold">{accommodation.location}</h3>
                  <p className="text-gray-500 text-sm">Exact hotel location</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                See on Map
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {accommodation.amenities.map((a: string, i: number) => (
                <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                  ✓ {a}
                </div>
              ))}
            </div>
          </div>

          {/* ───── ROOMS SECTION (enhanced) ───── */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.3px",
                color: "inherit",
              }}
            >
              Available Rooms
            </h2>

            {accommodation.roomTypes.map((room: string, i: number) => {
              const roomName = room.trim();
              const details = roomDetails[roomName] || {
                desc: "Comfortable stay with essential amenities.",
                includes: ["Free Cancellation", "Breakfast Included"],
              };
              const roomImages = accommodation.roomGallery?.[roomName] || previewImages;

              return (
                <div
                  key={i}
                  className="mb-5 overflow-hidden bg-white"
                  style={{
                    border: "0.5px solid #e2e8f0",
                    borderRadius: "16px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#94a3b8";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Card Header */}
                  <div className="p-5 flex justify-between items-start gap-4">
                    <div className="flex-1 pr-4">
                      {/* Room name + badge */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "18px",
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {roomName}
                        </h3>
                        {i === 0 && (
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 500,
                              background: "#f0f9f4",
                              color: "#2a7a4b",
                              borderRadius: "20px",
                              padding: "2px 9px",
                              border: "0.5px solid #c3e6d0",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Most Popular
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                        {details.desc}
                      </p>

                      {/* Amenity pills */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {details.includes.map((inc: string, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "11.5px",
                              fontWeight: 500,
                              color: "#1a56a0",
                              background: "#eef3fb",
                              borderRadius: "20px",
                              padding: "3px 10px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price + button */}
                    <div className="text-right shrink-0">
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#1a56a0",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        ₹{accommodation.pricePerNight}
                      </div>
                      <button
                        onClick={() => navigate(`/accommodations/book/${accommodation.id}`)}
                        style={{
                          background: "linear-gradient(to right, #2563eb, #9333ea)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "7px 18px",
                          fontSize: "13px",
                          fontWeight: 500,
                          cursor: "pointer",
                          marginTop: "8px",
                          fontFamily: "inherit",
                          transition: "background 0.15s, transform 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                          e.currentTarget.style.transform = "scale(0.98)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#1a56a0";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        Select Room
                      </button>
                    </div>
                  </div>

                  {/* Room Gallery — flush, no padding */}
                  <div
                    className="grid grid-cols-2 md:grid-cols-4"
                    style={{ gap: "3px" }}
                  >
                    {roomImages.slice(0, 4).map((img: string, index: number) => (
                      <div
                        key={index}
                        style={{
                          aspectRatio: "4/3",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={img}
                          alt={`${roomName} image ${index + 1}`}
                          onClick={() => {
                            setSelectedImages(roomImages);
                            setCurrentIndex(index);
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.3s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* ───── END ROOMS SECTION ───── */}
        </div>

        {/* RIGHT SIDE BOOKING CARD */}
        <div className="sticky top-20 h-fit">
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Book this hotel</h2>
            <div className="text-2xl font-bold text-blue-600">
              ₹{accommodation.pricePerNight}
            </div>
            <div className="text-sm text-gray-500">Check-in: {accommodation.checkIn}</div>
            <div className="text-sm text-gray-500">Check-out: {accommodation.checkOut}</div>
            <button
              onClick={() => navigate(`/accommodations/book/${accommodation.id}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded font-semibold"
            >
              Book Now
            </button>
            <button className="w-full bg-green-500 text-white py-3 rounded">
              WhatsApp Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN ROOM IMAGE SLIDER */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeSlider}
        >
          <button
            onClick={closeSlider}
            className="absolute top-5 right-6 text-white text-4xl z-[10000]"
          >
            ×
          </button>
          <div className="absolute top-6 left-6 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
            {currentIndex + 1} / {selectedImages.length}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 md:left-8 text-white text-5xl z-[10000]"
          >
            ‹
          </button>
          <img
            src={selectedImages[currentIndex]}
            alt={`room image ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const endX = e.changedTouches[0].clientX;
              const diff = touchStartX - endX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) nextImage();
                else prevImage();
              }
              setTouchStartX(null);
            }}
            className="max-w-[95vw] max-h-[78vh] object-contain rounded-lg"
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 md:right-8 text-white text-5xl z-[10000]"
          >
            ›
          </button>
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setCurrentIndex(index)}
                className={`h-14 w-20 object-cover rounded cursor-pointer border-2 ${
                  currentIndex === index ? "border-white" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <HotelBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotelData={{
          name: accommodation.name,
          pricePerNight: accommodation.pricePerNight,
          roomTypes: accommodation.roomTypes || [],
        }}
      />
    </div>
  );
};

export default AccommodationDetailPage;