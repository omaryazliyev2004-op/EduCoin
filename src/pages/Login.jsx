import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { Snackbar, Alert, Button } from "@mui/material"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success") // 'success' yoki 'error'

  const navigate = useNavigate()

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.post("/auth/login", {
        phone,
        password
      })

      const token = response.data?.accessToken
      
      if (token) {
        localStorage.setItem("token", token)
        setSnackbarSeverity("success")
        setSnackbarMessage("Tizimga muvaffaqiyatli kirdingiz!")
        setOpenSnackbar(true)
        
        // Biroz kutib keyin dashboardga o'tkazish (Alert ko'rinishi uchun)
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      } else {
        setSnackbarSeverity("error")
        setSnackbarMessage("Token qaytarilmadi!")
        setOpenSnackbar(true)
      }
    } catch (err) {
      console.error("Login xatosi:", err)
      setSnackbarSeverity("error")
      setSnackbarMessage("Parol yoki login xato")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden">

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%', fontSize: '15px' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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
            <p className="text-[11.5px] font-semibold text-[#1f2d5a] tracking-widest uppercase leading-relaxed">
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

            <h2 className="text-[14.5px] font-bold text-[#1f2d5a] tracking-[0.2em] uppercase">
              Learning Management System
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-[12.5px] font-semibold text-gray-500 tracking-widest uppercase mb-2">
                Login
              </label>

              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Login (telefon raqam) ni kiriting"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[15.5px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1f2d5a] focus:bg-white focus:ring-2 focus:ring-[#1f2d5a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-gray-500 tracking-widest uppercase mb-2">
                Parol
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-[15.5px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1f2d5a] focus:bg-white focus:ring-2 focus:ring-[#1f2d5a]/10 transition-all"
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

            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                py: 1.5,
                borderRadius: "12px",
                backgroundColor: "#1f2d5a",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#2a3d7a",
                  boxShadow: "none"
                },
                "&:disabled": {
                  backgroundColor: "#1f2d5a",
                  opacity: 0.7,
                  color: "white"
                }
              }}
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>

          <p className="text-center text-[12.5px] text-gray-300 mt-10">
            © 2021 Tashkent University of Information Technologies
          </p>
        </div>
      </div>
    </div>
  )
}