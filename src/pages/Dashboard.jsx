import { useState } from "react"
import { BookOpen, GraduationCap, Gift, Users, ChevronDown } from "lucide-react"

export default function Dashboard() {
  const [open, setOpen] = useState(false)

  const stats = [
    { icon: BookOpen, label: "Sinflar", value: 0 },
    { icon: BookOpen, label: "Fanlar", value: 0 },
    { icon: GraduationCap, label: "Talabalar", value: 1 },
    { icon: Gift, label: "Sovg'alar", value: 3 },
    { icon: Users, label: "O'qituvchilar", value: 0 },
  ]

  return (
    <div>
      <h1 className="text-[22px] font-bold text-[#1a1a2e]">Salom, creator! 👋</h1>
      <p className="text-[13px] text-gray-500 mt-1 mb-6">EduCoin platformasiga xush kelibsiz!</p>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Icon size={20} className="text-violet-500" />
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-500 mb-1">{label}</p>
              <p className="text-[22px] font-bold text-[#1a1a2e]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div
          onClick={() => setOpen(!open)}
          className="bg-white px-6 py-4 flex items-center justify-between cursor-pointer"
        >
          <span className="text-[14px] font-semibold text-[#1a1a2e]">Dars Jadvali</span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
        <div
          className={`px-6 py-4 bg-gray-50 text-sm text-gray-600 transition-all duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          Dars malumotlari
        </div>
      </div>
    </div>
  )
}