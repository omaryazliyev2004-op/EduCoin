import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft, CheckCircle2, Clock, XCircle, Search, MoreHorizontal, FileText } from "lucide-react"
import { CircularProgress } from "@mui/material"
import api from "../api"

const TABS = [
    { key: "PENDING", label: "Kutayotganlar", color: "text-amber-600 bg-amber-50" },
    { key: "REJECTED", label: "Qaytarilganlar", color: "text-red-600 bg-red-50" },
    { key: "ACCEPTED", label: "Qabul qilinganlar", color: "text-emerald-600 bg-emerald-50" },
    { key: "CHECKED", label: "Bajarilmagan", color: "text-gray-600 bg-gray-50" }
]

function fmtDateTime(d) {
    if (!d) return "—"
    const date = new Date(d)
    if (isNaN(date.getTime())) return String(d)
    return date.toLocaleString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    }).replace(",", "")
}

export default function ExamChecking() {
    const { id, examId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const initialExam = location.state?.exam || null

    const [activeTab, setActiveTab] = useState("PENDING")
    const [results, setResults] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [examMeta, setExamMeta] = useState(initialExam || { topic: "Imtihon", endAt: null })

    useEffect(() => {
        fetchResults()
        fetchStudents()
        if (!initialExam) {
            fetchExamMeta()
        }
    }, [id, examId])

    function listOf(value) {
        if (Array.isArray(value)) return value
        if (Array.isArray(value?.results)) return value.results
        if (Array.isArray(value?.data?.results)) return value.data.results
        if (Array.isArray(value?.data)) return value.data
        if (Array.isArray(value?.data?.data)) return value.data.data
        if (Array.isArray(value?.students)) return value.students
        return []
    }

    const fetchExamMeta = async () => {
        try {
            const res = await api.get(`/exams/group/${id}`)
            const list = listOf(res.data)
            const current = list.find(x => String(x.id) === String(examId))
            if (current) {
                setExamMeta({
                    topic: current.lesson?.topic || current.description || current.title || "Imtihon",
                    endAt: current.deadline || null
                })
            }
        } catch (err) {
            console.error("Failed to load exam meta:", err)
        }
    }

    const fetchResults = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await api.get(`/group/${id}/exams/${examId}/results`)
            setResults(listOf(res.data))
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || "Ma'lumotlarni yuklashda xatolik"
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const fetchStudents = async () => {
        try {
            const res = await api.get(`/group/${id}/students`)
            setStudents(listOf(res.data))
        } catch (err) {
            console.error("Guruh talabalarini yuklashda xato:", err)
        }
    }

    const getFilteredResults = () => {
        if (activeTab === "CHECKED") {
            const submittedIds = results.map(r => String(r.student?.id || r.student_id))
            const notSubmitted = students.filter(s => !submittedIds.includes(String(s.id)))
            return notSubmitted.map(s => ({
                id: `not_${s.id}`,
                isNotSubmitted: true,
                student: s,
                created_at: null,
                updated_at: null,
                grade: null
            }))
        }
        
        return results.filter(r => (r.status || "PENDING") === activeTab)
    }

    const filtered = getFilteredResults()

    const getCounts = () => {
        const counts = { PENDING: 0, ACCEPTED: 0, REJECTED: 0, CHECKED: 0 }
        results.forEach(r => {
            const st = r.status || "PENDING"
            if (counts[st] !== undefined) counts[st]++
        })
        const submittedIds = results.map(r => String(r.student?.id || r.student_id))
        counts.CHECKED = students.length - submittedIds.length
        return counts
    }

    const counts = getCounts()

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <CircularProgress sx={{ color: "#10b981" }} />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <button
                onClick={() => navigate("/dashboard")}
                className="mb-6 flex items-center gap-2 text-[16px] font-extrabold text-[#111827] hover:text-gray-600 transition"
            >
                <ChevronLeft size={20} />
                {examMeta.topic}
            </button>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-gray-100 p-6 bg-[#fafbfe]">
                    <div>
                        <p className="text-[13.5px] font-bold text-gray-400 mb-1">Mavzu</p>
                        <h3 className="text-[16px] font-extrabold text-[#1f2937]">{examMeta.topic}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[13.5px] font-bold text-gray-400 mb-1">Tugash vaqti</p>
                        <p className="text-[16px] font-extrabold text-[#1f2937]">{fmtDateTime(examMeta.endAt)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-6 py-4">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-bold transition-all ${
                                activeTab === tab.key 
                                ? tab.color + " shadow-sm ring-1 ring-black/5" 
                                : "bg-transparent text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            {tab.key === "PENDING" && <Clock size={16} />}
                            {tab.key === "ACCEPTED" && <CheckCircle2 size={16} />}
                            {tab.key === "REJECTED" && <XCircle size={16} />}
                            {tab.key === "CHECKED" && <FileText size={16} />}
                            {tab.label}
                            <span className={`ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[12px] ${
                                activeTab === tab.key ? "bg-white/80 text-current" : "bg-gray-100 text-gray-400"
                            }`}>
                                {counts[tab.key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6">
                    {error ? (
                        <div className="rounded-xl bg-red-50 p-4 text-[14.5px] font-bold text-red-600 border border-red-100">
                            {error}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                <Search size={28} className="text-gray-300" />
                            </div>
                            <h3 className="mb-1 text-[16px] font-bold text-[#1f2937]">Ma'lumot topilmadi</h3>
                            <p className="text-[14px] font-medium text-gray-400">
                                Ushbu bo'limda hozircha o'quvchilar ro'yxati bo'sh.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[14px]">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400">
                                        <th className="pb-3 font-bold">O'quvchi ismi</th>
                                        <th className="pb-3 font-bold">Topshirilgan vaqti</th>
                                        <th className="pb-3 font-bold">Tekshirilgan vaqti</th>
                                        <th className="pb-3 font-bold">Ball</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(row => {
                                        const st = row.student || {}
                                        const stId = st.id || row.student_id
                                        const name = st.full_name || st.name || row.student_name || "Noma'lum"
                                        
                                        return (
                                            <tr key={row.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                                                <td className="py-4 font-bold text-[#1f2937]">
                                                    {row.isNotSubmitted ? (
                                                        <span>{name}</span>
                                                    ) : (
                                                        <button 
                                                            onClick={() => navigate(`/dashboard/groups/${id}/exams/${examId}/student/${stId}/review`, { state: { exam: examMeta } })}
                                                            className="text-blue-600 hover:text-blue-700 hover:underline transition-all"
                                                        >
                                                            {name}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="py-4 font-medium text-gray-500">
                                                    {row.isNotSubmitted ? "—" : fmtDateTime(row.created_at)}
                                                </td>
                                                <td className="py-4 font-medium text-gray-500">
                                                    {row.isNotSubmitted || !row.updated_at || row.updated_at === row.created_at ? "—" : fmtDateTime(row.updated_at)}
                                                </td>
                                                <td className="py-4 font-extrabold">
                                                    {row.isNotSubmitted ? (
                                                        <span className="text-gray-400">—</span>
                                                    ) : row.grade !== null && row.grade !== undefined ? (
                                                        <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-max">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                                            {row.grade}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
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
