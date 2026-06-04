import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { Alert, CircularProgress } from "@mui/material"
import api from "../api"




const TABS = [
    { key: "PENDING", label: "Kutayotganlar" },
    { key: "REJECTED", label: "Qaytarilganlar" },
    { key: "ACCEPTED", label: "Qabul qilinganlar" },
    { key: "NOT_SUBMITTED", label: "Bajarilmagan" }, // We'll map "CHECKED" or missing here
]

export default function HomeworkChecking() {
    const { id, homeworkId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const homework = location.state?.homework || {}

    const [activeTab, setActiveTab] = useState("PENDING")
    const [results, setResults] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchResults()
        fetchStudents()
    }, [id, homeworkId])

    function listOf(value) {
        if (Array.isArray(value)) return value
        if (Array.isArray(value?.data)) return value.data
        if (Array.isArray(value?.data?.data)) return value.data.data
        if (Array.isArray(value?.results)) return value.results
        if (Array.isArray(value?.data?.results)) return value.data.results
        if (Array.isArray(value?.students)) return value.students
        return []
    }

    const fetchResults = async () => {
        setLoading(true)
        setError("")
        try {
            // Faqat bitta so'rov
            const res = await api.get(`/group/${id}/homework/${homeworkId}/results`)
            const list = listOf(res.data)
            console.log("Homework results:", list)
            setResults(list)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Natijalarni yuklashda xatolik.")
        } finally {
            setLoading(false)
        }
    }

    const fetchStudents = async () => {
        try {
            console.log("Fetching students for group ID:", id);
            const res = await api.get(`/groups/one/students/${id}`)
            console.log("Students API Response 1:", res.data);
            setStudents(listOf(res.data))
        } catch (err) {
            console.error("Failed to fetch /groups/one/students:", err)
            // fallback
            api.get("/students").then(res => {
                console.log("Students API Response 2 (fallback):", res.data);
                const list = listOf(res.data)
                const filtered = list.filter(s => {
                    const sGroups = s.groups || []
                    return sGroups.some(g => Number(g?.id || g) === Number(id))
                })
                setStudents(filtered)
            }).catch(e => console.error("Fallback students fetch failed:", e))
        }
    }

    const fmtDateTime = (value) => {
        if (!value) return "—"
        const d = new Date(value)
        if (isNaN(d.getTime())) return String(value)
        return d.toLocaleString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        }).replace(",", "") // e.g., 15 May 2026 07:10
    }

    const getNotSubmittedStudents = () => {
        const submittedStudentIds = new Set(results.map(r => r.student?.id || r.student_id))
        return students
            .filter(s => !submittedStudentIds.has(s.id))
            .map(s => ({
                id: `ns-${s.id}`,
                student: s,
                status: "NOT_SUBMITTED",
                created_at: null
            }))
    }

    // Filter results based on active tab
    const filteredResults = activeTab === "NOT_SUBMITTED"
        ? getNotSubmittedStudents()
        : results.filter((r) => {
            const s = (r.status || "").toUpperCase();
            if (activeTab === "PENDING") return s === "PENDING"
            if (activeTab === "REJECTED") return s === "REJECTED"
            if (activeTab === "ACCEPTED") return s === "ACCEPTED" || s === "CHECKED"
            return true
        })

    const getCount = (tabKey) => {
        if (tabKey === "NOT_SUBMITTED") return getNotSubmittedStudents().length;

        return results.filter((r) => {
            const s = (r.status || "").toUpperCase();
            if (tabKey === "PENDING") return s === "PENDING"
            if (tabKey === "REJECTED") return s === "REJECTED"
            if (tabKey === "ACCEPTED") return s === "ACCEPTED" || s === "CHECKED"
            return true
        }).length
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-[16px] font-extrabold text-[#111827] hover:text-gray-600 transition"
            >
                <ChevronLeft size={20} />
                {homework.topic || "crm backend homework checking"}
            </button>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-gray-100 p-6 bg-[#fafbfe]">
                    <div>
                        <p className="text-[13.5px] font-bold text-gray-400 mb-1">Mavzu</p>
                        <h3 className="text-[16px] font-extrabold text-[#1f2937]">{homework.topic || "crm backend homework checking"}</h3>
                    </div>
                    <div>
                        <p className="text-[13.5px] font-bold text-gray-400 mb-1">Tugash vaqti</p>
                        <p className="text-[16px] font-extrabold text-[#1f2937]">{fmtDateTime(homework.endAt) || "15 May, 2026 07:10"}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-100 px-6 pt-4 bg-white">
                    {TABS.map((tab) => {
                        const count = getCount(tab.key)
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 border-b-2 pb-4 text-[14.5px] font-bold transition-all ${activeTab === tab.key
                                        ? "border-[#10b981] text-[#1f2937]"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className={`inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[12px] font-extrabold ${tab.key === "PENDING" ? "bg-amber-400 text-gray-900" :
                                            tab.key === "NOT_SUBMITTED" ? "bg-amber-400 text-gray-900" :
                                                "bg-emerald-500 text-white"
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Table */}
                <div className="p-6 bg-white min-h-[400px]">
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <CircularProgress sx={{ color: "#10b981" }} size={36} />
                        </div>
                    ) : error ? (
                        <Alert severity="error" className="rounded-xl font-medium">{error}</Alert>
                    ) : filteredResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 size={48} className="text-gray-200 mb-4" />
                            <p className="text-[16.5px] font-bold text-gray-500">Bu bo'limda ma'lumot topilmadi</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-[14.5px] font-bold text-gray-400">
                                        <th className="px-4 py-3 pb-4">O'quvchi ismi</th>
                                        <th className="px-4 py-3 pb-4">Topshirilgan vaqt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map((row, idx) => {
                                        const sId = row.student?.id || row.student_id;
                                        return (
                                            <tr
                                                key={row.id || idx}
                                                onClick={() => {
                                                    if (sId) {
                                                        navigate(`/dashboard/groups/${id}/homework/${homeworkId}/student/${sId}/review`, {
                                                            state: {
                                                                studentName: row.student?.full_name || row.student_name,
                                                                homeworkTitle: homework.topic || "crm backend homework checking"
                                                            }
                                                        })
                                                    }
                                                }}
                                                className="border-b border-gray-50 text-[15px] font-semibold text-[#1f2937] transition hover:bg-gray-50/50 cursor-pointer"
                                            >
                                                <td className="px-4 py-4">{row.student?.full_name || row.student_name || "—"}</td>
                                                <td className="px-4 py-4">{fmtDateTime(row.created_at || row.submitted_at)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
