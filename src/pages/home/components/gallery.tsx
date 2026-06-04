const galleryImages = [
  {
    id: 1,
    title: "Himalayan Landscape",
    location: "North Sikkim",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776971804/482021690_1188497452876796_3423921172685693157_n_auts2c.jpg",
    likes: 1234,
    views: "45.2k"
  },
  {
    id: 2,
    title: "Sikkim Adventure",
    location: "Sikkim",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776970463/502729675_4099808260231283_7029866914746028641_n_z8chlf.jpg",
    likes: 892,
    views: "32.1k"
  },
  {
    id: 3,
    title: "Lepcha Village",
    location: "Dzongu, North Sikkim",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776790844/Lepcha_Village_Experience14-014db39f_ykashe.jpg",
    likes: 2156,
    views: "67.8k"
  },
  {
    id: 4,
    title: "Pang Lhabsol Festival",
    location: "Gangtok",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776790093/Pang_lapsol_f3mmxl.jpg",
    likes: 1678,
    views: "54.3k"
  },
  {
    id: 5,
    title: "Sikkim Scenery",
    location: "Sikkim",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776443464/486484352_3721995761425135_1953547989762996290_n_fp4uqx.jpg",
    likes: 945,
    views: "28.9k"
  },
  {
    id: 6,
    title: "Ravangla",
    location: "South Sikkim",
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776192371/641292730_1505844304881786_8537717821929160166_n_qdjwvz.jpg",
    likes: 1102,
    views: "38.4k"
  },
];

const Gallery = () => {
  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-blue-50 to-slate-50"
      id="gallery"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-purple-600 font-semibold text-sm sm:text-base mb-3 block">
            📸 Visual Journey
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Sikkim Through
            <span className="text-purple-600 ml-2">Our Lens</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in the breathtaking beauty of Sikkim through our curated photo gallery
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:z-10 group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="text-lg font-bold text-white mb-1">{image.title}</h3>
                  <p className="text-sm text-white/90 mb-4">📍 {image.location}</p>
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2 text-white text-sm font-semibold">
                      <span className="text-base">❤️</span>{image.likes}
                    </span>
                    <span className="flex items-center gap-2 text-white text-sm font-semibold">
                      <span className="text-base">👁️</span>{image.views}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer button */}
        <div className="text-center">
          <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-lg">
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;