import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1773216362/anshika-7vHDicrPYOI-unsplash_v0toqz.jpg')`,
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/60 to-purple-600/60" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl animate-[fadeInUp_0.8s_ease-out]">

          {/* Title */}
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-white/80 text-center mb-6">
            Continue your journey ✨
          </p>

          {/* Form */}
          <form className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Button */}
            <button
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)'
              }}
            >
              Login
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-white/80 mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to={'/register'} className="text-yellow-300 hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default LoginPage;