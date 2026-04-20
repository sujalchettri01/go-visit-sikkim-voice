const HomeHero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      {/* Background wave */}
      <div className="absolute inset-0 animate-[float_20s_ease-in-out_infinite]">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,...')] bg-bottom bg-cover bg-no-repeat"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-[2] text-center w-full max-w-[1200px] px-5 sm:px-8  sm:py-0 animate-[fadeInUp_1s_ease-out]">

        {/* Badge */}
        <div className="inline-block px-4 sm:px-6 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-semibold tracking-wider mb-6 sm:mb-8 border border-white/30 animate-pulse">
          ✨ HIMALAYAN PARADISE AWAITS
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.1] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
          Discover the
          <span className="block bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Magic of Sikkim
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-[600px] mx-auto mb-10 sm:mb-14 leading-relaxed px-2">
          Journey through pristine valleys, ancient monasteries, and snow-capped
          peaks in India's most enchanting Himalayan state
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-10 sm:mb-14 px-0">
          <button
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)')}
          >
            <a href="#destinations" className="flex items-center gap-2">
              <span>Start Your Adventure</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </button>

          <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold tracking-wide text-white bg-gray-800 border-2 border-gray-800 shadow-sm transition-all duration-200 inline-flex items-center justify-center gap-2 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-lg">
            <span>▶</span>
            <span>Watch Journey</span>
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: '🏔️', label: 'Himalayan Peaks' },
            { icon: '💧', label: 'Sacred Rivers' },
            { icon: '🌲', label: 'Ancient Forests' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 text-sm sm:text-base"
            >
              <span className="text-xl sm:text-2xl">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HomeHero;