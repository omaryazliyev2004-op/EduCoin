import { useState, useEffect } from "react"
import { GraduationCap, Users, CreditCard, AlertTriangle, Snowflake, Archive, ChevronDown } from "lucide-react"
import api from "../api"

export default function Dashboard() {
  const [openSections, setOpenSections] = useState({
    payments: false,
    profit: false,
    schedule: false,
  })

  // We can keep the state for actual data if we want, but for now we will 
  // initialize with the values from the image to match exactly.
  const [statsData, setStatsData] = useState({
    activeStudents: 9,
    groups: 7,
    currentMonthPayments: 0,
    debtors: 104,
    frozen: 0,
    archived: 23
  })

  // Optionally fetch real data if available in the future
  /*
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [groupsRes, studentsRes] = await Promise.all([
          api.get("/groups/all").catch(() => ({ data: { data: [] } })),
          api.get("/students").catch(() => ({ data: { data: [] } })),
        ])

        setStatsData(prev => ({
          ...prev,
          groups: groupsRes.data?.data?.length || prev.groups,
          activeStudents: studentsRes.data?.data?.length || prev.activeStudents,
        }))
      } catch (err) {
        console.error("Dashboard statistikalarini yuklashda xatolik:", err)
      }
    }

    fetchStats()
  }, [])
  */

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const stats = [
    { icon: GraduationCap, label: "Faol talabalar", value: statsData.activeStudents },
    { icon: Users, label: "Guruhlar", value: statsData.groups },
    { icon: CreditCard, label: "Joriy oy to'lovlar", value: statsData.currentMonthPayments },
    { icon: AlertTriangle, label: "Qarzdorlar", value: statsData.debtors },
    { icon: Snowflake, label: "Muzlatilganlar", value: statsData.frozen },
    { icon: Archive, label: "Arxivdagilar", value: statsData.archived },
  ]

  const accordions = [
    { id: 'payments', title: "Joriy oy uchun to'lovlar" },
    { id: 'profit', title: "Yillik Foyda" },
    { id: 'schedule', title: "Dars jadvali" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-[10px] p-5 flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <Icon size={24} className="text-[#6C5CE7]" />
            <div className="text-center w-full">
              <p className="text-[13px] text-gray-500 mb-2 truncate px-1">{label}</p>
              <p className="text-[22px] font-bold text-[#1a1a2e]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accordions */}
      <div className="flex flex-col gap-4">
        {accordions.map((item) => (
          <div key={item.id} className="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div
              onClick={() => toggleSection(item.id)}
              className="px-6 py-4 flex items-center justify-between cursor-pointer"
            >
              <span className="text-[14px] font-bold text-[#1a1a2e]">{item.title}</span>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform duration-300 ${openSections[item.id] ? "rotate-180" : ""}`}
              />
            </div>
            <div
              className={`px-6 text-[14px] text-gray-600 transition-all duration-300 ${
                openSections[item.id] ? "py-4 border-t border-gray-100 max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              Ma'lumotlar bu yerda bo'ladi...
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}