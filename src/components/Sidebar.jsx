import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
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

    const mainNav = [
        { to: "/dashboard", icon: <Home size={20} />, label: "Asosiy", end: true },
        { to: "/dashboard/teachers", icon: <UserSquare2 size={20} />, label: "O'qituvchilar" },
        { to: "/dashboard/groups", icon: <Users size={20} />, label: "Guruhlar" },
        { to: "/dashboard/students", icon: <GraduationCap size={20} />, label: "Talabalar" },
        { to: "/dashboard/sovgalar", icon: <Gift size={20} />, label: "Sov'g'alar" },
    ]

    const managementItems = [
        { label: "Kurslar", icon: <BookOpen size={16} />, tab: "kurslar" },
        { label: "Xonalar", icon: <LayoutGrid size={16} />, tab: "xonalar" },
        { label: "Filiallar", icon: <Building2 size={16} />, tab: "filiallar" },
        { label: "Xodimlar", icon: <UserSquare2 size={16} />, tab: "xodimlar" },
        { label: "Sabablar", icon: <ListTodo size={16} />, tab: "sabablar" },
        { label: "Rollar", icon: <Shield size={16} />, tab: "rollar" },
        { label: "Coin", icon: <Coins size={16} />, tab: "coin" },
        { label: "Xabar Yuborish", icon: <Send size={16} />, tab: "xabar" },
        { label: "FAQ", icon: <MessageCircle size={16} />, tab: "faq" },
        { label: "Tekshiruv", icon: <ClipboardCheck size={16} />, tab: "tekshiruv" },
    ]

    return (
        <>
        {showManagement && (
            <button
                type="button"
                aria-label="Boshqarish menusini yopish"
                onClick={() => setShowManagement(false)}
                className="fixed inset-0 z-40 cursor-default bg-transparent"
            />
        )}
        <aside
            className={`${collapsed ? "w-[84px]" : "w-[260px]"} bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 relative h-screen z-50 shadow-sm`}
        >
            <div className={`px-7 py-8 flex items-center ${collapsed ? "justify-center" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shadow-inner">
                    <Zap size={22} className="text-orange-500 fill-orange-500" />
                </div>
                {!collapsed && <span className="ml-3 text-[20px] font-extrabold text-[#1f2d5a] tracking-tight">EduCoin</span>}
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-2">
                {mainNav.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setShowManagement(false)}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14.5px] font-semibold transition-all duration-200 group relative
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
                    </NavLink>
                ))}

                {/* Boshqarish - Management toggle item */}
                <button
                    onClick={() => setShowManagement(!showManagement)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14.5px] font-semibold transition-all duration-200 group relative
                        ${collapsed ? "justify-center" : ""}
                        ${showManagement
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
                </button>
            </nav>

            {!collapsed && (
                <div className="mx-4 mb-6 p-5 rounded-[24px] bg-orange-50/50 border border-orange-100/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm">
                            <ClipboardList size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-gray-800 leading-tight">Obuna</p>
                            <p className="text-[12px] text-orange-500 font-semibold mt-0.5">Obunangiz tugagan</p>
                        </div>
                    </div>
                    <button className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 active:scale-95">
                        <Zap size={15} />
                        Obunani yangilash
                    </button>
                </div>
            )}

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3.5 top-24 w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-lg hover:text-violet-600 text-gray-400 transition-all z-40 active:scale-90"
            >
                <ChevronLeft
                    size={16}
                    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                />
            </button>

            {/* Management Sub-menu Panel — absolute, overlays content */}
            <div
                className={`
                    absolute top-0 left-full h-full w-[220px]
                    bg-white border-r border-gray-100 shadow-2xl flex flex-col
                    transition-all duration-300 ease-in-out z-[200]
                    ${showManagement
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-4 pointer-events-none"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-gray-100">
                    <span className="text-[15px] font-bold text-[#1f2d5a]">Menu</span>
                    <button
                        onClick={() => setShowManagement(false)}
                        className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center hover:bg-violet-700 transition-colors shadow-md shadow-violet-200"
                    >
                        <X size={13} className="text-white" />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {managementItems.map((sub) => (
                        <button
                            key={sub.label}
                            onClick={() => {
                                navigate(`/dashboard/settings?tab=${sub.tab}`)
                                setShowManagement(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all group/item text-left"
                        >
                            <span className="text-gray-400 group-hover/item:text-violet-500 transition-colors shrink-0">
                                {sub.icon}
                            </span>
                            <span>{sub.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
        </>
    )
}
