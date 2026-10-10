import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { updateProfile, showToast, presence } = usePresence();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      errs.password = 'Please enter your password.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Set demo username if not already present
    if (!presence.userName || presence.userName === 'Somto') {
      const derivedName = form.email.split('@')[0];
      const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      updateProfile({ userName: capitalized });
    }

    showToast(`Welcome back!`);
    navigate('/home');
  };

  const handleSocialLogin = (provider) => {
    showToast(`Connected with ${provider}. Welcome back!`);
    navigate('/home');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast('A password recovery email has been sent if an account exists.');
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
            Welcome back to Presence
          </h1>
          <p className="text-sm sm:text-base text-[#f5eee4]/80 leading-relaxed text-balance">
            Continue where you left off with your companion.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              placeholder="Enter your password"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-[#f5eee4]/75 hover:text-white transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 rounded-full bg-[#f5eee4] text-[#0e1c1a] font-semibold text-base shadow-lg shadow-black/20 hover:bg-[#fffaf2] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Log In
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/15"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-white/50 uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/15"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-white text-[#0e1c1a] text-xs font-bold flex items-center justify-center">
                G
              </span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span className="text-base leading-none"></span>
              <span>Apple</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-[#f5eee4]/80">
          New to Presence?{' '}
          <Link to="/signup" className="text-[#f5eee4] font-semibold underline underline-offset-4 hover:text-white">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
