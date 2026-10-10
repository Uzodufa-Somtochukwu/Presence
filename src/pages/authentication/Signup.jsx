import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { updateProfile, showToast } = usePresence();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!form.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      errs.password = 'Please create a password.';
    } else if (form.password.length < 6) {
      errs.password = 'Password should be at least 6 characters.';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Persist user's name & email in the profile
    updateProfile({
      fullName: form.fullName.trim(),
      userName: form.fullName.trim().split(' ')[0],
      email: form.email.trim(),
    });

    showToast(`Welcome, ${form.fullName.trim().split(' ')[0]}! Let's get to know you.`);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1c1a] via-[#122d29] to-[#173a34] text-[#f5eee4] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <BotanicalBackdrop variant="teal" />

      <div className="relative z-10 w-full max-w-lg bg-[#11221f]/80 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
        <div className="text-center mb-6">
          <BrandHeader theme="dark" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f5eee4] text-balance">
            Create your Presence
          </h1>
          <p className="text-sm sm:text-base text-[#f5eee4]/80 leading-relaxed text-balance">
            Create an account so your conversations and progress can be safely saved and available when you return.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold uppercase tracking-wider text-[#f5eee4]/90 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-[#d68772] focus:ring-[#d68772]/30'
                  : 'border-white/15 focus:border-white/40 focus:ring-white/10'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-[#f4c8b0] mt-1.5" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#f5eee4]/90 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-[#d68772] focus:ring-[#d68772]/30'
                  : 'border-white/15 focus:border-white/40 focus:ring-white/10'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-[#f4c8b0] mt-1.5" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#f5eee4]/90 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-[#d68772] focus:ring-[#d68772]/30'
                  : 'border-white/15 focus:border-white/40 focus:ring-white/10'
              }`}
            />
            {errors.password && (
              <p className="text-xs text-[#f4c8b0] mt-1.5" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-[#f5eee4]/90 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? 'border-[#d68772] focus:ring-[#d68772]/30'
                  : 'border-white/15 focus:border-white/40 focus:ring-white/10'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-[#f4c8b0] mt-1.5" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-4 rounded-full bg-[#f5eee4] text-[#0e1c1a] font-semibold text-base shadow-lg shadow-black/20 hover:bg-[#fffaf2] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-[#f5eee4]/80">
          Already have an account?{' '}
          <Link to="/login" className="text-[#f5eee4] font-semibold underline underline-offset-4 hover:text-white">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
