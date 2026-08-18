import { Link } from "react-router-dom"



export default function CabBanner() {

  return (
    <>
      <section
        className="relative h-96 md:h-[550px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/djsguxriw/image/upload/v1782572269/rohitmondal31-sikkim-7254301_ux3u1j.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl text-center px-6 md:px-12 text-white">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-lg text-white !text-white">
            Cab Bookings
          </h1>

          <p className="text-lg md:text-2xl text-gray-100 mb-10 leading-relaxed">
            Book reliable cabs instantly. Travel comfortably and safely with our trusted fleet of professional drivers.
          </p>
          <div className="flex  justify-center gap-4">
            <Link to="/cabs">
               <button 
                  className="group relative w-full px-8 py-3 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)';
                  }}
                >
                  <span 
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <span className="relative text-xl">SEE MORE</span>
                </button>
            </Link>
          </div>
        </div>
      </section>

      {/* <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} type="cab" /> */}
    </>
  )
}