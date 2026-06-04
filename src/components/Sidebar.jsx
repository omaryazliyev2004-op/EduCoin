import { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"

import {
    Zap, Home, Users, BookOpen,
    GraduationCap, Gift, ClipboardList, ChevronLeft,
    Layout, Crown, LayoutGrid, Building2, UserSquare2,
    ListTodo, Shield, Coins, Send,
    MessageCircle, ClipboardCheck, ChevronRight, X
} from "lucide-react"

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const [showManagement, setShowManagement] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const activeTab = queryParams.get("tab") || "kurslar"

    const mainNav = [
        { to: "/dashboard", icon: <Home size={20} />, label: "Asosiy", end: true },
        { to: "/dashboard/teachers", icon: <UserSquare2 size={20} />, label: "O'qituvchilar" },
        { to: "/dashboard/groups", icon: <Users size={20} />, label: "Guruhlar" },
        { to: "/dashboard/students", icon: <GraduationCap size={20} />, label: "Talabalar" },
        { to: "/dashboard/sovgalar", icon: <Gift size={20} />, label: "Sov'g'alar" },
    ]

    const managementItems = [
        { label: "Kurslar",   icon: <BookOpen size={20} />,    tab: "kurslar",   desc: "Barcha kurslar" },
        { label: "Xonalar",   icon: <LayoutGrid size={20} />,  tab: "xonalar",   desc: "Sinf xonalari" },
        { label: "Filiallar", icon: <Building2 size={20} />,   tab: "filiallar", desc: "Filial bo'limlari" },
        { label: "Xodimlar",  icon: <UserSquare2 size={20} />, tab: "xodimlar",  desc: "Xodimlar ro'yxati" },
        { label: "Sabablar",  icon: <ListTodo size={20} />,    tab: "sabablar",  desc: "Sabab turlari" },
    ]

    return (
        <>
        {/* Backdrop overlay */}
        <div
            onClick={() => setShowManagement(false)}
            className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-all duration-300 ${
                showManagement ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        />

        <aside
            className={`${collapsed ? "w-[84px]" : "w-[260px]"} bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 relative h-screen z-50 shadow-sm`}
        >
            <div className={`px-5 py-7 flex items-center ${collapsed ? "justify-center" : ""}`}>
                <div className="w-12 h-12 rounded-[16px] bg-violet-100 flex items-center justify-center shadow-sm shrink-0">
                    <GraduationCap size={26} className="text-violet-600 fill-violet-200/40" />
                </div>
                {!collapsed && <span className="ml-3.5 text-[24.5px] font-extrabold text-[#1f2d5a] tracking-tight">TM-Edu</span>}
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-2">
                {mainNav.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setShowManagement(false)}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[16px] font-semibold transition-all duration-200 group relative
                            ${collapsed ? "justify-center" : ""}
                            ${isActive && !showManagement
                                ? "bg-violet-600 text-white shadow-xl shadow-violet-200 scale-[1.02]"
                                : "text-gray-500 hover:bg-violet-50 hover:text-violet-600 hover:translate-x-1"}`
                        }
                    >
                        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                        {item.hasCrown && !collapsed && (
                            <Crown size={14} className="text-yellow-500 fill-yellow-500 absolute right-4" />
                        )}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3.5 py-2 bg-[#1f2d5a] text-white text-[13px] font-extrabold tracking-wide rounded-xl shadow-[0_10px_25px_-5px_rgba(31,45,90,0.4)] opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 delay-0 group-hover:delay-[1000ms] z-[999] whitespace-nowrap pointer-events-none flex items-center">
                                {item.label}
                                <div className="absolute top-1/2 -left-[5px] -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1f2d5a]" />
                            </div>
                        )}
                    </NavLink>
                ))}

                {/* Boshqarish toggle */}
                <button
                    onClick={() => setShowManagement(!showManagement)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[16px] font-semibold transition-all duration-200 group relative
                        ${collapsed ? "justify-center" : ""}
                        ${showManagement || location.pathname === "/dashboard/settings"
                            ? "bg-violet-600 text-white shadow-xl shadow-violet-200 scale-[1.02]"
                            : "text-gray-500 hover:bg-violet-50 hover:text-violet-600 hover:translate-x-1"}`}
                >
                    <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        <Layout size={20} />
                    </span>
                    {!collapsed && (
                        <>
                            <span className="flex-1 text-left">Boshqarish</span>
                            <ChevronRight
                                size={15}
                                className={`transition-transform duration-300 ${showManagement ? "rotate-90 opacity-70" : "opacity-50"}`}
                            />
                        </>
                    )}
                    {collapsed && (
                        <div className="absolute left-full ml-4 px-3.5 py-2 bg-[#1f2d5a] text-white text-[13px] font-extrabold tracking-wide rounded-xl shadow-[0_10px_25px_-5px_rgba(31,45,90,0.4)] opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 delay-0 group-hover:delay-[1000ms] z-[999] whitespace-nowrap pointer-events-none flex items-center">
                            Boshqarish
                            <div className="absolute top-1/2 -left-[5px] -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1f2d5a]" />
                        </div>
                    )}
                </button>
            </nav>

            {!collapsed && (
                <div className="mx-4 mb-6 p-5 rounded-[24px] bg-orange-50/50 border border-orange-100/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm">
                            <ClipboardList size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[15.5px] font-bold text-gray-800 leading-tight">Obuna</p>
                            <p className="text-[13.5px] text-orange-500 font-semibold mt-0.5">Obunangiz tugagan</p>
                        </div>
                    </div>
                    <button className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-[14.5px] font-bold transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 active:scale-95">
                        <Zap size={15} />
                        Obunani yangilash
                    </button>
                </div>
            )}

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-4 top-[51px] w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-md shadow-violet-200 border border-violet-500/10 transition-all z-[300] active:scale-90 cursor-pointer"
            >
                <ChevronLeft
                    size={18}
                    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                />
            </button>

            {/* ═══ Boshqarish ikkinchi sidebar paneli ═══ */}
            <div
                className={`
                    absolute top-0 left-full h-full w-[260px]
                    bg-white border-r border-gray-100 flex flex-col
                    transition-all duration-300 ease-in-out z-[200]
                    shadow-[6px_0_30px_-6px_rgba(124,58,237,0.15)]
                    ${showManagement
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-8 pointer-events-none"}
                `}
            >
                {/* Header — asosiy sidebar bilan bir xil stil */}
                <div className="px-5 py-7 flex items-center border-b border-gray-100">
                    <div className="w-12 h-12 rounded-[16px] bg-violet-100 flex items-center justify-center shadow-sm shrink-0">
                        <Layout size={22} className="text-violet-600" />
                    </div>
                    <span className="ml-3.5 text-[20px] font-extrabold text-[#1f2d5a] tracking-tight flex-1">
                        Boshqarish
                    </span>
                    <button
                        onClick={() => setShowManagement(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-all active:scale-90 group"
                    >
                        <X size={15} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Bo'lim sarlavhasi */}
                <div className="px-5 pt-5 pb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Menyular</span>
                </div>

                {/* Menu items — asosiy nav bilan bir xil stil */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {managementItems.map((sub) => {
                        const isSubActive = location.pathname === "/dashboard/settings" && activeTab === sub.tab
                        return (
                            <button
                                key={sub.label}
                                onClick={() => {
                                    navigate(`/dashboard/settings?tab=${sub.tab}`)
                                    setShowManagement(false)
                                }}
                                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[16px] font-semibold transition-all duration-200 group/item text-left
                                    ${isSubActive
                                        ? "bg-violet-600 text-white shadow-xl shadow-violet-200 scale-[1.02]"
                                        : "text-gray-500 hover:bg-violet-50 hover:text-violet-600 hover:translate-x-1"}`}
                            >
                                <span className={`shrink-0 transition-all duration-200 group-hover/item:scale-110
                                    ${isSubActive ? "text-white" : "text-gray-400 group-hover/item:text-violet-500"}`}
                                >
                                    {sub.icon}
                                </span>
                                <div className="flex flex-col items-start min-w-0">
                                    <span className="leading-tight">{sub.label}</span>
                                    <span className={`text-[11.5px] font-medium leading-tight mt-0.5 transition-colors
                                        ${isSubActive ? "text-violet-200" : "text-gray-400 group-hover/item:text-violet-400"}`}>
                                        {sub.desc}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100">
                    <p className="text-[11.5px] text-gray-400 font-medium text-center">TM-Edu boshqaruv paneli</p>
                </div>
            </div>

        </aside>
        </>
    )
}
