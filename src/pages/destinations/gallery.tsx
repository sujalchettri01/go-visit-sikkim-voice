import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import packages from "../../data/package";

export default function DestinationGalleryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const tour: any = (packages as any[]).find(
    (item) => String(item.id) === String(id)
  );

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-slate-600">Gallery not found.</p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const title = tour.title ?? tour.name ?? "Destination Gallery";
  const heroImage = tour.heroImage ?? tour.image ?? "";
  const images = tour.images?.length ? tour.images : [heroImage];

  const closePreview = () => setSelectedIndex(null);

  const showPrev = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closePreview();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }

    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-full bg-white shadow text-slate-700 hover:bg-slate-100"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {title} Gallery
        </h1>

        <p className="text-slate-500 mb-8">{images.length} photos</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {images.map((img: string, index: number) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="rounded-2xl overflow-hidden shadow-md bg-white cursor-pointer"
            >
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closePreview}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closePreview}
            className="absolute top-5 right-6 text-white text-4xl font-bold z-[10000]"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 text-white text-5xl items-center justify-center hover:bg-white/30 z-[10000]"
          >
            ‹
          </button>

          <img
            src={images[selectedIndex]}
            alt={`${title} preview ${selectedIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[82vh] object-contain rounded-xl"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 text-white text-5xl items-center justify-center hover:bg-white/30 z-[10000]"
          >
            ›
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-4 py-2 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}