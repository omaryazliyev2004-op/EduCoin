import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
    Alert,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
    Snackbar,
} from "@mui/material"
import {
    ArrowLeft,
    BarChart3,
    X,
    Users,
    Clock,
    CheckCircle2,
    MoreVertical,
    BookOpen,
    Video,
    FileText,
    ClipboardList,
    Plus,
    PlayCircle,
    HardDrive,
    Trash2,
    Pencil,
    ChevronLeft,
    ChevronRight,
    Lock,
    UserCheck,
    Eye,
    EyeOff,
    TrendingUp,
} from "lucide-react"
import api from "../api"

/* ─────────────── helpers ─────────────── */
function unwrap(payload) {
    return payload?.data?.data || payload?.data || payload || {}
}
function listOf(value) {
    if (Array.isArray(value)) return value
    if (Array.isArray(value?.data)) return value.data
    if (Array.isArray(value?.data?.data)) return value.data.data
    return []
}
function formatDays(days) {
    const map = {
        MONDAY: "Du", TUESDAY: "Se", WEDNESDAY: "Chor",
        THURSDAY: "Pay", FRIDAY: "Ju", SATURDAY: "Shan", SUNDAY: "Yak",
    }
    if (!Array.isArray(days)) return "—"
    return days.map((d) => map[d] || d).join(", ")
}
function fmtDateTime(value) {
    if (!value) return "—"
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleString("uz-UZ", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}
function fmtDate(value) {
    if (!value) return "—"
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString("uz-UZ", {
        day: "numeric", month: "short", year: "numeric",
    })
}
function fmtSize(bytes) {
    if (!bytes || bytes === 0) return "—"
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB"
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB"
    return bytes + " B"
}
function normalizeGroup(raw) {
    const g = unwrap(raw)
    return {
        id: g.id,
        name: g.name || "Guruh",
        active: g.status ? g.status !== "ARCHIVE" : true,
        course: g.course?.name || "Kurs yo'q",
        averageAge: g.average_age || 21,
        capacity: g.max_student || g.room?.capacity || 20,
        studentsCount: g.students_count || (g.students || []).length || 0,
        lessonsInMonth: g.lessons_in_month || 20,
        duration: g.course?.duration_month || g.duration_month || 6,
        totalLessons: g.total_lessons || 20,
        teachers: g.teachers || [],
        startTime: g.start_time || "09:00",
        days: formatDays(g.week_day),
        room: g.room?.name || "—",
        startDate: g.start_date || null,
    }
}

const LESSON_TABS = [
    { key: "homework",  label: "Uyga vazifa", icon: BookOpen,     endpoint: (id) => `/homework/${id}` },
    { key: "video",     label: "Videolar",    icon: Video,         endpoint: (id) => `/files/${id}` },
    { key: "exam",      label: "Imtihonlar",  icon: FileText,      endpoint: null },
    { key: "journal",   label: "Jurnal",      icon: ClipboardList, endpoint: (id) => `/lessons/my/group/${id}` },
]

/* ─────────────── Mock Exam Data ─────────────── */
function generateMockExams() {
    return [
        {
            id: 1,
            topic: "React JS asoslari va React Router bilan ishlash",
            studentsCount: 15,
            failedCount: 3,
            status: "Faol",
            lessonDate: "2026-05-28T14:00:00",
            givenAt: "2026-05-30T10:00:00",
            publishedAt: "2026-06-15T18:00:00",
            students: [
                { id: 1, name: "Dilshodbek O'ktamjon o'g'li Tokhirov",  submittedAt: "2026-04-24T12:56:00", checkedAt: "2026-04-27T10:30:00", grade: 65,  status: "checked" },
                { id: 2, name: "Rahmonbergan Otabek o'g'li Mahmudov",    submittedAt: "2026-04-24T10:42:00", checkedAt: "2026-04-24T11:32:00", grade: 85,  status: "checked" },
                { id: 3, name: "Mirsaid Abduqulov",                       submittedAt: "2026-04-24T11:59:00", checkedAt: "2026-04-24T14:50:00", grade: 70,  status: "checked" },
                { id: 4, name: "Oydin Kamolovna Qalandarova",             submittedAt: "2026-04-24T09:27:00", checkedAt: "2026-04-29T12:17:00", grade: 100, status: "checked" },
                { id: 5, name: "Guliza Ayitqulova",                       submittedAt: "2026-04-24T12:41:00", checkedAt: "2026-04-24T14:40:00", grade: 70,  status: "checked" },
                { id: 6, name: "Nozima Abdugapparova",                    submittedAt: "2026-04-24T09:27:00", checkedAt: "2026-04-24T09:47:00", grade: 85,  status: "checked" },
                { id: 7, name: "Sardor Mirzayev",                         submittedAt: "2026-04-25T08:10:00", checkedAt: null,                  grade: null, status: "pending" },
                { id: 8, name: "Kamola Yusupova",                         submittedAt: null,                  checkedAt: null,                  grade: null, status: "waiting" },
                { id: 9, name: "Jasur Toshmatov",                         submittedAt: null,                  checkedAt: null,                  grade: null, status: "waiting" },
                { id: 10, name: "Nilufar Ergasheva",                      submittedAt: "2026-04-24T13:00:00", checkedAt: "2026-04-25T09:00:00",  grade: null, status: "rejected" },
                { id: 11, name: "Bobur Xolmatov",                         submittedAt: null,                  checkedAt: null,                  grade: null, status: "notdone" },
                { id: 12, name: "Zulfiya Hasanova",                       submittedAt: null,                  checkedAt: null,                  grade: null, status: "notdone" },
            ],
        },
        {
            id: 2,
            topic: "JavaScript ES6+ va Async/Await",
            studentsCount: 15,
            failedCount: 1,
            status: "Yakunlangan",
            lessonDate: "2026-04-10T10:00:00",
            givenAt: "2026-04-12T09:00:00",
            publishedAt: "2026-04-30T12:00:00",
            students: [
                { id: 1, name: "Dilshodbek O'ktamjon o'g'li Tokhirov",  submittedAt: "2026-04-13T11:00:00", checkedAt: "2026-04-14T10:00:00", grade: 90,  status: "checked" },
                { id: 2, name: "Rahmonbergan Otabek o'g'li Mahmudov",    submittedAt: "2026-04-13T09:30:00", checkedAt: "2026-04-14T09:00:00", grade: 78,  status: "checked" },
                { id: 7, name: "Sardor Mirzayev",                         submittedAt: "2026-04-14T08:00:00", checkedAt: "2026-04-15T10:00:00", grade: 55,  status: "rejected" },
            ],
        },
    ]
}

function normalizeRow(item, index) {
    return {
        id: item.id ?? index,
        topic: item.topic || item.title || item.name || item.subject || `${index + 1}-mavzu`,
        studentsCount: item.students_count ?? item.student_count ?? item.submissions_count ?? item.participants_count ?? 0,
        viewCount: item.view_count ?? item.views ?? item.watched_count ?? 0,
        doneCount: item.done_count ?? item.completed_count ?? item.passed_count ?? item.checked_count ?? 0,
        givenAt: item.start_date || item.given_at || item.started_at || item.created_at || null,
        endAt: item.end_date || item.deadline || item.finish_date || item.ended_at || null,
        lessonDate: item.lesson_date || item.date || item.schedule_date || null,
    }
}

const BASE_URL = "https://najot-edu.softwareengineer.uz"

function toAbsoluteMediaUrl(value) {
    if (!value || typeof value !== "string") return null
    if (value.startsWith("blob:")) return value
    if (value.startsWith("http")) return value
    // Ensure /files/files/ prefix for file paths that are just filenames
    const clean = value.replace(/^\/+/, "")
    // If it's just a filename (no slashes), wrap it with files/files/
    if (!clean.includes("/")) {
        return `${BASE_URL}/files/files/${clean}`
    }
    // If it starts with files/ already, keep it as-is
    return `${BASE_URL}/${clean}`
}

function pickFirst(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== "")
}

function normalizeVideoRow(item, index) {
    console.log('[VideoRow raw]', JSON.stringify(item))
    const rawBytes = item.size ?? item.file_size ?? item.video_size ?? item.filesize ?? 0

    const rawUrl = pickFirst(
        item.url,
        item.path,
        typeof item.file === "string" ? item.file : null,
        item.file_path,
        item.filePath,
        item.file_name,
        item.filename,
        item.src,
        item.stream_url,
        item.streamUrl,
        item.file_url,
        item.fileUrl,
        item.video_url,
        item.videoUrl,
        item.download_url,
        item.downloadUrl,
        item.file?.url,
        item.file?.path,
        item.file?.file_url,
        item.file?.video_url,
        item.video?.url,
        item.video?.path
    )

    const fileId = pickFirst(
        item.file_id,
        item.fileId,
        item.file?.id,
        item.video_id,
        item.videoId,
        item.id
    )

    return {
        id: item.id ?? index,
        fileId,
        scheduleId: item.id ?? index,
        directUrl: toAbsoluteMediaUrl(rawUrl),
        rawUrl,
        videoName:
            item.name ?? item.original_name ?? item.filename ??
            item.file_name ?? item.video_name ?? `Video ${index + 1}`,
        lessonName:
            item.topic ?? item.lesson_name ?? item.lesson?.name ??
            item.title ?? item.subject ?? "—",
        status: item.status ?? item.state ?? "tayyor",
        lessonDate: item.lesson_date ?? item.date ?? item.created_at ?? null,
        size: fmtSize(rawBytes),
        uploadedAt: item.created_at ?? item.uploaded_at ?? item.added_at ?? null,
    }
}

/* ─────────────── ExamDetailPage ─────────────── */
function ExamDetailPage({ exam, onClose }) {
    const [activeTab, setActiveTab] = useState("checked")
    if (!exam) return null

    const tabs = [
        { key: "waiting",  label: "Kutayotganlar",    filter: (s) => s.status === "waiting" },
        { key: "rejected", label: "Qaytarilganlar",   filter: (s) => s.status === "rejected" },
        { key: "checked",  label: "Qabul qilinganlar",filter: (s) => s.status === "checked" },
        { key: "notdone",  label: "Bajarilmagan",     filter: (s) => s.status === "notdone" },
    ]

    const currentStudents = exam.students.filter(
        tabs.find(t => t.key === activeTab)?.filter || (() => true)
    )

    return (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-[22px] font-extrabold text-[#111827]">Examination</h2>
            </div>

            {/* Exam info */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex flex-wrap gap-10">
                    <div>
                        <p className="text-[12px] font-bold text-violet-500 mb-1">Mavzu</p>
                        <p className="text-[15px] font-extrabold text-[#111827]">{exam.topic}</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-bold text-violet-500 mb-1">Imtihon Vaqti</p>
                        <p className="text-[15px] font-extrabold text-[#111827]">
                            {fmtDateTime(exam.givenAt)} – {fmtDateTime(exam.publishedAt)}
                        </p>
                    </div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-gray-200 text-[13.5px] font-bold text-gray-600 hover:bg-gray-50 transition">
                    E'lon qilish
                </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-0 px-6 pt-4 border-b border-gray-100">
                {tabs.map((tab) => {
                    const count = exam.students.filter(tab.filter).length
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2 px-4 py-2.5 text-[14px] font-bold transition-all border-b-2 ${
                                isActive ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold ${
                                    isActive ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500"
                                }`}>{count}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Students Table */}
            <div className="px-6 py-4">
                {currentStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-[15px] font-bold text-gray-400">Bu bo'limda ma'lumot yo'q</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-[13px] font-extrabold text-gray-400 border-b border-gray-100">
                                <th className="text-left py-3 pr-4">O'quvchi ismi</th>
                                <th className="text-left py-3 pr-4 whitespace-nowrap">Topshirilgan vaqti</th>
                                <th className="text-left py-3 pr-4 whitespace-nowrap">Tekshirilgan vaqti</th>
                                <th className="text-left py-3 pr-4">Ball</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((s) => (
                                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition">
                                    <td className="py-3.5 pr-4">
                                        <span className="text-[14.5px] font-semibold text-blue-500 cursor-pointer hover:underline">{s.name}</span>
                                    </td>
                                    <td className="py-3.5 pr-4 text-[14px] font-medium text-gray-600 whitespace-nowrap">
                                        {s.submittedAt ? fmtDateTime(s.submittedAt) : "—"}
                                    </td>
                                    <td className="py-3.5 pr-4 text-[14px] font-medium text-gray-600 whitespace-nowrap">
                                        {s.checkedAt ? fmtDateTime(s.checkedAt) : "—"}
                                    </td>
                                    <td className="py-3.5 pr-4">
                                        {s.grade != null ? (
                                            <span className={`inline-flex items-center gap-1 text-[14.5px] font-extrabold ${
                                                s.grade >= 85 ? "text-emerald-500" : s.grade >= 60 ? "text-amber-500" : "text-red-500"
                                            }`}>
                                                <span>⚡</span>{s.grade}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td className="py-3.5">
                                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition">
                                            <Pencil size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

/* ─────────────── ExamTable ─────────────── */
function ExamTable({ onOpenExam }) {
    const exams = generateMockExams()
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-gray-100 bg-[#fafbfe] text-[14.5px] font-extrabold text-gray-400">
                        <th className="w-[52px] px-6 py-3.5">#</th>
                        <th className="px-4 py-3.5">Mavzu</th>
                        <th className="px-4 py-3.5 text-center"><Tooltip title="Talabalar soni"><span className="inline-flex items-center justify-center"><UserCheck size={14} /></span></Tooltip></th>
                        <th className="px-4 py-3.5 text-center"><Tooltip title="Bajarilmaganlar"><span className="inline-flex items-center justify-center text-red-400"><X size={14} /></span></Tooltip></th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 whitespace-nowrap">Dars vaqti</th>
                        <th className="px-4 py-3.5 whitespace-nowrap">Berilgan vaqt</th>
                        <th className="px-4 py-3.5 whitespace-nowrap">E'lon qilingan vaqti</th>
                        <th className="w-[52px] px-4 py-3.5"></th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam, idx) => (
                        <tr key={exam.id} className="border-b border-gray-50 text-[15px] font-semibold text-[#1f2937] last:border-b-0 hover:bg-violet-50/10 transition cursor-pointer">
                            <td className="px-6 py-4 text-gray-400 font-bold">{idx + 1}</td>
                            <td className="px-4 py-4">
                                <button
                                    onClick={() => onOpenExam(exam)}
                                    className="text-blue-500 font-semibold hover:underline text-left"
                                >
                                    {exam.topic}
                                </button>
                            </td>
                            <td className="px-4 py-4 text-center">
                                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-violet-50 px-1.5 text-[13.5px] font-extrabold text-violet-600">
                                    {exam.studentsCount}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-red-50 px-1.5 text-[13.5px] font-extrabold text-red-500">
                                    {exam.failedCount}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[13px] font-bold ${
                                    exam.status === "Faol" ? "border-emerald-400 text-emerald-500" :
                                    exam.status === "Yakunlangan" ? "border-gray-300 text-gray-500" :
                                    "border-amber-400 text-amber-500"
                                }`}>{exam.status}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDateTime(exam.lessonDate)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDateTime(exam.givenAt)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDateTime(exam.publishedAt)}</td>
                            <td className="px-4 py-4">
                                <IconButton size="small" sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed" } }}>
                                    <MoreVertical size={16} />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/* ─────────────── LessonsTable ─────────────── */
function LessonsTable({ rows, loading, error, onRowClick }) {
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuRow, setMenuRow] = useState(null)

    const openMenu = (e, row) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuRow(row) }
    const closeMenu = () => { setMenuAnchor(null); setMenuRow(null) }

    if (loading) return <div className="flex items-center justify-center py-16"><CircularProgress sx={{ color: "#7c3aed" }} size={36} /></div>
    if (error) return <Alert severity="error" className="mx-6 my-4 rounded-xl">{error}</Alert>
    if (rows.length === 0) return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-[16.5px] font-bold text-gray-500">Ma'lumot topilmadi</p>
            <p className="text-[15.5px] text-gray-400">Hozircha bu bo'limda hech narsa yo'q.</p>
        </div>
    )

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-[#fafbfe] text-[14.5px] font-extrabold text-gray-400">
                            <th className="w-[52px] px-6 py-3.5">#</th>
                            <th className="px-4 py-3.5">Mavzu</th>
                            <th className="px-4 py-3.5 text-center"><Tooltip title="Talabalar soni"><span className="inline-flex items-center justify-center"><Users size={14} /></span></Tooltip></th>
                            <th className="px-4 py-3.5 text-center"><Tooltip title="Ko'rishlar / Topshirishlar"><span className="inline-flex items-center justify-center"><Clock size={14} /></span></Tooltip></th>
                            <th className="px-4 py-3.5 text-center"><Tooltip title="Bajarilganlar"><span className="inline-flex items-center justify-center"><CheckCircle2 size={14} /></span></Tooltip></th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Berligan vaqt</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Tugash vaqti</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Dars sanasi</th>
                            <th className="w-[52px] px-4 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={row.id} onClick={() => onRowClick && onRowClick(row)} className="border-b border-gray-50 text-[15.5px] font-semibold text-[#1f2937] last:border-b-0 transition hover:bg-violet-50/20 cursor-pointer">
                                <td className="px-6 py-4 text-gray-400 font-bold">{idx + 1}</td>
                                <td className="px-4 py-4 font-semibold text-[#1f2937]">{row.topic}</td>
                                <td className="px-4 py-4 text-center"><span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-violet-50 px-1.5 text-[13.5px] font-extrabold text-violet-600">{row.studentsCount}</span></td>
                                <td className="px-4 py-4 text-center"><span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-orange-50 px-1.5 text-[13.5px] font-extrabold text-orange-500">{row.viewCount}</span></td>
                                <td className="px-4 py-4 text-center"><span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-emerald-50 px-1.5 text-[13.5px] font-extrabold text-emerald-600">{row.doneCount}</span></td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDateTime(row.givenAt)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDateTime(row.endAt)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDate(row.lessonDate)}</td>
                                <td className="px-4 py-4">
                                    <IconButton size="small" onClick={(e) => openMenu(e, row)} sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed" } }}>
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} slotProps={{ paper: { sx: { borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6", mt: 0.5, minWidth: 130 } } }}>
                <MenuItem onClick={closeMenu} sx={{ fontSize: "13px", fontWeight: 600, color: "#374151", borderRadius: "8px", mx: 0.5 }}>Ko'rish</MenuItem>
                <MenuItem onClick={closeMenu} sx={{ fontSize: "13px", fontWeight: 600, color: "#374151", borderRadius: "8px", mx: 0.5 }}>Tahrirlash</MenuItem>
                <MenuItem onClick={closeMenu} sx={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", borderRadius: "8px", mx: 0.5, "&:hover": { backgroundColor: "#fef2f2" } }}>O'chirish</MenuItem>
            </Menu>
        </>
    )
}


function VideoTable({ rows, loading, error, onPlayVideo, onDeleteVideo, onAnalytics }) {
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuRow, setMenuRow] = useState(null)

    const openMenu = (e, row) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuRow(row) }
    const closeMenu = () => { setMenuAnchor(null); setMenuRow(null) }

    const statusStyle = (status) => {
        const s = (status || "").toLowerCase()
        if (s === "tayyor" || s === "ready" || s === "done" || s === "completed") return { bg: "bg-emerald-50", text: "text-emerald-600", label: "Tayyor" }
        if (s === "jarayonda" || s === "pending" || s === "processing") return { bg: "bg-amber-50", text: "text-amber-600", label: "Jarayonda" }
        if (s === "xatolik" || s === "error" || s === "failed") return { bg: "bg-red-50", text: "text-red-500", label: "Xatolik" }
        return { bg: "bg-emerald-50", text: "text-emerald-600", label: "Tayyor" }
    }

    if (loading) return <div className="flex items-center justify-center py-16"><CircularProgress sx={{ color: "#7c3aed" }} size={36} /></div>
    if (error) return <Alert severity="error" className="mx-6 my-4 rounded-xl">{error}</Alert>
    if (rows.length === 0) return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-[16.5px] font-bold text-gray-500">Ma'lumot topilmadi</p>
            <p className="text-[15.5px] text-gray-400">Hozircha videolar mavjud emas.</p>
        </div>
    )

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-[#fafbfe] text-[14px] font-extrabold text-gray-400">
                            <th className="w-[52px] px-6 py-3.5">#</th>
                            <th className="px-4 py-3.5 text-blue-500">Video nomi</th>
                            <th className="px-4 py-3.5">Dars nomi</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Dars sanasi</th>
                            <th className="px-4 py-3.5 whitespace-nowrap"><span className="inline-flex items-center gap-1"><HardDrive size={13} />Hajmi</span></th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Qo'shilgan vaqti</th>
                            <th className="w-[52px] px-4 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            const st = statusStyle(row.status)
                            return (
                                <tr key={row.id} onClick={() => onPlayVideo(row)} className="border-b border-gray-50 text-[15px] font-semibold text-[#1f2937] last:border-b-0 transition hover:bg-blue-50/20 cursor-pointer">
                                    <td className="px-6 py-4 text-gray-400 font-bold">{idx + 1}</td>
                                    <td className="px-4 py-4"><span className="inline-flex items-center gap-2 text-blue-500 font-semibold"><PlayCircle size={18} className="shrink-0" /><span className="truncate max-w-[160px]">{row.videoName}</span></span></td>
                                    <td className="px-4 py-4 text-[#1f2937] font-semibold">{row.lessonName}</td>
                                    <td className="px-4 py-4"><span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[13px] font-extrabold ${st.bg} ${st.text}`}>{st.label}</span></td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDate(row.lessonDate)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{row.size}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 font-medium">{fmtDate(row.uploadedAt)}</td>
                                    <td className="px-4 py-4">
                                        <IconButton size="small" onClick={(e) => openMenu(e, row)} sx={{ color: "#9ca3af", "&:hover": { color: "#3b82f6" } }}>
                                            <MoreVertical size={16} />
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} slotProps={{ paper: { sx: { borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6", mt: 0.5, minWidth: 150 } } }}>
                <MenuItem onClick={() => { onPlayVideo(menuRow); closeMenu(); }} sx={{ fontSize: "13px", fontWeight: 600, color: "#374151", borderRadius: "8px", mx: 0.5, display: "flex", gap: "8px", alignItems: "center" }}>
                    <PlayCircle size={14} />Ko'rish
                </MenuItem>
                <MenuItem onClick={() => { onAnalytics(menuRow); closeMenu(); }} sx={{ fontSize: "13px", fontWeight: 600, color: "#6C5CE7", borderRadius: "8px", mx: 0.5, display: "flex", gap: "8px", alignItems: "center" }}>
                    <BarChart3 size={14} />Tahlil
                </MenuItem>
                <MenuItem onClick={() => { onDeleteVideo(menuRow); closeMenu(); }} sx={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", borderRadius: "8px", mx: 0.5, "&:hover": { backgroundColor: "#fef2f2" }, display: "flex", gap: "8px", alignItems: "center" }}>
                    <Trash2 size={14} />O'chirish
                </MenuItem>
            </Menu>
        </>
    )
}

/* ─────────────── VideoAnalyticsModal ─────────────── */
function VideoAnalyticsModal({ isOpen, onClose, video }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!isOpen || !video) return
        setData(null)
        setError("")
        setLoading(true)

        const fileId = video.fileId ?? video.id
        api.get(`/files/${fileId}/analytics`)
            .then((res) => {
                const d = res.data?.data || res.data
                setData(d)
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || "Tahlil ma'lumotlarini yuklashda xatolik."
                setError(msg)
            })
            .finally(() => setLoading(false))
    }, [isOpen, video])

    if (!isOpen || !video) return null

    const students = Array.isArray(data?.students) ? data.students :
                     Array.isArray(data?.views)    ? data.views    :
                     Array.isArray(data)            ? data          : []

    const totalViews   = data?.total_views ?? data?.totalViews ?? students.length
    const watchedCount = students.filter(s => s.watched || s.view_count > 0 || s.status === "watched").length
    const avgPercent   = students.length > 0
        ? Math.round(students.reduce((acc, s) => acc + (s.watch_percent ?? s.percent ?? (s.watched ? 100 : 0)), 0) / students.length)
        : 0

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
            <div className="relative w-full max-w-[700px] max-h-[85vh] flex flex-col rounded-[18px] bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <BarChart3 size={18} className="text-violet-500 shrink-0" />
                        <div>
                            <h3 className="text-[15px] font-extrabold text-[#1a1a2e] truncate max-w-[450px]">{video.videoName}</h3>
                            <p className="text-[12px] text-gray-400 font-medium">Video tahlili</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1.5 rounded-lg hover:bg-gray-100">
                        <X size={16} />
                    </button>
                </div>

                {/* Stats row */}
                {!loading && !error && (
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
                        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 border border-gray-100 shadow-sm">
                            <span className="text-[22px] font-extrabold text-blue-500">{totalViews}</span>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Jami ko'rish</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 border border-gray-100 shadow-sm">
                            <span className="text-[22px] font-extrabold text-emerald-500">{watchedCount}</span>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Ko'rgan o'quvchi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 border border-gray-100 shadow-sm">
                            <span className="text-[22px] font-extrabold text-violet-500">{avgPercent}%</span>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">O'rtacha ko'rish</span>
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <CircularProgress sx={{ color: "#6C5CE7" }} size={36} />
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
                            <BarChart3 size={36} className="text-gray-200" />
                            <p className="text-[14px] font-semibold text-gray-500">{error}</p>
                            <p className="text-[12px] text-gray-400">Backend /files/{"{id}"}/analytics endpointi bo'lishi kerak</p>
                        </div>
                    )}
                    {!loading && !error && students.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <Eye size={36} className="text-gray-200" />
                            <p className="text-[14px] font-semibold text-gray-500">Hozircha ko'rish ma'lumoti yo'q</p>
                        </div>
                    )}
                    {!loading && !error && students.length > 0 && (
                        <table className="w-full text-left text-[13px]">
                            <thead className="sticky top-0 bg-white border-b border-gray-100">
                                <tr className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-4 py-3">O'quvchi</th>
                                    <th className="px-4 py-3 text-center">Holat</th>
                                    <th className="px-4 py-3 text-center">Ko'rish %</th>
                                    <th className="px-4 py-3 text-center">Ko'rish soni</th>
                                    <th className="px-4 py-3 text-right">Vaqt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, i) => {
                                    const watched = s.watched || s.view_count > 0 || s.status === "watched"
                                    const percent = s.watch_percent ?? s.percent ?? (watched ? 100 : 0)
                                    const views   = s.view_count ?? s.views ?? (watched ? 1 : 0)
                                    const time    = s.last_viewed_at ?? s.watched_at ?? s.created_at ?? null
                                    return (
                                        <tr key={s.id ?? i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition">
                                            <td className="px-6 py-3.5 text-gray-400 font-bold">{i + 1}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex w-8 h-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-[13px] font-bold shrink-0">
                                                        {(s.full_name || s.name || "?")[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-700">{s.full_name || s.name || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                {watched
                                                    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-bold text-emerald-600"><Eye size={11} />Ko'rgan</span>
                                                    : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-bold text-gray-400"><EyeOff size={11} />Ko'rmagan</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(percent, 100)}%` }} />
                                                    </div>
                                                    <span className="text-[12px] font-bold text-gray-600">{percent}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-bold text-gray-600">{views}</td>
                                            <td className="px-4 py-3.5 text-right text-gray-400 font-medium whitespace-nowrap">
                                                {time ? new Date(time).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

function UploadVideoModal({ isOpen, onClose, groupId, onUploadSuccess }) {
    const [file, setFile] = useState(null)
    const [selectedLesson, setSelectedLesson] = useState("")
    const [videoName, setVideoName] = useState("")
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(false)
    const [lessonsLoading, setLessonsLoading] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        setLessonsLoading(true)
        api.get(`/lessons/my/group/${groupId}`)
            .then((res) => {
                const items = listOf(res.data)
                const mapped = items
                    .filter(i => i.id)
                    .map(i => ({ id: i.id, topic: i.topic || i.title || i.name || `Dars ${i.id}` }))
                setLessons(mapped.length > 0 ? mapped : [])
            })
            .catch(() => setLessons([]))
            .finally(() => setLessonsLoading(false))
    }, [isOpen, groupId])

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0]
        if (selected) { setFile(selected); setVideoName(selected.name) }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const selected = e.dataTransfer.files?.[0]
        if (selected) { setFile(selected); setVideoName(selected.name) }
    }

    const handleUpload = async () => {
        if (!file) return alert("Fayl tanlanmagan")
        if (!videoName.trim()) return alert("Video nomini kiriting")
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const lessonId = selectedLesson?.id ?? ""
            const url = `/files/group/${groupId}/upload${lessonId ? `?lessonId=${lessonId}` : ""}`
            await api.post(url, formData)

            onUploadSuccess()
            handleClose()
        } catch (err) {
            const detailMsg = err?.response?.data?.message || err?.response?.data?.detail || err?.message
            alert(detailMsg ? `Yuklashda xatolik: ${detailMsg}` : "Yuklashda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => { setFile(null); setSelectedLesson(""); setVideoName(""); onClose() }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-[800px] rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="text-[20px] font-extrabold text-[#111827]">Qo'shish</h3>
                    <button onClick={handleClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => document.getElementById("video-upload-input").click()} className="flex flex-col items-center justify-center border border-dashed border-[#e5e7eb] rounded-2xl bg-[#fafbfe] hover:bg-emerald-50/10 py-12 px-6 text-center cursor-pointer transition group">
                        <input type="file" id="video-upload-input" accept="video/*" onChange={handleFileChange} className="hidden" />
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-[#10b981] group-hover:scale-105 transition-transform duration-300 mb-4 border border-gray-50">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="8" width="18" height="13" rx="2" ry="2" />
                                <path d="M16 8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
                                <line x1="12" y1="12" x2="12" y2="17" />
                                <line x1="9" y1="14" x2="15" y2="14" />
                            </svg>
                        </div>
                        <p className="text-[15.5px] font-bold text-gray-800 mb-1">Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling</p>
                        <p className="text-[12.5px] text-gray-400 font-semibold">Videofayl: .mp4, .webm, .mpeg, .avi, .mkv, .m4v, .ogm, .mov formatlaridan birida bo'lishi kerak</p>
                    </div>
                    {file && (
                        <div className="overflow-visible rounded-xl border border-gray-100">
                            <table className="w-full text-left border-collapse text-[14.5px]">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold">
                                        <th className="px-4 py-3 font-extrabold">File name</th>
                                        <th className="px-4 py-3 font-extrabold"><span className="text-red-500 mr-1">*</span>Dars</th>
                                        <th className="px-4 py-3 font-extrabold"><span className="text-red-500 mr-1">*</span>Video nomi</th>
                                        <th className="px-4 py-3 text-center font-extrabold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="align-middle border-b border-gray-50 last:border-b-0">
                                        <td className="px-4 py-4 font-semibold text-gray-700 max-w-[200px] truncate">{file.name}</td>
                                        <td className="px-4 py-4">
                                            <div className="relative min-w-[220px]">
                                                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border px-3 text-[14.5px] font-semibold transition-all ${isDropdownOpen ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white" : "border-gray-200 bg-white text-gray-750 hover:border-gray-300"}`}>
                                                    <span className={selectedLesson ? "text-gray-800" : "text-gray-400"}>{selectedLesson?.topic || "Darsni tanlang"}</span>
                                                    <svg className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180 text-emerald-500" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                                {isDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                                        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[200px] overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-200/40">
                                                            {lessonsLoading ? (
                                                                <div className="px-4 py-2 text-[14px] text-gray-400 font-semibold">Yuklanmoqda...</div>
                                                            ) : (
                                                                <>
                                                                    <div className="cursor-pointer rounded-lg px-4 py-2 text-[14px] font-semibold text-gray-400 hover:bg-gray-50" onClick={() => { setSelectedLesson(null); setIsDropdownOpen(false) }}>Darsni tanlang</div>
                                                                    {lessons.length === 0 ? (
                                                                        <div className="px-4 py-2 text-[13.5px] text-gray-400 italic">Hozircha darslar yo'q</div>
                                                                    ) : lessons.map((lesson) => (
                                                                        <div key={lesson.id} onClick={() => { setSelectedLesson(lesson); setIsDropdownOpen(false) }} className={`cursor-pointer rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors ${selectedLesson?.id === lesson.id ? "bg-emerald-50 text-emerald-600" : "text-gray-755 hover:bg-gray-50 hover:text-emerald-600"}`}>{lesson.topic}</div>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input type="text" value={videoName} onChange={(e) => setVideoName(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none transition" placeholder="Video nomini kiriting" />
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button onClick={handleClose} disabled={loading} className="px-5 py-2.5 rounded-xl text-[15px] font-bold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50">Bekor qilish</button>
                    <button onClick={handleUpload} disabled={loading || !file || !selectedLesson || !videoName.trim()} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[15px] font-bold text-white bg-[#10b981] hover:bg-[#059669] shadow-md shadow-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? <><CircularProgress size={18} color="inherit" />Yuklanmoqda...</> : "Fayllarni yuklash"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function VideoPlayerModal({ isOpen, onClose, video }) {
    const [videoUrl, setVideoUrl] = useState("")
    const [videoLoading, setVideoLoading] = useState(false)
    const [videoError, setVideoError] = useState("")

    useEffect(() => {
        if (!isOpen || !video) return;
        setVideoUrl("")
        setVideoLoading(true)
        setVideoError("")

        if (video.directUrl) {
            let finalUrl = video.directUrl;
            if (!finalUrl.startsWith('http')) {
                finalUrl = 'https://najot-edu.softwareengineer.uz' + (finalUrl.startsWith('/') ? '' : '/') + finalUrl;
            }
            setVideoUrl(finalUrl);
            setVideoLoading(false);
        } else {
            setVideoError("Video fayl manzili topilmadi.");
            setVideoLoading(false);
        }
    }, [isOpen, video])

    if (!isOpen || !video) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
            <div className="relative w-full max-w-[860px] rounded-[18px] bg-[#1e293b] border border-slate-700/50 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-[#1e293b]">
                    <div className="flex items-center gap-2.5">
                        <PlayCircle size={18} className="text-blue-400 fill-blue-400/10 shrink-0" />
                        <h3 className="text-[15.5px] font-extrabold text-white truncate max-w-[600px]">
                            {video.videoName}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800">
                        <X size={16} />
                    </button>
                </div>

                {/* Video Content */}
                <div className="bg-black flex items-center justify-center p-0 min-h-[300px]">
                    {videoLoading && (
                        <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
                            <CircularProgress color="inherit" />
                            <p className="text-[14.5px] font-semibold text-slate-300">Video yuklanmoqda...</p>
                        </div>
                    )}
                    {videoError && (
                        <div className="flex flex-col items-center gap-3 py-16 text-center px-8">
                            <div className="text-red-400 text-[15px] font-semibold">{videoError}</div>
                            <p className="text-slate-500 text-[13px]">Fayl ID: {video.fileId ?? video.scheduleId ?? "—"}</p>
                        </div>
                    )}
                    {!videoLoading && !videoError && videoUrl && (
                        // Use src directly on <video> — more reliable than <source> child in React
                        <video
                            key={videoUrl}
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-auto aspect-video max-h-[500px] bg-black focus:outline-none"
                            onError={(e) => {
                                console.error("Video element xato:", e);
                                setVideoError(`Video format qo'llab-quvvatlanmadi yoki yuklanmadi. URL: ${videoUrl}`);
                                setVideoUrl("");
                            }}
                        />
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-[#94a3b8] bg-[#0f172a]/20 border-t border-slate-700/50">
                    <div>Fayl: <span className="font-bold text-white ml-1">{video.videoName}</span></div>
                    <div>Hajmi: <span className="font-bold text-white ml-1">{video.size || '—'}</span></div>
                    <div>Dars: <span className="font-bold text-white ml-1">{video.lessonName}</span></div>
                    <div>Sana: <span className="font-bold text-white ml-1">{fmtDate(video.uploadedAt)}</span></div>
                </div>

            </div>
        </div>
    );
}

/* ─────────────── LessonsSection ─────────────── */
function LessonsSection({ groupId, onOpenExam }) {
    const navigate = useNavigate()
    const [activeSubTab, setActiveSubTab] = useState("homework")
    const [tabData, setTabData] = useState({})
    const [tabLoading, setTabLoading] = useState({})
    const [tabError, setTabError] = useState({})
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [videoToDelete, setVideoToDelete] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [analyticsVideo, setAnalyticsVideo] = useState(null)

    // Correct Swagger endpoint: GET /files/{groupId}  (groupId as path param)
    const VIDEO_CANDIDATE_ENDPOINTS = (gId) => [
        `/files/${gId}`,            // ✅ Official: GET /api/v1/files/{groupId}
        `/groups/${gId}/files`,     // fallback attempt
    ]

    const loadTab = useCallback(async (tabKey, endpoint, gId) => {
        setTabLoading((prev) => ({ ...prev, [tabKey]: true }))
        setTabError((prev) => ({ ...prev, [tabKey]: "" }))
        try {
            if (tabKey === "video") {
                // Try each candidate endpoint until one returns array data
                const candidates = VIDEO_CANDIDATE_ENDPOINTS(gId || groupId)
                let found = false
                for (const ep of candidates) {
                    try {
                        const res = await api.get(ep)
                        const items = listOf(res.data)
                        // Accept if it looks like actual file objects (has id and at least a name or url)
                        if (Array.isArray(items) && (items.length === 0 || items[0]?.id !== undefined)) {
                            setTabData((prev) => ({ ...prev, video: items.map(normalizeVideoRow) }))
                            found = true
                            break
                        }
                    } catch (epErr) {
                        // 404 is expected for wrong endpoints; continue
                        if (epErr?.response?.status !== 404 && epErr?.response?.status !== 405) {
                            console.warn(`[Video] ${ep} failed:`, epErr?.response?.status)
                        }
                    }
                }
                if (!found) {
                    setTabData((prev) => ({ ...prev, video: [] }))
                }
            } else {
                const res = await api.get(endpoint)
                const items = listOf(res.data)
                setTabData((prev) => ({ ...prev, [tabKey]: items.map(normalizeRow) }))
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.detail || "Ma'lumotlarni yuklashda xatolik yuz berdi."
            setTabError((prev) => ({ ...prev, [tabKey]: msg }))
        } finally {
            setTabLoading((prev) => ({ ...prev, [tabKey]: false }))
        }
    }, [groupId]) // eslint-disable-line

    useEffect(() => {
        const defaultTab = LESSON_TABS[0]
        loadTab(defaultTab.key, defaultTab.endpoint(groupId), groupId)
    }, [groupId]) // eslint-disable-line

    const handleTabChange = (tab) => {
        setActiveSubTab(tab.key)
        if (tab.endpoint && tabData[tab.key] === undefined) {
            loadTab(tab.key, tab.endpoint(groupId), groupId)
        }
    }

    const handleAddClick = () => {
        if (activeSubTab === "video") setIsUploadModalOpen(true)
        else navigate(`/dashboard/groups/${groupId}/homework/create`)
    }

    const handleDeleteVideo = async () => {
        if (!videoToDelete) return
        setDeleteLoading(true)
        try {
            const fileId = videoToDelete.fileId ?? videoToDelete.id
            await api.delete(`/files/${fileId}`)
            loadTab("video", "", groupId)
            setVideoToDelete(null)
        } catch (err) {
            const detailMsg = err?.response?.data?.message || err?.response?.data?.detail || err?.message
            alert(detailMsg ? `O'chirishda xatolik: ${detailMsg}` : "O'chirishda xatolik yuz berdi")
        } finally {
            setDeleteLoading(false)
        }
    }

    const rows = tabData[activeSubTab] || []
    const loading = tabLoading[activeSubTab] || false
    const error = tabError[activeSubTab] || ""

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-1">
                    <span className="mr-3 text-[19.5px] font-extrabold text-[#1f2937]">Guruh darsliklari</span>
                    {LESSON_TABS.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeSubTab === tab.key
                        return (
                            <button key={tab.key} onClick={() => handleTabChange(tab)} className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[15.5px] font-bold transition-all ${isActive ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
                                <Icon size={13} />{tab.label}
                            </button>
                        )
                    })}
                </div>
                <button onClick={handleAddClick} className="flex items-center gap-1.5 rounded-xl bg-[#10b981] px-4 py-2 text-[16.5px] font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-[#059669]">
                    <Plus size={15} />{activeSubTab === "exam" ? "Yangi imtihon" : "Qo'shish"}
                </button>
            </div>
            {activeSubTab === "video"
                ? <VideoTable rows={rows} loading={loading} error={error} onPlayVideo={setSelectedVideo} onDeleteVideo={setVideoToDelete} onAnalytics={setAnalyticsVideo} />
                : activeSubTab === "exam"
                ? <ExamTable onOpenExam={onOpenExam} />
                : <LessonsTable rows={rows} loading={loading} error={error} onRowClick={activeSubTab === "homework" ? (row) => navigate(`/dashboard/groups/${groupId}/homework/${row.id}`, { state: { homework: row } }) : null} />
            }
            <UploadVideoModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} groupId={groupId} onUploadSuccess={() => loadTab("video", "", groupId)} />
            <VideoPlayerModal isOpen={Boolean(selectedVideo)} onClose={() => setSelectedVideo(null)} video={selectedVideo} />
            <VideoAnalyticsModal isOpen={Boolean(analyticsVideo)} onClose={() => setAnalyticsVideo(null)} video={analyticsVideo} />

            {/* ── Video Delete Confirm Modal ── */}
            {videoToDelete && (
                <>
                    <div onClick={() => setVideoToDelete(null)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] text-left">
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Videoni o'chirish</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{videoToDelete.videoName}"</span> videosini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setVideoToDelete(null)}
                                    disabled={deleteLoading}
                                    className="px-5 py-2 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleDeleteVideo}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deleteLoading ? <><CircularProgress size={14} color="inherit" />O'chirilmoqda...</> : "Ha, o'chirish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

/* ─────────────── InfoTab ─────────────── */
function InfoTab({ group, schedules }) {
    const { id } = useParams()
    const groupId = id || group?.id
    const [mentorsOpen, setMentorsOpen] = useState(true)
    const [paramsOpen, setParamsOpen] = useState(true)
    const [students, setStudents] = useState([])
    const [studentsLoading, setStudentsLoading] = useState(false)

    const [schedule, setSchedule] = useState(null)
    const [scheduleMonths, setScheduleMonths] = useState([])
    const [activeScheduleMonth, setActiveScheduleMonth] = useState("")
    const [showAllMonths, setShowAllMonths] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)
    const [isLessonCompleted, setIsLessonCompleted] = useState(false)
    const [selectedLessonId, setSelectedLessonId] = useState(null)
    const [lessonMode, setLessonMode] = useState("boshqa")
    const [lessonTopic, setLessonTopic] = useState("")
    const [lessonDescription, setLessonDescription] = useState("")
    const [attendance, setAttendance] = useState({})
    const [saveLoading, setSaveLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

    // Load group students
    useEffect(() => {
        let active = true
        setStudentsLoading(true)
        api.get(`/groups/one/students/${groupId}`)
            .then((res) => {
                if (!active) return
                const list = Array.isArray(res.data) ? res.data : (res.data?.students || [])
                setStudents(listOf(list))
            })
            .catch(() => {
                // Fallback
                api.get("/students")
                    .then((res) => {
                        if (!active) return
                        const list = listOf(res.data)
                        const filtered = list.filter((s) => {
                            const sGroups = s.groups || []
                            return sGroups.some((g) => {
                                const gid = g && typeof g === "object" ? g.id : g
                                return Number(gid) === Number(groupId)
                            })
                        })
                        setStudents(filtered)
                    })
                    .catch(() => setStudents([]))
            })
            .finally(() => { if (active) setStudentsLoading(false) })
        return () => { active = false }
    }, [groupId])

    // Load schedule
    useEffect(() => {
        const scheduleObject = Array.isArray(schedules) ? schedules[0] || {} : schedules || {}
        let keys = Object.keys(scheduleObject)
            .filter((k) => scheduleObject[k] && Array.isArray(scheduleObject[k].days))
            .sort((a, b) => Number(a) - Number(b))

        if (keys.length === 0) {
            // Generate mock months to make UI interactive if API doesn't have months structure yet
            const mockScheduleObject = {
                "1": {
                    days: [
                        { month: "June", day: "1", isCompleted: true },
                        { month: "June", day: "3", isCompleted: false },
                        { month: "June", day: "5", isCompleted: false },
                        { month: "June", day: "8", isCompleted: false },
                        { month: "June", day: "10", isCompleted: false },
                        { month: "June", day: "12", isCompleted: false },
                        { month: "June", day: "15", isCompleted: false },
                        { month: "June", day: "17", isCompleted: false },
                        { month: "June", day: "19", isCompleted: false },
                        { month: "June", day: "22", isCompleted: false },
                        { month: "June", day: "24", isCompleted: false },
                        { month: "June", day: "26", isCompleted: false },
                        { month: "June", day: "29", isCompleted: false },
                    ]
                }
            }
            setSchedule(mockScheduleObject)
            setScheduleMonths(["1"])
            setActiveScheduleMonth("1")
        } else {
            setSchedule(scheduleObject)
            setScheduleMonths(keys)
            const currentMonthName = new Date().toLocaleString("en-GB", { month: "long" })
            const currentMonthKey = keys.find((key) =>
                scheduleObject[key]?.days?.some((day) => day.month === currentMonthName)
            ) || keys[0] || ""
            setActiveScheduleMonth(currentMonthKey)
        }
    }, [schedules])

    const monthNameToIndex = {
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    }
    const today = new Date()
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const getDayDate = (day) => {
        if (!day?.month || !day?.day) return null
        const monthIndex = monthNameToIndex[day.month]
        if (!monthIndex) return null
        const year = group.startDate ? new Date(group.startDate).getFullYear() : today.getFullYear()
        return new Date(year, monthIndex - 1, Number(day.day))
    }

    const isPastDay = (day) => {
        const date = getDayDate(day)
        if (!date) return false
        return date.getTime() < todayDate.getTime()
    }

    const isFutureDay = (day) => {
        const date = getDayDate(day)
        if (!date) return false
        return date.getTime() > todayDate.getTime()
    }

    const selectedDayIsPast = selectedDay && isPastDay(selectedDay)

    const studentList = students.length > 0 ? students.map((s, idx) => ({
        id: s.id ?? `s-${idx}`,
        full_name: s.full_name || s.name || `O'quvchi ${idx + 1}`
    })) : [
        { id: 1, full_name: "aaaaaa" },
        { id: 2, full_name: "Magic" },
        { id: 3, full_name: "Alikk" },
        { id: 4, full_name: "Faruh" },
    ]

    const handleSelectDay = (day) => {
        if (isFutureDay(day)) return
        setSelectedDay(day)
    }

    const toggleAttendance = (id) => {
        setAttendance((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    // Date formatting helper for API and UI
    const getFormattedDate = (day) => {
        if (!day) return ""
        const year = group.startDate ? new Date(group.startDate).getFullYear() : new Date().getFullYear()
        const monthIndex = monthNameToIndex[day.month]
        if (!monthIndex) return ""
        return `${year}-${String(monthIndex).padStart(2, "0")}-${String(day.day).padStart(2, "0")}`
    }

    const formatDateForDisplay = (day) => {
        if (!day) return ""
        const year = group.startDate ? new Date(group.startDate).getFullYear() : new Date().getFullYear()
        const monthIndex = monthNameToIndex[day.month]
        if (!monthIndex) return ""
        return `${year} M${String(monthIndex).padStart(2, "0")} ${String(day.day).padStart(2, "0")}`
    }

    // Auto-select day on load
    const currentSchedule = schedule?.[activeScheduleMonth] || {}
    const currentScheduleDays = Array.isArray(currentSchedule.days) ? currentSchedule.days : []

    // Auto-selection removed to hide panels by default

    // Fetch lesson and attendance when selectedDay changes
    useEffect(() => {
        if (!selectedDay) return;
        
        const year = group.startDate ? new Date(group.startDate).getFullYear() : new Date().getFullYear();
        const monthIndex = monthNameToIndex[selectedDay.month];
        if (!monthIndex) return;
        const formattedDate = getFormattedDate(selectedDay);
        
        let active = true;
        setSaveLoading(true);
        
        Promise.all([
            api.get(`/groups/${groupId}/lesson?date=${formattedDate}`).catch(() => null),
            api.get(`/attendance?group_id=${groupId}`).catch(() => ({ data: [] }))
        ]).then(([lessonRes, attendanceRes]) => {
            if (!active) return;
            
            const lessonData = lessonRes?.data;
            if (lessonData) {
                setLessonTopic(lessonData.topic || "");
                setLessonDescription(lessonData.description || "");
                setIsLessonCompleted(true);
                setSelectedLessonId(lessonData.id);
            } else {
                setLessonTopic("");
                setLessonDescription("");
                setIsLessonCompleted(false);
                setSelectedLessonId(null);
            }
            
            // Attendance mapping
            const attendanceList = Array.isArray(attendanceRes?.data) ? attendanceRes.data : [];
            const dayAttendance = attendanceList.filter(item => {
                const itemDateStr = item.date || item.created_at;
                if (!itemDateStr) return false;
                const d = new Date(itemDateStr);
                return d.getFullYear() === year && 
                       (d.getMonth() + 1) === monthIndex && 
                       d.getDate() === Number(selectedDay.day);
            });
            
            const initialAttendance = {};
            studentList.forEach(s => {
                const record = dayAttendance.find(att => att.student?.id === s.id || att.student_id === s.id);
                if (record) {
                    initialAttendance[s.id] = record.status !== "absent" && record.isPresent !== false;
                } else {
                    initialAttendance[s.id] = true; // default present (switch ON)
                }
            });
            setAttendance(initialAttendance);
        }).catch(err => {
            console.error("Error loading day info:", err);
        }).finally(() => {
            if (active) setSaveLoading(false);
        });
        
        return () => { active = false; };
    }, [selectedDay?.month, selectedDay?.day, groupId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSaveLesson = async () => {
        if (!lessonTopic.trim()) return setSnackbar({ open: true, message: "Iltimos, dars mavzusini kiriting!", severity: "warning" })
        setSaveLoading(true)
        try {
            const payload = {
                group_id: Number(groupId),
                topic: lessonTopic.trim(),
                description: lessonDescription.trim(),
            }
            await api.post("/lessons", payload)
            setSnackbar({ open: true, message: "Dars mavzusi muvaffaqiyatli saqlandi!", severity: "success" })

            if (schedule && activeScheduleMonth) {
                const updatedSchedule = { ...schedule }
                const monthDays = [...updatedSchedule[activeScheduleMonth].days]
                const idx = monthDays.findIndex(d => d.month === selectedDay.month && d.day === selectedDay.day)
                if (idx !== -1) {
                    monthDays[idx] = { ...monthDays[idx], isCompleted: true }
                    updatedSchedule[activeScheduleMonth] = { ...updatedSchedule[activeScheduleMonth], days: monthDays }
                    setSchedule(updatedSchedule)
                }
            }
            setIsLessonCompleted(true)
        } catch (error) {
            console.error(error)
            const msg = error.response?.data?.message || error.response?.data?.detail || "Dars ma'lumotlarini saqlashda xatolik."
            setSnackbar({ open: true, message: msg, severity: "error" })
        } finally {
            setSaveLoading(false)
        }
    }

    const handleSaveAttendance = async () => {
        setSaveLoading(true)
        try {
            const studentIds = Object.keys(attendance)
            await Promise.all(
                studentIds.map(sId => {
                    return api.post("/attendance", {
                        group_id: Number(groupId),
                        student_id: Number(sId),
                        isPresent: Boolean(attendance[sId])
                    })
                })
            )
            setSnackbar({ open: true, message: "Davomat muvaffaqiyatli saqlandi!", severity: "success" })
        } catch (error) {
            console.error(error)
            const msg = error.response?.data?.message || "Davomatni saqlashda xatolik."
            setSnackbar({ open: true, message: msg, severity: "error" })
        } finally {
            setSaveLoading(false)
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }

    const moveScheduleMonth = (direction) => {
        if (!scheduleMonths.length) return
        const currentIndex = scheduleMonths.indexOf(activeScheduleMonth)
        if (currentIndex === -1) {
            setActiveScheduleMonth(scheduleMonths[0])
            return
        }
        const nextIndex = currentIndex + direction
        if (nextIndex < 0 || nextIndex >= scheduleMonths.length) return
        setActiveScheduleMonth(scheduleMonths[nextIndex])
    }

    const getMonthLabel = (key) => schedule?.[key]?.days?.[0]?.month || `O'quv oyi ${key}`

    const params = [
        ["Kurs:", group.course],
        ["O'rta yosh:", group.averageAge],
        ["O'quvchilar sig'imi:", group.capacity],
        ["Mavjud o'quvchilar:", group.studentsCount],
        ["O'quv oyidagi darslar:", group.lessonsInMonth],
        ["Kurs davomiyligi (oy):", group.duration],
        ["Jami darslar:", group.totalLessons],
        ["Dars vaqti:", group.startTime],
        ["Dars kunlari:", group.days],
        ["Xona:", group.room],
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-start">
                {/* Guruh mentorlari */}
                <div className="flex flex-col rounded-xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div 
                        className="flex items-center justify-between bg-[#6C5CE7] px-5 py-3.5 cursor-pointer"
                        onClick={() => setMentorsOpen(!mentorsOpen)}
                    >
                        <h2 className="text-[15px] font-bold text-white">Guruh mentorlari</h2>
                        <button className="text-white/80 hover:text-white transition">
                            {mentorsOpen ? <X size={18} /> : <Plus size={18} />}
                        </button>
                    </div>
                    {mentorsOpen && (
                        <div className="p-5 flex gap-6 overflow-x-auto">
                            {(group.teachers && group.teachers.length > 0 ? group.teachers : [{ full_name: "Biriktirilmagan" }]).map((t, i) => (
                                <div key={t.id || i} className="flex flex-col items-center gap-2 min-w-[80px]">
                                    {t.photo ? (
                                        <img src={`https://najot-edu.softwareengineer.uz/${t.photo}`} alt={t.full_name} className="h-14 w-14 shrink-0 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[18px] font-bold text-gray-500 border border-gray-200">
                                            {(t.full_name || "T").charAt(0)}
                                        </div>
                                    )}
                                    <span className="bg-emerald-50 text-emerald-500 px-2 py-0.5 rounded text-[11px] font-bold">Teacher</span>
                                    <p className="text-[14px] font-bold text-[#1a1a2e] text-center">{t.full_name || "Biriktirilmagan"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Parametrlar */}
                <div className="flex flex-col rounded-xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div 
                        className="flex items-center justify-between bg-[#6C5CE7] px-5 py-3.5 cursor-pointer"
                        onClick={() => setParamsOpen(!paramsOpen)}
                    >
                        <h2 className="text-[15px] font-bold text-white">Parametrlar</h2>
                        <button className="text-white/80 hover:text-white transition">
                            {paramsOpen ? <X size={18} /> : <Plus size={18} />}
                        </button>
                    </div>
                    {paramsOpen && (
                        <div className="flex flex-col">
                            {params.map(([label, val], idx) => (
                                <div key={label} className={`flex items-center justify-between px-5 py-3.5 ${idx !== params.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <span className="text-[14px] text-gray-500 font-medium">{label}</span>
                                    <span className="text-[14px] font-bold text-[#1a1a2e]">{val ?? "—"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dars jadvali */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 bg-white">
                    <h2 className="text-[16px] font-bold text-[#1a1a2e]">Dars jadvali</h2>
                </div>
                
                {/* Table */}
                <div className="flex flex-col">
                    {(group.teachers && group.teachers.length > 0 ? group.teachers : [{ full_name: "Biriktirilmagan" }]).map((teacher, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-5 py-4 items-center border-b border-gray-50 hover:bg-gray-50/30 transition">
                            <span className="text-[14px] font-bold text-blue-500">
                                {teacher?.full_name || "—"}
                            </span>
                            <span className="text-[14px] text-gray-500 font-medium text-center">{group.days || "—"}</span>
                            <span className="text-[14px] text-gray-500 font-medium text-center">
                                {group.startTime ? `${group.startTime} dan` : "—"} {group.endTime ? `- ${group.endTime} gacha` : ""}
                            </span>
                            <span className="text-[14px] text-gray-500 font-medium text-center">
                                {group.startDate ? `${fmtDate(group.startDate)} - ${fmtDate(new Date(new Date(group.startDate).setMonth(new Date(group.startDate).getMonth() + (group.duration || 1))))}` : "—"}
                            </span>
                            <span className="text-[14px] text-gray-500 font-medium text-right">
                                {group.room ? `${group.room} // 18` : "F2 Autodesk // 18"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Yana ko'rsatish button */}
                <div className="py-4 flex justify-center">
                    <button className="px-5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition">
                        Yana ko'rsatish (9)
                    </button>
                </div>

                {/* Calendar */}
                <div className="px-5 pb-5">
                    <div className="flex items-center gap-4 mb-4">
                        {!showAllMonths && scheduleMonths.length > 1 && (
                            <div className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-1.5 text-[13px] font-bold text-blue-500">
                                {scheduleMonths.indexOf(activeScheduleMonth) !== -1
                                    ? `${scheduleMonths.indexOf(activeScheduleMonth) + 1}-o'quv oyi`
                                    : "1-o'quv oyi"}
                            </div>
                        )}
                        {!showAllMonths && scheduleMonths.length > 1 && (
                            <div className="flex items-center gap-3">
                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:text-gray-800 transition" onClick={() => moveScheduleMonth(-1)}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[14px] font-bold text-[#1a1a2e]">
                                    {getMonthLabel(activeScheduleMonth)} o'quv oyi
                                </span>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:text-gray-800 transition" onClick={() => moveScheduleMonth(1)}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
                        {showAllMonths ? (
                            scheduleMonths.map((mKey) => (
                                <div key={mKey} className="mb-4 last:mb-0">
                                    <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-2">{getMonthLabel(mKey)} darslari</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(schedule?.[mKey]?.days || []).map((d, i) => {
                                            const selected = selectedDay?.month === d.month && selectedDay?.day === d.day
                                            const isPastOrSelected = d.isCompleted || selected || i < 4;
                                            return (
                                                <div
                                                    key={`${mKey}-${i}`}
                                                    onClick={() => handleSelectDay({ ...d, monthKey: mKey })}
                                                    className={`flex flex-col items-center justify-center min-w-[48px] h-[52px] rounded-lg border transition-all cursor-pointer ${
                                                        isPastOrSelected
                                                            ? "border-blue-400 bg-white text-blue-500" 
                                                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <span className="text-[11px] font-medium mb-0.5">{d.month}</span>
                                                    <span className={`text-[15px] font-bold ${isPastOrSelected ? "text-blue-500" : "text-gray-700"}`}>
                                                        {d.day}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            currentScheduleDays.map((d, i) => {
                                const selected = selectedDay?.month === d.month && selectedDay?.day === d.day
                                const isPastOrSelected = d.isCompleted || selected || i < 4;
                                return (
                                    <div
                                        key={`${activeScheduleMonth}-${i}`}
                                        onClick={() => handleSelectDay({ ...d, monthKey: activeScheduleMonth })}
                                        className={`flex flex-col items-center justify-center min-w-[48px] h-[52px] rounded-lg border transition-all cursor-pointer ${
                                            isPastOrSelected
                                                ? "border-blue-400 bg-white text-blue-500" 
                                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                    >
                                        <span className="text-[11px] font-medium mb-0.5">{d.month}</span>
                                        <span className={`text-[15px] font-bold ${isPastOrSelected ? "text-blue-500" : "text-gray-700"}`}>
                                            {d.day}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {selectedDay && (
                        <div className="mt-6 mb-6 space-y-4 animate-in fade-in duration-200">
                            {/* Ma'lumot box */}
                            <div className="rounded-xl bg-white p-5 border border-gray-200">
                                <h3 className="text-[13px] font-bold text-[#1a1a2e] mb-5">Ma'lumot</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        {group.teachers?.[0]?.photo ? (
                                            <img
                                                src={`https://najot-edu.softwareengineer.uz/${group.teachers[0].photo}`}
                                                alt="teacher"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex w-10 h-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-[16px] font-bold">
                                                {group.teachers?.[0]?.full_name?.[0]?.toLowerCase() || "t"}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-[13px] font-bold text-[#1a1a2e]">{group.teachers?.[0]?.full_name || "Biriktirilmagan"}</p>
                                            <p className="text-[11px] text-gray-400">Teacher</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-12 text-right">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Dars kuni</span>
                                            <span className="text-[13px] font-bold text-[#1a1a2e]">
                                                {formatDateForDisplay(selectedDay)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Holat</span>
                                            <span className={`text-[13px] font-bold ${isLessonCompleted ? "text-emerald-500" : "text-blue-500"}`}>
                                                {isLessonCompleted ? "Dars o'tilgan" : "Dars o'tilmagan"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Yo'qlama va mavzu box */}
                            <div className="rounded-xl bg-white p-5 border border-gray-200 space-y-6">
                                <h3 className="text-[13px] font-bold text-[#1a1a2e]">Yo'qlama va mavzu kiritish</h3>
                                
                                <div className="flex items-center gap-6 text-[13px] font-medium">
                                    <button
                                        type="button"
                                        onClick={() => !isLessonCompleted && setLessonMode("plan")}
                                        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        disabled={isLessonCompleted}
                                    >
                                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${lessonMode === "plan" ? "border-emerald-500" : "border-gray-300"}`}>
                                            {lessonMode === "plan" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                                        </span>
                                        <span className={lessonMode === "plan" ? "text-emerald-500" : ""}>O'quv reja bo'yicha</span>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => !isLessonCompleted && setLessonMode("boshqa")}
                                        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        disabled={isLessonCompleted}
                                    >
                                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${lessonMode === "boshqa" ? "border-emerald-500" : "border-gray-300"}`}>
                                            {lessonMode === "boshqa" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                                        </span>
                                        <span className={lessonMode === "boshqa" ? "text-emerald-500" : ""}>Boshqa</span>
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[12px] font-medium text-gray-500">
                                            <span className="text-red-500 mr-1">*</span>Mavzu
                                        </label>
                                        <input
                                            type="text"
                                            value={lessonTopic}
                                            onChange={(e) => setLessonTopic(e.target.value)}
                                            disabled={isLessonCompleted}
                                            className="w-full h-[42px] px-4 rounded-lg border border-gray-200 text-[13px] text-gray-600 outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 transition"
                                            placeholder="Mavzuni kiriting..."
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[12px] font-medium text-gray-500">Tavsif (ixtiyoriy)</label>
                                        <textarea
                                            value={lessonDescription}
                                            onChange={(e) => setLessonDescription(e.target.value)}
                                            disabled={isLessonCompleted}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-[13px] text-gray-600 outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 transition resize-none"
                                            placeholder="Tavsif..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="w-full">
                                    <table className="w-full text-left text-[13px]">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-[12px] text-gray-400">
                                                <th className="w-[50px] py-3 font-medium">#</th>
                                                <th className="py-3 font-medium">O'quvchi ismi</th>
                                                <th className="w-[80px] py-3 font-medium text-right">Keldi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentsLoading ? (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center text-gray-400">Yuklanmoqda...</td>
                                                </tr>
                                            ) : studentList.map((student, idx) => (
                                                <tr key={student.id} className="border-b border-gray-50 last:border-0">
                                                    <td className="py-3.5 text-gray-500 font-medium">{idx + 1}</td>
                                                    <td className="py-3.5 text-gray-600 font-medium">{student.full_name}</td>
                                                    <td className="py-3.5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => !isLessonCompleted && toggleAttendance(student.id)}
                                                            disabled={isLessonCompleted}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                attendance[student.id] ? "bg-emerald-500" : "bg-gray-200"
                                                            } ${isLessonCompleted ? "opacity-70 cursor-not-allowed" : ""}`}
                                                        >
                                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                attendance[student.id] ? "translate-x-4" : "translate-x-0"
                                                            }`} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="flex justify-end pt-4">
                                    {isLessonCompleted ? (
                                        <button disabled className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-gray-300">
                                            Dars o'tilgan
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSaveAttendance}
                                                disabled={saveLoading}
                                                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-blue-500 hover:bg-blue-600 transition"
                                            >
                                                Davomatni saqlash
                                            </button>
                                            <button
                                                onClick={handleSaveLesson}
                                                disabled={saveLoading}
                                                className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                                            >
                                                {saveLoading ? "Saqlanmoqda..." : "Saqlash"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-2 border-t border-gray-50 pt-4">
                        <button
                            onClick={() => setShowAllMonths((prev) => !prev)}
                            className="inline-flex h-[38px] items-center justify-center rounded-lg bg-gray-100 px-6 text-[13px] font-bold text-gray-700 hover:bg-gray-200 transition"
                        >
                            {showAllMonths ? "Taqvimni yopish" : "Barchasini ko'rish"}
                        </button>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

/* ─────────────── AttendanceTab ─────────────── */
function AttendanceTab({ groupId }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        setLoading(true)
        api.get(`/attendance?group_id=${groupId}`)
            .then((res) => setData(listOf(res.data)))
            .catch((err) => setError(err?.response?.data?.message || "Davomat ma'lumotlarini yuklashda xatolik."))
            .finally(() => setLoading(false))
    }, [groupId])

    if (loading) return <div className="flex items-center justify-center py-16"><CircularProgress sx={{ color: "#7c3aed" }} size={36} /></div>
    if (error) return <Alert severity="error" className="rounded-xl">{error}</Alert>
    if (data.length === 0) return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-[16.5px] font-bold text-gray-500">Davomat ma'lumotlari topilmadi.</p>
            <p className="mt-1 text-[15.5px] text-gray-400">Davomat ma'lumotlari backenddan alohida endpoint orqali yuklanadi.</p>
        </section>
    )

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-[19.5px] font-extrabold text-[#111827]">Akademik davomati</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-[#fafbfe] text-[14.5px] font-extrabold text-gray-400">
                            <th className="px-6 py-3.5">#</th>
                            <th className="px-4 py-3.5">Talaba</th>
                            <th className="px-4 py-3.5">Sana</th>
                            <th className="px-4 py-3.5">Holat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={row.id || i} className="border-b border-gray-50 last:border-0 hover:bg-violet-50/20">
                                <td className="px-6 py-3.5 text-[15.5px] font-bold text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3.5 text-[15.5px] font-semibold text-[#1f2937]">{row.student?.full_name || row.student_name || "—"}</td>
                                <td className="px-4 py-3.5 text-[15.5px] text-gray-500">{fmtDate(row.date || row.created_at)}</td>
                                <td className="px-4 py-3.5">
                                    <Chip label={row.status || "present"} size="small" sx={{ fontSize: "11px", fontWeight: 700, backgroundColor: row.status === "absent" ? "#fef2f2" : "#f0fdf4", color: row.status === "absent" ? "#ef4444" : "#16a34a" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

/* ─────────────── Main component ─────────────── */
const MAIN_TABS = [
    { key: "info",       label: "Ma'lumotlar" },
    { key: "lessons",    label: "Guruh darsliklari" },
    { key: "attendance", label: "Akademik davomati" },
]

export default function GroupDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [group, setGroup] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [activeTab, setActiveTab] = useState(() => {
        const t = searchParams.get("tab")
        return MAIN_TABS.some((m) => m.key === t) ? t : "info"
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Archive modal
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [selectedExam, setSelectedExam] = useState(null)

    // Header 3-dots menu
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null)

    // Edit drawer
    const [editDrawer, setEditDrawer] = useState(false)
    const [editForm, setEditForm] = useState({ name: "" })
    const [saving, setSaving] = useState(false)
    const [visitedTabs, setVisitedTabs] = useState({ [activeTab]: true })

    useEffect(() => {
        setVisitedTabs(prev => ({ ...prev, [activeTab]: true }))
    }, [activeTab])

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setError("")
        Promise.all([
            api.get(`/groups/${id}`),
            api.get(`/groups/${id}/schedules`).catch(() => ({ data: [] })),
        ])
            .then(([groupRes, schedRes]) => {
                if (!mounted) return
                setGroup(normalizeGroup(groupRes))
                setSchedules(listOf(schedRes.data))
            })
            .catch((err) => {
                if (!mounted) return
                setError(err?.response?.data?.message || "Guruh ma'lumotlarini yuklashda xatolik yuz berdi.")
            })
            .finally(() => { if (mounted) setLoading(false) })
        return () => { mounted = false }
    }, [id])

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            // Archive: PATCH active=false or use archive endpoint
            await api.patch(`/groups/${id}`, { active: false })
            navigate("/dashboard/groups")
        } catch (err) {
            // fallback: try dedicated archive endpoint
            try {
                await api.post(`/groups/${id}/archive`)
                navigate("/dashboard/groups")
            } catch (err2) {
                console.error("Guruhni arxivlashda xato:", err2)
                setDeleteModal(false)
            }
        } finally {
            setDeleteLoading(false)
        }
    }

    const handlePatch = async () => {
        if (!editForm.name.trim()) return
        setSaving(true)
        try {
            await api.patch(`/groups/${id}`, { name: editForm.name })
            setGroup((prev) => ({ ...prev, name: editForm.name }))
            setEditDrawer(false)
        } catch (err) {
            console.error("Guruhni tahrirlashda xato:", err)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="-m-6 flex min-h-full items-center justify-center bg-[#f4f6fb]"><CircularProgress sx={{ color: "#7c3aed" }} /></div>
    if (error) return <div className="-m-6 min-h-full bg-[#f4f6fb] p-8"><Alert severity="error" className="rounded-xl">{error}</Alert></div>
    if (!group) return null

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] px-8 py-8">
            {/* Page header */}
            <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/dashboard/groups")} className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-white hover:text-violet-600">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-[31.5px] font-extrabold tracking-tight text-[#111827]">{group.name}</h1>
                    <span className={`rounded-lg border px-3 py-1 text-[15.5px] font-extrabold ${group.active ? "border-emerald-200 bg-emerald-50 text-emerald-500" : "border-gray-200 bg-gray-100 text-gray-500"}`}>
                        {group.active ? "Aktiv" : "Nofaol"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex h-11 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-5 text-[15.5px] font-extrabold text-gray-600 shadow-sm transition hover:bg-gray-50">
                        <BarChart3 size={20} />
                        Statistika
                    </button>
                    <IconButton
                        onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
                        sx={{ width: 44, height: 44, border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff', '&:hover': { backgroundColor: '#f9fafb' } }}
                    >
                        <MoreVertical size={18} />
                    </IconButton>
                    <Menu
                        anchorEl={headerMenuAnchor}
                        open={Boolean(headerMenuAnchor)}
                        onClose={() => setHeaderMenuAnchor(null)}
                        slotProps={{ paper: { sx: { borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.10)', border: '1px solid #f3f4f6', mt: 0.5, minWidth: 160 } } }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem
                            onClick={() => { setHeaderMenuAnchor(null); setEditForm({ name: group.name }); setEditDrawer(true) }}
                            sx={{ fontSize: '13px', fontWeight: 700, color: '#374151', borderRadius: '8px', mx: 0.5, display: 'flex', gap: '8px', alignItems: 'center' }}
                        >
                            <Pencil size={14} />Tahrirlash
                        </MenuItem>
                        <MenuItem
                            onClick={() => { setHeaderMenuAnchor(null); setDeleteModal(true) }}
                            sx={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#fef2f2' }, display: 'flex', gap: '8px', alignItems: 'center' }}
                        >
                            <Trash2 size={14} />O'chirish
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {/* Main tabs */}
            <div className="mb-7 flex items-center gap-1 border-b border-gray-200">
                {MAIN_TABS.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative px-5 py-3 text-[18.5px] font-extrabold transition ${activeTab === tab.key ? "text-violet-600" : "text-gray-500 hover:text-gray-700"}`}>
                        {tab.label}
                        {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-violet-600" />}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="space-y-5">
                <div className={activeTab === "info" ? "block" : "hidden"}>
                    {visitedTabs.info && <InfoTab group={group} schedules={schedules} />}
                </div>
                <div className={activeTab === "lessons" ? "block" : "hidden"}>
                    {visitedTabs.lessons && (selectedExam
                        ? <ExamDetailPage exam={selectedExam} onClose={() => setSelectedExam(null)} />
                        : <LessonsSection groupId={id} onOpenExam={setSelectedExam} />)}
                </div>
                <div className={activeTab === "attendance" ? "block" : "hidden"}>
                    {visitedTabs.attendance && <AttendanceTab groupId={id} />}
                </div>
            </div>

            {/* ── Delete Confirm Modal ── */}
            {deleteModal && (
                <>
                    <div onClick={() => setDeleteModal(false)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                                    <Trash2 size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-800">Guruhni arxivlash</h3>
                                    <p className="text-[12px] text-gray-400 font-medium">Guruh arxivga o'tkaziladi</p>
                                </div>
                            </div>
                            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                                <span className="font-bold text-gray-700">"{group.name}"</span> guruhini arxivga o'tkazmoqchimisiz?
                                Arxivdagi guruhni keyinchalik qayta tiklash mumkin.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    disabled={deleteLoading}
                                    className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50"
                                >
                                    {deleteLoading ? <><CircularProgress size={14} color="inherit" />Arxivlanmoqda...</> : "Ha, arxivlash"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Edit Drawer ── */}
            <>
                <div
                    onClick={() => setEditDrawer(false)}
                    className={`fixed inset-0 z-[200] bg-black/20 transition-opacity duration-300 ${editDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                />
                <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[300] flex flex-col transition-transform duration-300 ease-in-out ${editDrawer ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-[18.5px] font-bold text-gray-800">Guruhni tahrirlash</h3>
                            <p className="text-[14px] text-gray-400 mt-0.5">Guruh ma'lumotlarini yangilang</p>
                        </div>
                        <IconButton onClick={() => setEditDrawer(false)} sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563", backgroundColor: "#f9fafb" } }}>
                            <X size={16} />
                        </IconButton>
                    </div>
                    <div className="flex-1 px-6 py-6">
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-2 block">
                            Nomi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all"
                            placeholder="Guruh nomi"
                        />
                    </div>
                    <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={() => setEditDrawer(false)}
                            className="flex-1 h-10 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={handlePatch}
                            disabled={saving || !editForm.name.trim()}
                            className="flex-1 h-10 rounded-xl bg-violet-600 text-[13px] font-bold text-white hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? <><CircularProgress size={14} color="inherit" />Saqlanmoqda...</> : "Saqlash"}
                        </button>
                    </div>
                </div>
            </>
        </div>
    )
}
