import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft, Info, Mic } from "lucide-react"
import { Slider, Alert, CircularProgress, Snackbar } from "@mui/material"
import { styled } from "@mui/material/styles"
import api from "../api"

const CustomSlider = styled(Slider)({
    color: '#ff4b55',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#ff4b55',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&::before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#e5e7eb',
        height: 8,
        width: 1,
        '&.MuiSlider-markActive': {
            opacity: 1,
            backgroundColor: '#ff4b55',
        },
    },
    '& .MuiSlider-markLabel': {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#9ca3af',
        marginTop: 4,
    }
})

const parseLinks = (text) => {
    if (!text) return []
    // Oddiy split qilish, agar qatorlarga bo'lingan bo'lsa
    if (Array.isArray(text)) return text
    return text.split('\n').filter(Boolean)
}

const formatDateTime = (value) => {
    if (!value) return "—"
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).replace(",", "")
}

export default function TaskReview() {
    const { id, taskType, taskId, studentId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [score, setScore] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [toast, setToast] = useState({ open: false, message: "", severity: "success" })

    const showToast = (message, severity = "success") => {
        setToast({ open: true, message, severity })
    }

    // Data states
    const [taskInfo, setTaskInfo] = useState({ topic: "", links: [] })
    const [studentInfo, setStudentInfo] = useState({
        name: "", time: "", filesCount: 0, status: "Kutayabti", submittedLinks: []
    })

    const isExam = taskType === "exams"

    useEffect(() => {
        if (isExam) {
            // MOCK DATA FOR EXAM
            setTaskInfo({
                topic: "crm loyihasi",
                links: ["1. backend github link", "2. frontend github link"]
            })
            setStudentInfo({
                name: "Rahmonbergan Otabek o'g'li Mahmudov",
                time: "22 May, 2026 09:32",
                filesCount: 0,
                status: "Kutayabti",
                submittedLinks: [
                    "1. https://github.com/uzbboos34-blip/CRM-Backend",
                    "2. https://github.com/uzbboos34-blip/CRM-Frontent",
                    "3. https://7-oy-xuep.vercel.app/login"
                ]
            })
            setLoading(false)
        } else {
            // REAL API FOR HOMEWORK
            fetchHomeworkData()
        }
    }, [id, taskType, taskId, studentId])

    const fetchHomeworkData = async () => {
        try {
            setLoading(true)
            setError("")

            // 1. Homework mavzu
            const hwMeta = location.state?.homework || null
            if (hwMeta?.topic) {
                setTaskInfo({ topic: hwMeta.topic, links: [] })
            } else {
                try {
                    const hwRes = await api.get(`/group/${id}/homework`)
                    const hwList = Array.isArray(hwRes.data) ? hwRes.data
                        : hwRes.data?.data || []
                    const hw = hwList.find(h => Number(h.id) === Number(taskId))
                    if (hw) setTaskInfo({ topic: hw.topic || "Uyga vazifa", links: [] })
                } catch (_) {
                    setTaskInfo({ topic: "Uyga vazifa", links: [] })
                }
            }

            // 2. Bitta o'quvchi natijasi — to'g'ri endpoint
            const res = await api.get(`/group/${id}/homework/${taskId}/result/${studentId}`)
            const studentResult = res.data?.data || res.data

            console.log("[TaskReview] studentResult:", studentResult) // barcha fieldlarni ko'rish uchun

            if (studentResult) {
                const sObj = studentResult.student || studentResult
                const name = sObj?.full_name || sObj?.name ||
                    (sObj?.first_name ? `${sObj.first_name} ${sObj.last_name || ""}`.trim() : "Noma'lum")

                // Barcha mumkin bo'lgan vaqt fieldlari
                const time = formatDateTime(
                    studentResult.created_at ||
                    studentResult.submitted_at ||
                    studentResult.send_at ||
                    studentResult.sended_at ||
                    studentResult.createdAt ||
                    studentResult.updatedAt ||
                    null
                )

                const files = studentResult.files || studentResult.attachments || []
                const rawLinks = studentResult.comment || studentResult.links ||
                    studentResult.file_url || studentResult.description || ""
                const rawStatus = (studentResult.status || "PENDING").toUpperCase()
                const statusLabel = rawStatus === "PENDING" ? "Kutayabti"
                    : rawStatus === "ACCEPTED" ? "Qabul qilingan"
                        : rawStatus === "REJECTED" ? "Qaytarilgan"
                            : rawStatus

                setStudentInfo({
                    name,
                    time,
                    filesCount: files.length,
                    status: statusLabel,
                    submittedLinks: parseLinks(rawLinks)
                })

                if (studentResult.grade !== undefined && studentResult.grade !== null) {
                    setScore(Number(studentResult.grade))
                }
            } else {
                setError("O'quvchi tomonidan yuborilgan javob topilmadi.")
            }
        } catch (err) {
            console.error(err)
            setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
        } finally {
            setLoading(false)
        }
    }

    const marks = [
        { value: 0, label: '0' },
        { value: 100, label: '100' },
    ]

    const handleSubmit = async () => {
        if (isExam) {
            setSubmitting(true)
            setTimeout(() => {
                showToast(score >= 60 ? `Imtihon muvaffaqiyatli baholandi! Ball: ${score}` : `Imtihon qaytarildi. Ball: ${score}`, score >= 60 ? "success" : "warning")
                setTimeout(() => navigate(-1), 1200)
            }, 800)
            return
        }

        setSubmitting(true)
        try {
            await api.post(`/group/${id}/homework/${taskId}/check`, {
                studentId: Number(studentId),
                ball: score,
                comment: feedback
            })
            showToast(score >= 60 ? "Vazifa muvaffaqiyatli qabul qilindi!" : "Vazifa qaytarildi.", score >= 60 ? "success" : "warning")
            setTimeout(() => navigate(-1), 1200)
        } catch (err) {
            console.error(err)
            showToast("Baholashda xatolik yuz berdi", "error")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafbfe]">
                <CircularProgress sx={{ color: "#7c3aed" }} />
            </div>
        )
    }

    const typeTitle = isExam ? "Imtihon" : "Uyga vazifa"

    return (
        <div className="min-h-screen bg-[#fafbfe] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-5">
                <div className="flex items-center gap-2 text-[14px] font-bold">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-violet-600 cursor-pointer transition-colors"
                    >
                        Kutayotganlar
                    </button>
                    <span className="text-gray-300">&gt;</span>
                    <span className="text-[#1f2937]">{typeTitle}</span>
                </div>
            </div>

            <div className="px-6 py-8 max-w-4xl">
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                {/* Task Info Block */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                    <h3 className="text-[17px] font-bold text-[#1f2937] mb-4">{typeTitle} vazifasi</h3>
                    <div className="bg-[#fafbfe] rounded-xl border border-gray-100 p-5">
                        <p className="text-[12.5px] font-semibold text-gray-400 mb-1">{typeTitle} izohi:</p>
                        <p className="text-[15px] font-bold text-[#1f2937] mb-4">{taskInfo.topic}</p>

                        {taskInfo.links?.length > 0 && (
                            <div className="space-y-1">
                                {taskInfo.links.map((link, idx) => (
                                    <p key={idx} className="text-[14px] font-bold text-[#1f2937]">{link}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Info Block */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                    <h3 className="text-[17px] font-bold text-[#1f2937] mb-4">{studentInfo.name}</h3>
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-400">Vaqti:</span>
                            <span className="text-[14px] font-bold text-[#1f2937]">{studentInfo.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-400">Fayllar soni:</span>
                            <span className="text-[14px] font-bold text-[#1f2937]">{studentInfo.filesCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-400">Status:</span>
                            <span className="bg-amber-100 text-amber-600 text-[12px] font-bold px-2.5 py-0.5 rounded-full">
                                {studentInfo.status}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#fafbfe] rounded-xl border border-gray-100 p-5">
                        <p className="text-[12.5px] font-semibold text-gray-400 mb-2">{typeTitle} izohi:</p>
                        <div className="space-y-1.5">
                            {studentInfo.submittedLinks.length > 0 ? (
                                studentInfo.submittedLinks.map((link, idx) => {
                                    // Make links clickable if they start with http
                                    const isUrl = link.match(/^http/);
                                    return (
                                        <p key={idx} className="text-[14px] font-medium text-gray-600 break-words">
                                            {isUrl ? <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a> : link}
                                        </p>
                                    )
                                })
                            ) : (
                                <p className="text-[14px] font-medium text-gray-500">Hech qanday havola yuborilmagan.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Evaluation Block */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    {/* Alert */}
                    <div className="flex items-start gap-3 bg-[#f0f4ff] border border-[#dbeafe] rounded-xl p-4 mb-8">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Info size={13} className="text-white" />
                        </div>
                        <p className="text-[14px] font-medium text-blue-700 leading-relaxed">
                            60-100 oralig'ida ball qo'yilgan vazifa 'Qabul qilingan', 0-59 oralig'ida ball qo'yilgan vazifa 'Qaytarilgan' hisoblanadi.
                        </p>
                    </div>

                    {/* Score Slider */}
                    <div className="mb-10 px-2">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[16px] font-extrabold text-[#1f2937]">Ball</span>
                            <div className={`border text-[16px] font-bold px-4 py-1.5 rounded-xl ${score >= 60 ? "border-emerald-200 bg-emerald-50 text-emerald-500" : "border-red-200 bg-red-50 text-red-500"
                                }`}>
                                {score}
                            </div>
                        </div>

                        <div className="relative">
                            <CustomSlider
                                value={score}
                                onChange={(e, val) => setScore(val)}
                                valueLabelDisplay="auto"
                                marks={marks}
                                min={0}
                                max={100}
                                sx={{
                                    color: score >= 60 ? '#10b981' : '#ff4b55',
                                    '& .MuiSlider-valueLabel': {
                                        backgroundColor: score >= 60 ? '#10b981' : '#ff4b55',
                                    },
                                    '& .MuiSlider-mark.MuiSlider-markActive': {
                                        backgroundColor: score >= 60 ? '#10b981' : '#ff4b55',
                                    }
                                }}
                            />
                            {/* Passing score marker (60) */}
                            <div className="absolute top-[28px] left-[60%] -translate-x-1/2">
                                <span className="bg-gray-100 text-gray-500 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-200">
                                    O'tish balli: 60
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div className="mb-8 relative">
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Izohingiz"
                            rows={4}
                            className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-[14.5px] text-[#1f2937] placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all resize-none"
                        />
                        <button className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors shadow-md ${score >= 60 ? "bg-[#10b981] hover:bg-[#059669] shadow-emerald-200" : "bg-[#ff4b55] hover:bg-red-600 shadow-red-200"
                            }`}>
                            <Mic size={18} />
                        </button>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-[14.5px] font-bold hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`px-8 py-3 rounded-xl text-white text-[14.5px] font-bold transition-colors shadow-lg ${score >= 60
                                ? "bg-[#10b981] hover:bg-[#059669] shadow-emerald-200"
                                : "bg-[#ff4b55] hover:bg-[#dc2626] shadow-red-200"
                                } disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                            {submitting && <CircularProgress size={16} color="inherit" />}
                            {score >= 60 ? "Qabul qilish" : "Qaytarish"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToast(prev => ({ ...prev, open: false }))}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ minWidth: 300, borderRadius: "14px", fontWeight: 700, fontSize: "14px" }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
