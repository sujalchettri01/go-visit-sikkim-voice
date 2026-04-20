import { useState, useEffect, useRef, useCallback } from 'react';
import { testimonials } from "../../../data/data";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const maxIndex = testimonials.length - perPage;

  const getPerPage = useCallback(() => {
    const w = wrapRef.current?.offsetWidth ?? window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  }, []);

  useEffect(() => {
    const update = () => setPerPage(getPerPage());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [getPerPage]);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, testimonials.length - perPage));
    setCurrent(clamped);
    if (trackRef.current) {
      const slideW = trackRef.current.children[0]
        ? (trackRef.current.children[0] as HTMLElement).offsetWidth
        : 0;
      trackRef.current.style.transform = `translateX(-${clamped * slideW}px)`;
    }
  }, [perPage]);

  // re-clamp on perPage change
  useEffect(() => { goTo(Math.min(current, testimonials.length - perPage)); }, [perPage]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
    ));

  const dotCount = Math.max(1, testimonials.length - perPage + 1);

  return (
    <section
      className="pt-20 px-6 md:px-10"
      id="testimonials"
      style={{ background: 'linear-gradient(180deg, #fee2e2 0%, #ffffff 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="text-center max-w-[700px] mx-auto ">
          <span className="inline-block px-5 py-1 text-white rounded-full text-sm font-semibold tracking-wide mb-5"
            style={{ background: 'linear-gradient(135deg, #2563eb, #8b5cf6)' }}>
            💬 Traveler Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-500">
            Real experiences from travelers who discovered the magic of Sikkim
          </p>
        </div>

        {/* Carousel track */}
        <div className="overflow-hidden mt-8" ref={wrapRef}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
          }}
        >
          <div
            ref={trackRef}
            className="flex transition-transform duration-[450ms] ease-[cubic-bezier(.4,0,.2,1)]"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex-shrink-0 px-3 box-border"
                style={{ flex: `0 0 ${100 / perPage}%` }}
              >
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 h-full flex flex-col">

                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-[52px] h-[52px] rounded-full object-cover border-[2.5px] border-blue-600 flex-shrink-0"
                    />
                    <div>
                      <p className="text-[15px] font-bold text-gray-800 mb-0.5">{t.name}</p>
                      <p className="text-xs text-gray-500">📍 {t.location}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 text-base mb-3">{renderStars(t.rating)}</div>

                  {/* Badge */}
                  <p className="mb-4">
                    <span className="inline-block bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {t.experience}
                    </span>
                  </p>

                  {/* Quote */}
                  <p className="text-gray-500 leading-relaxed italic text-sm pl-4 border-l-[3px] border-blue-600 mt-auto"
                    style={{ borderRadius: 0 }}>
                    "{t.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: dotCount }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[7px] rounded-full transition-all duration-300 border-none cursor-pointer"
              style={{
                width: i === current ? '22px' : '7px',
                background: i === current ? '#2563eb' : '#d1d5db',
              }}
            />
          ))}
        </div>

        {/* Arrows + counter */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">{current + 1} / {testimonials.length}</span>
          <button
            onClick={() => goTo(current + 1)}
            disabled={current >= maxIndex}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;