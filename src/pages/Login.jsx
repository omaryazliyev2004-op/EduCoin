import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    localStorage.setItem("token", "logged")
    navigate("/dashboard")
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden">

      <div className="hidden md:flex w-1/2 h-full bg-[#1f2d5a] items-center justify-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />

        <img
          src="/img/study.svg"
          alt="study"
          className="relative z-10 w-[360px] max-w-[80%]"
        />
      </div>

      <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-[360px]">

          <div className="text-center mb-10">
            <p className="text-[10px] font-semibold text-[#1f2d5a] tracking-widest uppercase leading-relaxed">
              Muhammad al-Xorazmiy nomidagi
              <br />
              Toshkent Axborot Texnologiyalari
              <br />
              Universiteti
            </p>

            <img
              src="/img/image.png"
              alt="logo"
              className="w-16 h-16 mx-auto my-4 object-contain"
            />

            <h2 className="text-[13px] font-bold text-[#1f2d5a] tracking-[0.2em] uppercase">
              Learning Management System
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-2">
                Login
              </label>

              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Loginni kiriting"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1f2d5a] focus:bg-white focus:ring-2 focus:ring-[#1f2d5a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-2">
                Parol
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1f2d5a] focus:bg-white focus:ring-2 focus:ring-[#1f2d5a]/10 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1f2d5a] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.696 6.696A9.967 9.967 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.206 5.12M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1f2d5a] text-white font-medium hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Kirish
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-300 mt-10">
            © 2021 Tashkent University of Information Technologies
          </p>
        </div>
      </div>
    </div>
  )
}