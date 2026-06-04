import {
  travelTips,
  emergencyContacts,
  localEtiquette,
} from "../../../data/data";

const TravelTips = () => {
  return (
    <section 
      className="py-16 px-8" 
      id="travel-guide"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #dbeafe 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <span 
            className="inline-block px-6 py-1 text-white rounded-full text-sm font-semibold tracking-wide mb-6"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
          >
              Essential Tips
          </span>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-gray-800 mb-4 leading-tight">
            Travel Smart in
            <span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              style={{ marginLeft: '10px' }}
            >
              Sikkim
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Essential information to make your Sikkim journey smooth, safe, and
            unforgettable
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {travelTips.map((tip) => (
            <div 
              key={tip.id} 
              className="bg-white rounded-2xl p-8 shadow-md transition-all duration-200 border border-gray-200 text-center hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-blue-600"
            >
              <div className="text-5xl mb-4 block">
                {tip.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[0.9375rem]">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-600">
              Emergency Contacts
            </h3>
            <div className="grid gap-4">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-xl transition-all duration-200 hover:bg-blue-600 hover:text-white hover:translate-x-1"
                >
                  <span className="font-semibold">{contact.service}</span>
                  <span className="font-bold text-lg">{contact.number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Etiquette */}
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-600">
              Local Etiquette
            </h3>
            <ul className="list-none p-0 m-0">
              {localEtiquette.map((rule, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 mb-2 hover:bg-gray-100 hover:translate-x-1"
                >
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-gray-600 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelTips;