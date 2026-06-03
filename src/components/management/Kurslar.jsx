import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, X, Clock, Calendar, CreditCard, ChevronDown, ArchiveRestore, Trash } from "lucide-react"
import { Button, IconButton, Tooltip, CircularProgress, Alert } from "@mui/material"
import api from "../../api"

const courseColors = [
    { bg: "bg-white",     border: "border-gray-100",   tag: "bg-gray-50" },
    { bg: "bg-purple-50", border: "border-purple-100", tag: "bg-purple-100/60" },
    { bg: "bg-yellow-50", border: "border-yellow-100", tag: "bg-yellow-100/60" },
    { bg: "bg-green-50",  border: "border-green-100",  tag: "bg-green-100/60" },
]

const colorOptions = [
    "#1e293b", "#7c3aed", "#dc2626", "#ea580c",
    "#16a34a", "#0891b2", "#2563eb", "#9333ea", "#db2777",
]

const durationOptions = ["30 min", "45 min", "60 min", "90 min", "120 min"]
const monthOptions    = ["1 oy", "2 oy", "3 oy", "4 oy", "6 oy", "12 oy"]
const kursFilials     = ["Filial 1", "Filial 2", "Arxiv"]

const emptyForm = {
    name: "", price: "", duration: "90 min", months: "3 oy",
    desc: "", filials: ["Filial 1", "Filial 2"], color: "#7c3aed"
}

function CustomSelect({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 bg-white hover:border-violet-300 transition-all focus:outline-none"
            >
                <span className={value ? "text-gray-700" : "text-gray-400"}>{value || placeholder}</span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                    {options.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false) }}
                            className={`w-full text-left px-4 py-2.5 text-[14.5px] hover:bg-violet-50 hover:text-violet-600 transition-all
                                ${value === opt ? "bg-violet-50 text-violet-600 font-semibold" : "text-gray-600"}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function KursDrawer({ open, onClose, editCourse, onSave }) {
    const [form, setForm] = useState(editCourse || emptyForm)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (editCourse) {
                setForm({
                    name: editCourse.name || "",
                    price: String(editCourse.price || ""),
                    duration: editCourse.duration || "90 min",
                    months: editCourse.months || "3 oy",
                    desc: editCourse.desc || "",
                    filials: editCourse.filials || ["Filial 1"],
                    color: editCourse.color || "#7c3aed"
                })
            } else {
                setForm(emptyForm)
            }
        }, 0)
        return () => clearTimeout(timer)
    }, [editCourse])

    const toggleFilial = (f) => {
        setForm(prev => ({
            ...prev,
            filials: prev.filials.includes(f)
                ? prev.filials.filter(x => x !== f)
                : [...prev.filials, f]
        }))
    }

    const selectAll = () => setForm(prev => ({ ...prev, filials: kursFilials }))

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-300
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />
            <div
                className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-[300] flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h3 className="text-[18.5px] font-bold text-gray-800">
                            {editCourse ? "Kursni tahrirlash" : "Kurs qo'shish"}
                        </h3>
                        <p className="text-[14px] text-gray-400 mt-0.5">
                            Bu yerda siz kurs ma'lumotlarini kiritishingiz mumkin.
                        </p>
                    </div>
                    <IconButton onClick={onClose} sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563", backgroundColor: "#f9fafb" } }}>
                        <X size={16} />
                    </IconButton>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-5">
                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-1.5 block">Nomi</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="HR Manager..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[14.5px] font-semibold text-gray-700">Kurs mavjud bo'ladigan filiallar</label>
                            <button onClick={selectAll} className="text-[13.5px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">Hammasini tanlash</button>
                        </div>
                        <div className="space-y-2">
                            {kursFilials.map(f => (
                                <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                                    <div
                                        onClick={() => toggleFilial(f)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                                            ${form.filials?.includes(f) ? "bg-violet-600 border-violet-600" : "border-gray-300 hover:border-violet-400"}`}
                                    >
                                        {form.filials?.includes(f) && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[14.5px] text-gray-600 group-hover:text-gray-800 transition-colors">{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-1.5 block">Dars davomiyligi</label>
                        <CustomSelect value={form.duration} onChange={v => setForm({ ...form, duration: v })} options={durationOptions} placeholder="Tanlang" />
                    </div>

                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-1.5 block">Kurs davomiyligi (oylarda)</label>
                        <CustomSelect value={form.months} onChange={v => setForm({ ...form, months: v })} options={monthOptions} placeholder="Tanlang" />
                    </div>

                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-1.5 block">Narx</label>
                        <div className="relative">
                            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                placeholder="Narxini kiriting"
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-1.5 block">Description</label>
                        <textarea
                            rows={4}
                            value={form.desc}
                            onChange={e => setForm({ ...form, desc: e.target.value })}
                            placeholder="A little about the company and the team that you'll be working with."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all resize-none"
                        />
                        <p className="text-[13px] text-gray-400 mt-1">This is a hint text to help user.</p>
                    </div>

                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-0.5 block">Rangi</label>
                        <p className="text-[13.5px] text-gray-400 mb-3">The color you choose will be displayed to users and in the list of roles.</p>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setForm({ ...form, color })}
                                    className={`w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95
                                        ${form.color === color ? "ring-2 ring-offset-2 ring-violet-500 scale-110" : ""}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <Button onClick={onClose} variant="outlined" fullWidth sx={{ textTransform: "none", height: 40, borderRadius: "12px", borderColor: "#e5e7eb", fontSize: "13px", fontWeight: "800", color: "#4b5563", "&:hover": { backgroundColor: "#f9fafb", borderColor: "#d1d5db" } }}>
                        Bekor qilish
                    </Button>
                    <Button onClick={() => onSave(form)} variant="contained" fullWidth sx={{ textTransform: "none", height: 40, borderRadius: "12px", backgroundColor: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "800", boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)", "&:hover": { backgroundColor: "#6d28d9" } }}>
                        Saqlash
                    </Button>
                </div>
            </div>
        </>
    )
}

export default function Kurslar() {
    const [activeFilial, setActiveFilial] = useState("Filial 1")
    const [courses, setCourses]           = useState([])
    const [archivedIds, setArchivedIds]   = useState(() => {
        try {
            const saved = localStorage.getItem("archivedCourseIds")
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })
    const [showDrawer, setShowDrawer]     = useState(false)
    const [editCourse, setEditCourse]     = useState(null)
    const [loading, setLoading]           = useState(false)
    const [error, setError]               = useState("")

    // Arxivga o'tkazish modal
    const [archiveId, setArchiveId]       = useState(null)
    const [archiveLoading, setArchiveLoading] = useState(false)

    // Butunlay o'chirish modal
    const [deleteId, setDeleteId]         = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Qayta tiklash modal
    const [restoreId, setRestoreId]       = useState(null)
    const [restoreLoading, setRestoreLoading] = useState(false)

    const fetchCourses = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get("/courses")
            const backendData = response.data?.data || []
            const mappedCourses = backendData.map((c, index) => ({
                id: c.id,
                name: c.name,
                desc: c.description || "",
                price: String(c.price || "0"),
                duration: `${c.duration_hours || 90} min`,
                months: `${c.duration_month || 3} oy`,
                colorIdx: index % courseColors.length,
                color: "#7c3aed",
                filials: ["Filial 1", "Filial 2"]
            }))
            setCourses(mappedCourses)
            
            // Backendda yo'q bo'lib ketgan kurs idlarini arxivdan ham tozalash
            setArchivedIds(prev => prev.filter(id => mappedCourses.some(c => c.id === id)))
        } catch (err) {
            console.error("Kurslarni yuklashda xato:", err)
            setError("Kurslarni yuklashda muammo yuz berdi. Tarmoqni tekshiring.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchCourses(), 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        localStorage.setItem("archivedCourseIds", JSON.stringify(archivedIds))
    }, [archivedIds])

    const openAdd    = () => { setEditCourse(null); setShowDrawer(true) }
    const openEdit   = (course) => { setEditCourse(course); setShowDrawer(true) }
    const handleClose = () => { setShowDrawer(false); setEditCourse(null) }

    // Arxivga o'tkazish (soft delete)
    const handleArchive = async () => {
        setArchiveLoading(true)
        try {
            // Agar backendda arxiv endpoint bo'lsa: await api.patch(`/courses/${archiveId}/archive`)
            setArchivedIds(prev => [...prev, archiveId])
            setArchiveId(null)
        } catch (err) {
            console.error("Arxivlashda xato:", err)
            setError("Kursni arxivlashda xatolik yuz berdi.")
            setArchiveId(null)
        } finally {
            setArchiveLoading(false)
        }
    }

    // Arxivdan qayta tiklash
    const handleRestore = async () => {
        setRestoreLoading(true)
        try {
            // Agar backendda restore endpoint bo'lsa: await api.patch(`/courses/${restoreId}/restore`)
            setArchivedIds(prev => prev.filter(id => id !== restoreId))
            setRestoreId(null)
        } catch (err) {
            console.error("Qayta tiklashda xato:", err)
            setError("Kursni qayta tiklashda xatolik yuz berdi.")
            setRestoreId(null)
        } finally {
            setRestoreLoading(false)
        }
    }

    // Butunlay o'chirish (faqat arxivdan)
    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await api.delete(`/courses/${deleteId}`)
            setCourses(prev => prev.filter(c => c.id !== deleteId))
            setArchivedIds(prev => prev.filter(id => id !== deleteId))
            setDeleteId(null)
        } catch (err) {
            console.error("Kursni o'chirishda xato:", err)
            setError("Kursni o'chirishda xatolik yuz berdi.")
            setDeleteId(null)
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleSave = async (form) => {
        if (!form.name.trim()) return
        setLoading(true)
        try {
            const priceNum = Number(form.price.replace(/[^0-9]/g, "")) || 0
            const monthNum = Number(form.months.replace(/[^0-9]/g, "")) || 3
            const hourNum  = Number(form.duration.replace(/[^0-9]/g, "")) || 90

            const payload = {
                name: form.name,
                description: form.desc || "Kurs haqida batafsil ma'lumot",
                price: priceNum,
                duration_month: monthNum,
                duration_hours: hourNum
            }

            if (editCourse) {
                await api.patch(`/courses/${editCourse.id}`, payload)
                await fetchCourses()
            } else {
                await api.post("/courses", payload)
                await fetchCourses()
            }
            handleClose()
        } catch (err) {
            console.error("Kursni saqlashda xato:", err)
            setError("Kursni saqlashda xatolik yuz berdi.")
        } finally {
            setLoading(false)
        }
    }

    // Filtratsiya: Arxiv tabida arxivdagilar, boshqalarda arxivda bo'lmaganlar
    const visibleCourses = activeFilial === "Arxiv"
        ? courses.filter(c => archivedIds.includes(c.id))
        : courses.filter(c => !archivedIds.includes(c.id))

    const archiveCourse  = courses.find(c => c.id === archiveId)
    const deleteCourse   = courses.find(c => c.id === deleteId)
    const restoreCourse  = courses.find(c => c.id === restoreId)

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[21.5px] font-bold text-[#1f2d5a]">Kurslar</h2>
                {activeFilial !== "Arxiv" && (
                    <Button
                        variant="contained"
                        onClick={openAdd}
                        startIcon={<Plus size={15} />}
                        sx={{ textTransform: "none", backgroundColor: "#7c3aed", color: "white", borderRadius: "12px", fontSize: "13px", fontWeight: "800", px: 3, py: 1.2, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)", "&:hover": { backgroundColor: "#6d28d9" } }}
                    >
                        Kurslar qo'shish
                    </Button>
                )}
            </div>

            {/* Filial filters */}
            <div className="flex items-center gap-2 mb-5">
                {kursFilials.map(f => {
                    const isArchive = f === "Arxiv"
                    const count = isArchive ? courses.filter(c => archivedIds.includes(c.id)).length : null
                    return (
                        <Button
                            key={f}
                            onClick={() => setActiveFilial(f)}
                            variant="outlined"
                            sx={{
                                textTransform: "none", height: 32, borderRadius: "12px", fontSize: "13px", fontWeight: "600", px: 2.5,
                                backgroundColor: activeFilial === f ? (isArchive ? "#f59e0b" : "#7c3aed") : "white",
                                borderColor: activeFilial === f ? (isArchive ? "#f59e0b" : "#7c3aed") : "#e5e7eb",
                                color: activeFilial === f ? "white" : "#6b7280",
                                "&:hover": {
                                    backgroundColor: activeFilial === f ? (isArchive ? "#d97706" : "#6d28d9") : "#f9fafb",
                                    borderColor: activeFilial === f ? (isArchive ? "#d97706" : "#6d28d9") : "#d1d5db"
                                }
                            }}
                        >
                            {f}
                            {isArchive && count > 0 && (
                                <span className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeFilial === f ? "bg-white/30 text-white" : "bg-amber-100 text-amber-600"}`}>
                                    {count}
                                </span>
                            )}
                        </Button>
                    )
                })}
            </div>

            {/* Arxiv banner */}
            {activeFilial === "Arxiv" && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-[13.5px] text-amber-700">
                        Bu yerda o'chirilgan kurslar saqlanadi. Ularni qayta tiklash yoki butunlay o'chirish mumkin.
                    </span>
                </div>
            )}

            {error && <Alert severity="error" className="mb-4 rounded-xl">{error}</Alert>}

            {/* Course cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <CircularProgress sx={{ color: "#7c3aed" }} />
                </div>
            ) : visibleCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
                    <div>
                        <p className="text-[16.5px] font-extrabold text-[#1f2d5a]">Hech qanday kurs topilmadi.</p>
                        <p className="mt-1 text-[14.5px] text-gray-400">
                            {activeFilial === "Arxiv" ? "Arxivda kurs topilmadi." : "Kurslar ro'yxatini qayta yuklab ko'ring yoki yangi kurs qo'shing."}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {activeFilial === "Arxiv" && (
                            <Button onClick={() => setActiveFilial("Filial 1")} variant="contained" sx={{ textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}>
                                Asosiy ro'yxatga qaytish
                            </Button>
                        )}
                        <Button onClick={fetchCourses} variant="outlined" sx={{ textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", borderColor: "#e5e7eb", color: "#4b5563" }}>
                            Qayta yuklash
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {visibleCourses.map((course) => {
                        const color = courseColors[course.colorIdx ?? 0]
                        const isArchived = archivedIds.includes(course.id)
                        return (
                            <div
                                key={course.id}
                                className={`group flex flex-col p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all
                                    ${isArchived ? "bg-amber-50 border-amber-100 opacity-80" : `${color.bg} ${color.border}`}`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-[15px] font-bold text-[#1f2d5a] leading-snug flex-1">{course.name}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {isArchived ? (
                                            <>
                                                {/* Qayta tiklash */}
                                                <Tooltip title="Qayta tiklash">
                                                    <IconButton
                                                        onClick={() => setRestoreId(course.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#f59e0b", backgroundColor: "#fffbeb" }, borderRadius: "8px" }}
                                                    >
                                                        <ArchiveRestore size={13} />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* Butunlay o'chirish */}
                                                <Tooltip title="Butunlay o'chirish">
                                                    <IconButton
                                                        onClick={() => setDeleteId(course.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" }, borderRadius: "8px" }}
                                                    >
                                                        <Trash size={13} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                {/* Arxivga o'tkazish */}
                                                <Tooltip title="Arxivga o'tkazish">
                                                    <IconButton
                                                        onClick={() => setArchiveId(course.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#f59e0b", backgroundColor: "#fffbeb" }, borderRadius: "8px" }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* Tahrirlash */}
                                                <Tooltip title="Tahrirlash">
                                                    <IconButton
                                                        onClick={() => openEdit(course)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed", backgroundColor: "#f5f3ff" }, borderRadius: "8px" }}
                                                    >
                                                        <Pencil size={13} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[13.5px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">{course.desc}</p>
                                <div className="flex items-center gap-2 flex-wrap mt-auto">
                                    <span className={`flex items-center gap-1 text-[12.5px] font-semibold text-gray-500 px-2 py-1 rounded-lg ${isArchived ? "bg-amber-100/60" : color.tag}`}>
                                        <Clock size={11} /> {course.duration}
                                    </span>
                                    <span className={`flex items-center gap-1 text-[12.5px] font-semibold text-gray-500 px-2 py-1 rounded-lg ${isArchived ? "bg-amber-100/60" : color.tag}`}>
                                        <Calendar size={11} /> {course.months}
                                    </span>
                                    {isArchived && (
                                        <span className="flex items-center gap-1 text-[12px] font-semibold text-amber-600 px-2 py-1 rounded-lg bg-amber-100/60 ml-auto">
                                            Arxivda
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Drawer */}
            <KursDrawer
                key={editCourse?.id || "new-course"}
                open={showDrawer}
                onClose={handleClose}
                editCourse={editCourse}
                onSave={handleSave}
            />

            {/* Arxivga o'tkazish Modal */}
            {archiveId && (
                <>
                    <div onClick={() => setArchiveId(null)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px]">
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Kursni arxivga o'tkazish</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{archiveCourse?.name}"</span> kursini arxivga o'tkazmoqchimisiz?
                                Kurs o'chirilmaydi — arxivdan qayta tiklash mumkin bo'ladi.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setArchiveId(null)}
                                    disabled={archiveLoading}
                                    className="px-5 py-2 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleArchive}
                                    disabled={archiveLoading}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50"
                                >
                                    {archiveLoading ? <><CircularProgress size={14} color="inherit" />Arxivlanmoqda...</> : "Arxivga o'tkazish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Qayta tiklash Modal */}
            {restoreId && (
                <>
                    <div onClick={() => setRestoreId(null)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px]">
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Kursni qayta tiklash</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{restoreCourse?.name}"</span> kursini arxivdan qaytarib olmoqchimisiz?
                                Kurs yana faol ro'yxatga qo'shiladi.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setRestoreId(null)}
                                    disabled={restoreLoading}
                                    className="px-5 py-2 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleRestore}
                                    disabled={restoreLoading}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-semibold bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-50"
                                >
                                    {restoreLoading ? <><CircularProgress size={14} color="inherit" />Tiklanmoqda...</> : "Qayta tiklash"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Butunlay o'chirish Modal */}
            {deleteId && (
                <>
                    <div onClick={() => setDeleteId(null)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px]">
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Kursni butunlay o'chirish</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{deleteCourse?.name}"</span> kursini butunlay o'chirishni tasdiqlaysizmi?
                                <span className="block mt-1 text-red-500 font-semibold">Bu amalni qaytarib bo'lmaydi!</span>
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    disabled={deleteLoading}
                                    className="px-5 py-2 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deleteLoading ? <><CircularProgress size={14} color="inherit" />O'chirilmoqda...</> : "Ha, butunlay o'chirish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
