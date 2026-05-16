import { useState } from "react"
import { Bell, Moon, Search, Sun } from "lucide-react"

export default function Header() {
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 w-60">
                <Search size={14} className="text-gray-400" />
                <input className="text-[13px] w-full outline-none text-black" placeholder="Qidirish..." />
            </div>
            <div className="flex items-center gap-3">
                <select className="text-[12px] px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none">
                    <option>O'zbekcha</option>
                    <option>Ruscha</option>
                    <option>English</option>
                </select>

                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center"
                    >
                        <Bell size={16} className="text-gray-500" />
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 top-11 z-[120] w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                            <p className="text-[13px] font-bold text-gray-800">Bildirishnomalar</p>
                            <p className="mt-2 text-[12px] text-gray-400">Hozircha yangi xabar yo'q.</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                        darkMode ? "bg-slate-900 border-slate-900" : "bg-gray-50 border-gray-200"
                    }`}
                >
                    {darkMode ? (
                        <Sun size={16} className="text-white" />
                    ) : (
                        <Moon size={16} className="text-gray-500" />
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white text-[13px] font-bold cursor-pointer"
                    >
                        C
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-11 z-[120] w-48 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
                            <p className="px-2 py-1 text-[13px] font-bold text-gray-800">Creator</p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    window.location.href = "/"
                                }}
                                className="mt-2 w-full rounded-xl px-2 py-2 text-left text-[12px] font-semibold text-red-500 hover:bg-red-50"
                            >
                                Chiqish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
