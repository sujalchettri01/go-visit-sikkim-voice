import { useState } from "react";
import { useSignup } from "../../hooks/useSignup"; // adjust path as needed

const SignupPage = () => {
  const { mutate: signup, isPending, error } = useSignup();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(form);
  };

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
            Create Account
          </h2>
          <p className="text-white/80 text-center mb-6">
            Start your adventure 🌍
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm text-center">
              {error.message || "Something went wrong. Please try again."}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)'
              }}
            >
              {isPending ? "Creating account…" : "Sign Up"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-white/80 mt-6 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-300 hover:underline">
              Login
            </a>
          </p>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default SignupPage;