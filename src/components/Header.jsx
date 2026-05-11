import { Search, Bell } from "lucide-react"

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 w-60">
                <Search size={14} className="text-gray-400" />
                <input className="text-[13px] w-full outline-none text-black" placeholder="Qidirish..." />
            </div>
            <div className="flex items-center gap-3">
                <select className="text-[12px] px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none">
                    <option>O'zbekcha</option>
                    <option>Русский</option>
                    <option>English</option>
                </select>
                <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <Bell size={16} className="text-gray-500" />
                </button>
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white text-[13px] font-bold cursor-pointer">
                    C
                </div>
            </div>
        </header>
    )
}