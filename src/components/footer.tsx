const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-800 to-slate-950 text-white/90 pt-16 pb-8 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              GoVisit Sikkim
            </h3>
            <p className="text-white/70 leading-relaxed text-[0.9375rem]">
              Discover the enchanting beauty of Sikkim through authentic
              experiences and unforgettable adventures in the heart of the
              Himalayas.
            </p>
            <div className="flex gap-4 mt-4">
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:-translate-y-1 hover:shadow-lg"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:-translate-y-1 hover:shadow-lg"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:-translate-y-1 hover:shadow-lg"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-white mb-2">Quick Links</h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <a 
                  href="#destinations" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🏔️ Destinations
                </a>
              </li>
              <li>
                <a 
                  href="#culture" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🎭 Culture
                </a>
              </li>
              <li>
                <a 
                  href="#activities" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🎯 Activities
                </a>
              </li>
              <li>
                <a 
                  href="#travel-guide" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  📖 Travel Guide
                </a>
              </li>
              <li>
                <a 
                  href="#permits" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  📋 Permits
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Places Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-white mb-2">Popular Places</h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <a 
                  href="#gangtok" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🏙️ Gangtok
                </a>
              </li>
              <li>
                <a 
                  href="#nathula" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🏔️ Nathula Pass
                </a>
              </li>
              <li>
                <a 
                  href="#yuksom" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🥾 Yuksom
                </a>
              </li>
              <li>
                <a 
                  href="#pelling" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🌄 Pelling
                </a>
              </li>
              <li>
                <a 
                  href="#lachung" 
                  className="text-white/70 text-[0.9375rem] transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  🌸 Lachung
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-white mb-2">Contact Us</h4>
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              <li className="flex items-start gap-2 text-white/70 text-[0.9375rem]">
                <span className="text-lg flex-shrink-0">📍</span>
                <span>Gangtok, Sikkim, India</span>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-[0.9375rem]">
                <span className="text-lg flex-shrink-0">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-[0.9375rem]">
                <span className="text-lg flex-shrink-0">✉️</span>
                <span>info@sikkimtourism.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4 flex-wrap">
          <p className="text-white/60 text-sm text-center sm:text-left">
            © 2024 GoVisit Sikkim. All rights reserved. | Crafted with ❤️ by Engineers for
            the Land of Mystical Beauty
          </p>
          <p className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white/90 border border-white/20">
            ⭐ Rated #1 Himalayan Destination
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;