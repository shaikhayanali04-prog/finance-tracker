import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-teal-300/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-slate-500/10 rounded-full blur-[100px]"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white fill">account_balance_wallet</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#2C3E50]">
            Trakify
          </span>
        </div>

        <div className="hidden md:flex gap-6">
          <a href="/help" className="text-gray-500 font-medium hover:text-teal-500 transition-colors text-sm">
            Help Center
          </a>
          <a href="/security" className="text-gray-500 font-medium hover:text-teal-500 transition-colors text-sm">
            Security
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <section className="w-full max-w-[440px] mt-24 mb-20">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_32px_64px_-12px_rgba(44,62,80,0.08)]">
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm">
                Secure access to your personal financial portfolio.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
  }}
>
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-teal-500">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-[10px] font-bold tracking-widest text-teal-500 uppercase hover:opacity-80 transition-opacity"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-teal-500">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Secure Login</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Signup */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                New to the vault?{" "}
                <a
                  href="/signup"
                  className="text-[#2C3E50] font-bold hover:text-teal-500 transition-colors underline underline-offset-4 decoration-teal-300/30"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Trust Tags */}
          <div className="mt-8 flex items-center justify-center gap-6 opacity-50 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Bank-Grade AES-256
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">gpp_good</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Privacy Focused
              </span>
            </div>
          </div>
        </section>

        {/* Right Side Card */}
        <aside className="hidden xl:block absolute right-20 top-1/2 -translate-y-1/2 w-80">
          <div className="bg-[#2C3E50] rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <div className="relative z-10">
              <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
                Portfolio Insight
              </span>
              <h3 className="text-white text-xl mt-1 mb-4 font-bold">
                Master your capital
              </h3>
              <div className="flex items-end gap-2 text-teal-300">
                <span className="text-3xl font-extrabold tracking-tight">+12.4%</span>
                <span className="text-xs font-bold mb-1">THIS QUARTER</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
              <svg
                className="w-full h-full opacity-30 stroke-teal-300 stroke-[4] fill-none"
                viewBox="0 0 400 100"
              >
                <path
                  d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,40"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50] via-transparent to-transparent"></div>
          </div>

          <div className="mt-6 pl-4 border-l border-teal-300/20">
            <p className="text-gray-500 text-xs italic leading-relaxed">
              "Control over one's financial destiny is the ultimate luxury.
              Trakify Vault provides the clarity required for decisive action."
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex justify-center gap-8 py-6 px-4 flex-wrap bg-transparent">
        <span className="text-xs tracking-wide uppercase text-gray-500">
          (c) 2024 Sovereign Vault. All rights reserved.
        </span>
        <div className="flex gap-4">
          <a href="/privacy" className="text-xs tracking-wide uppercase text-gray-400 hover:text-teal-500 transition-colors hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-xs tracking-wide uppercase text-gray-400 hover:text-teal-500 transition-colors hover:underline">
            Terms of Service
          </a>
          <a href="/security" className="text-xs tracking-wide uppercase text-gray-400 hover:text-teal-500 transition-colors hover:underline">
            Security
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
