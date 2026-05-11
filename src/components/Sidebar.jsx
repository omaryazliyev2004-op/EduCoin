import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
    Zap, Home, Users, BookOpen,
    GraduationCap, Gift, Settings,
    ClipboardList, ChevronLeft
} from "lucide-react"

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`${collapsed ? "w-[64px]" : "w-[200px]"} bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 relative`}>
            <div className={`px-4 py-5 flex items-center ${collapsed ? "justify-center" : ""}`}>
                <Zap size={20} className="text-violet-600" />
                {!collapsed && <span className="ml-2 text-[16px] font-bold text-violet-600">EduCoin</span>}
            </div>

            <nav className="flex-1 px-2 space-y-1">

                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <Home size={16} />
                    {!collapsed && "Asosiy"}
                </NavLink>

                <NavLink
                    to="/dashboard/teachers"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <Users size={16} />
                    {!collapsed && "O'qituvchilar"}
                </NavLink>

                <NavLink
                    to="/dashboard/classes"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <BookOpen size={16} />
                    {!collapsed && "Sinflar"}
                </NavLink>

                <NavLink
                    to="/dashboard/students"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <GraduationCap size={16} />
                    {!collapsed && "Talabalar"}
                </NavLink>

                <NavLink
                    to="/dashboard/gifts"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <Gift size={16} />
                    {!collapsed && "Sovg'alar"}
                </NavLink>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${isActive ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`
                    }
                >
                    <Settings size={16} />
                    {!collapsed && "Boshqarish"}
                </NavLink>

            </nav>

            {!collapsed && (
                <div className="mx-3 mb-4 p-3 rounded-2xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <ClipboardList size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[12px] font-semibold text-gray-700">Obuna</p>
                            <p className="text-[11px] text-orange-500">Obunangiz tugagan</p>
                        </div>
                    </div>
                    <button className="w-full py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1">
                        <Zap size={12} />
                        Obunani yangilash
                    </button>
                </div>
            )}

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:text-violet-600 text-gray-400 transition-colors"
            >
                <ChevronLeft
                    size={14}
                    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                />
            </button>
        </aside>
    )
}
