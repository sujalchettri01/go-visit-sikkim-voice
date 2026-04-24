import { useState } from 'react';
import { Bike, Users, DollarSign } from 'lucide-react';
import bikesData from '../../data/bikes';
import BikeBookingModal from './modal';
import { Link } from 'react-router-dom';

export default function BikesListingPage() {
  const [selectedBike, setSelectedBike] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (bike: any) => {
    setSelectedBike(bike);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBike(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
    style={{
      backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1776184323/536253660_18037263602689529_1526035111809747031_n_bb17dr.jpg')`,
    }}
  />

  {/* Purple gradient overlay */}
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.6) 0%, rgba(118,75,162,0.6) 100%)' }}
  />

  {/* Radial dark overlay */}
  <div
    className="absolute inset-0"
    style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)' }}
  />

  {/* Hero Content */}
  <div className="relative z-[2] text-center max-w-[1200px] px-8">
    <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold tracking-wider mb-8 border border-white/30 animate-pulse">
      🏍️ RIDE WITH US
    </div>

    <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-extrabold text-white mb-6 leading-[1.05] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
      Perfect
      <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        Bikes
      </span>
      for Your Adventure
    </h1>

    <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/90 max-w-[700px] mx-auto mb-12 leading-relaxed">
      Rent from a wide range of bikes and scooters to explore Sikkim at your pace.
    </p>

    <div className="flex gap-8 justify-center flex-wrap mb-8 max-md:flex-col max-md:gap-4">
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <span className="text-3xl">🏍️</span>
        <div className="text-left">
          <div className="text-2xl font-bold">50+</div>
          <div className="text-sm text-white/80">Bikes Available</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <span className="text-3xl">⭐</span>
        <div className="text-left">
          <div className="text-2xl font-bold">4.6/5</div>
          <div className="text-sm text-white/80">Avg Rating</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <span className="text-3xl">🛠️</span>
        <div className="text-left">
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-sm text-white/80">Support</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Bikes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikesData.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={bike.image}
                  alt={bike.bike_name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-yellow-500 font-semibold">★ {bike.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{bike.bike_name}</h3>
                  <p className="text-sm text-gray-500">{bike.company}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {bike.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{feature}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{bike.capacity} {bike.capacity === 1 ? 'Rider' : 'Riders'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold">${bike.pricePerDay}/day</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookNow(bike)}
                  className="group/btn w-full relative px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                >
                  <Bike className="w-5 h-5 mr-2" />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedBike && (
        <BikeBookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bikeName={selectedBike.bike_name}
          pricePerDay={selectedBike.pricePerDay}
        />
      )}

      {/* Bottom CTA */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201440%20320%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%20d%3D%22M0%2C96L48%2C112C96%2C128%2C192%2C160%2C288%2C160C384%2C160%2C480%2C128%2C576%2C122.7C672%2C117%2C768%2C139%2C864%2C144C960%2C149%2C1056%2C139%2C1152%2C128C1248%2C117%2C1344%2C107%2C1392%2C101.3L1440%2C96L1440%2C320L1392%2C320C1344%2C320%2C1248%2C320%2C1152%2C320C1056%2C320%2C960%2C320%2C864%2C320C768%2C320%2C672%2C320%2C576%2C320C480%2C320%2C384%2C320%2C288%2C320C192%2C320%2C96%2C320%2C48%2C320L0%2C320Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-bottom bg-cover bg-no-repeat"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Biking Adventure?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Rent a bike and discover Sikkim's hidden gems at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={'/destinations'}>
              <button 
              className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center"
            >
              <span>Plan Your Ride</span>
              <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            </Link>
            <Link to={'/contact'}>
              <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
              Contact Us
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}