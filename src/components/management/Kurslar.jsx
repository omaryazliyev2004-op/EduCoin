import { useState } from 'react'
import { Plus, Trash2, Pencil, X, Clock, Calendar, CreditCard, ChevronDown } from "lucide-react"

// Card background colors for course grid
const courseColors = [
    { bg: "bg-white",     border: "border-gray-100",   tag: "bg-gray-50" },
    { bg: "bg-purple-50", border: "border-purple-100", tag: "bg-purple-100/60" },
    { bg: "bg-yellow-50", border: "border-yellow-100", tag: "bg-yellow-100/60" },
    { bg: "bg-green-50",  border: "border-green-100",  tag: "bg-green-100/60" },
]

// Color picker options for courses
const colorOptions = [
    "#1e293b", // dark slate
    "#7c3aed", // violet
    "#dc2626", // red
    "#ea580c", // orange
    "#16a34a", // green
    "#0891b2", // cyan
    "#2563eb", // blue
    "#9333ea", // purple
    "#db2777", // pink
]

// Dropdown options
const durationOptions = ["30 min", "45 min", "60 min", "90 min", "120 min"]
const monthOptions    = ["1 oy", "2 oy", "3 oy", "4 oy", "6 oy", "12 oy"]

const kursFilials = ["Filial 1", "Filial 2", "Arxiv"]

const initialCourses = [
    { id: 1, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 0 },
    { id: 2, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 1 },
    { id: 3, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 2 },
    { id: 4, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 3 },
    { id: 5, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 0 },
    { id: 6, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 1 },
]

const emptyForm = {
    name: "", price: "", duration: "", months: "",
    desc: "", filials: ["Filial 1", "Filial 2"], color: "#7c3aed"
}

// ─── Custom Select ────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-500 bg-white hover:border-violet-300 transition-all focus:outline-none"
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
                            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-violet-50 hover:text-violet-600 transition-all
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

// ─── Drawer ───────────────────────────────────────────────────────
function KursDrawer({ open, onClose, editCourse, onSave }) {
    const [form, setForm] = useState(editCourse || emptyForm)

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
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-300
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-[300] flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-800">
                            {editCourse ? "Kursni tahrirlash" : "Kurs qo'shish"}
                        </h3>
                        <p className="text-[12.5px] text-gray-400 mt-0.5">
                            Bu yerda siz yangi Sovg'a qo'shishingiz mumkin.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all mt-0.5"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-5">

                    {/* Nomi */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Nomi</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="HR Manager..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all"
                        />
                    </div>

                    {/* Filiallar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold text-gray-700">
                                Kurs mavjud boledigon filiallar
                            </label>
                            <button
                                onClick={selectAll}
                                className="text-[12px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                            >
                                Hammasini tanlash
                            </button>
                        </div>
                        <div className="space-y-2">
                            {kursFilials.map(f => (
                                <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                                    <div
                                        onClick={() => toggleFilial(f)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                                            ${form.filials?.includes(f)
                                                ? "bg-violet-600 border-violet-600"
                                                : "border-gray-300 hover:border-violet-400"
                                            }`}
                                    >
                                        {form.filials?.includes(f) && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[13px] text-gray-600 group-hover:text-gray-800 transition-colors">{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dars davomiyligi */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Dars davomiyligi</label>
                        <CustomSelect
                            value={form.duration}
                            onChange={v => setForm({ ...form, duration: v })}
                            options={durationOptions}
                            placeholder="Tanlang"
                        />
                    </div>

                    {/* Kurs davomiyligi */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Kurs davomiyligi (oylarda)</label>
                        <CustomSelect
                            value={form.months}
                            onChange={v => setForm({ ...form, months: v })}
                            options={monthOptions}
                            placeholder="Tanlang"
                        />
                    </div>

                    {/* Narx */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Narx</label>
                        <div className="relative">
                            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                placeholder="Narxini kiriting"
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Description</label>
                        <textarea
                            rows={4}
                            value={form.desc}
                            onChange={e => setForm({ ...form, desc: e.target.value })}
                            placeholder="A little about the company and the team that you'll be working with."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all resize-none"
                        />
                        <p className="text-[11.5px] text-gray-400 mt-1">This is a hint text to help user.</p>
                    </div>

                    {/* Rangi */}
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-0.5 block">Rangi</label>
                        <p className="text-[12px] text-gray-400 mb-3">The color you choose will be displayed to users and in the list of roles.</p>
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

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-[13px] font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all active:scale-95"
                    >
                        Saqlash
                    </button>
                </div>
            </div>
        </>
    )
}

// ─── Main Component ───────────────────────────────────────────────
export default function Kurslar() {
    const [activeFilial, setActiveFilial] = useState("Filial 1")
    const [courses, setCourses] = useState(initialCourses)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editCourse, setEditCourse] = useState(null)

    const openAdd = () => {
        setEditCourse(null)
        setShowDrawer(true)
    }

    const openEdit = (course) => {
        setEditCourse(course)
        setShowDrawer(true)
    }

    const handleClose = () => {
        setShowDrawer(false)
        setEditCourse(null)
    }

    const handleDelete = (id) => setCourses(courses.filter(c => c.id !== id))

    const handleSave = (form) => {
        if (!form.name.trim()) return
        if (editCourse) {
            setCourses(courses.map(c => c.id === editCourse.id ? { ...c, ...form } : c))
        } else {
            const colorIdx = courses.length % courseColors.length
            setCourses([...courses, { id: Date.now(), ...form, colorIdx }])
        }
        handleClose()
    }

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-bold text-[#1f2d5a]">Kurslar</h2>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[13px] font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all active:scale-95"
                >
                    <Plus size={15} />
                    Kurslar qo'shish
                </button>
            </div>

            {/* Filial filters */}
            <div className="flex items-center gap-2 mb-5">
                {kursFilials.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilial(f)}
                        className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all border
                            ${activeFilial === f
                                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100"
                                : "bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Course cards grid */}
            <div className="grid grid-cols-4 gap-4">
                {courses.map((course) => {
                    const color = courseColors[course.colorIdx ?? 0]
                    return (
                        <div
                            key={course.id}
                            className={`group flex flex-col p-4 rounded-2xl border ${color.bg} ${color.border} shadow-sm hover:shadow-md transition-all`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-[13.5px] font-bold text-[#1f2d5a] leading-snug flex-1">{course.name}</p>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <button
                                        onClick={() => openEdit(course)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-violet-100 text-gray-400 hover:text-violet-600 transition-all"
                                    >
                                        <Pencil size={13} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[12px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">{course.desc}</p>

                            <div className="flex items-center gap-2 flex-wrap mt-auto">
                                <span className={`flex items-center gap-1 text-[11px] font-semibold text-gray-500 px-2 py-1 rounded-lg ${color.tag}`}>
                                    <Clock size={11} /> {course.duration}
                                </span>
                                <span className={`flex items-center gap-1 text-[11px] font-semibold text-gray-500 px-2 py-1 rounded-lg ${color.tag}`}>
                                    <Calendar size={11} /> {course.months}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Drawer */}
            <KursDrawer
                key={editCourse?.id || "new-course"}
                open={showDrawer}
                onClose={handleClose}
                editCourse={editCourse}
                onSave={handleSave}
            />
        </div>
    )
}
