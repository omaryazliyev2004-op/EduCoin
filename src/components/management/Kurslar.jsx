import { useState } from 'react'
import { Plus, Trash2, Pencil, X, Clock, Calendar, BadgeDollarSign } from "lucide-react"

const courseColors = [
    { bg: "bg-white",     border: "border-gray-100",   tag: "bg-gray-50" },
    { bg: "bg-purple-50", border: "border-purple-100", tag: "bg-purple-100/60" },
    { bg: "bg-yellow-50", border: "border-yellow-100", tag: "bg-yellow-100/60" },
    { bg: "bg-green-50",  border: "border-green-100",  tag: "bg-green-100/60" },
]

const kursFilials = ["Filial 1", "Filial 2", "Arxiv"]

const initialCourses = [
    { id: 1, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 0 },
    { id: 2, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 1 },
    { id: 3, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 2 },
    { id: 4, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 3 },
    { id: 5, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 0 },
    { id: 6, name: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with.", duration: "90 min", months: "3 oy", price: "1 000 000 mln", colorIdx: 1 },
]

const drawerFields = [
    { key: "name",     label: "Kurs nomi",    placeholder: "Human Resources Manager",  type: "text" },
    { key: "desc",     label: "Tavsif",       placeholder: "Kurs haqida qisqacha...",  type: "textarea" },
    { key: "duration", label: "Davomiyligi",  placeholder: "Masalan: 90 min",          type: "text" },
    { key: "months",   label: "Muddat",       placeholder: "Masalan: 3 oy",            type: "text" },
    { key: "price",    label: "Narxi",        placeholder: "Masalan: 1 000 000 mln",   type: "text" },
]

export default function Kurslar() {
    const [activeFilial, setActiveFilial] = useState("Filial 1")
    const [courses, setCourses] = useState(initialCourses)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editCourse, setEditCourse] = useState(null)
    const [form, setForm] = useState({ name: "", desc: "", duration: "", months: "", price: "" })

    const openAdd = () => {
        setEditCourse(null)
        setForm({ name: "", desc: "", duration: "", months: "", price: "" })
        setShowDrawer(true)
    }

    const openEdit = (course) => {
        setEditCourse(course)
        setForm({ name: course.name, desc: course.desc, duration: course.duration, months: course.months, price: course.price })
        setShowDrawer(true)
    }

    const handleClose = () => setShowDrawer(false)

    const handleDelete = (id) => setCourses(courses.filter(c => c.id !== id))

    const handleSave = () => {
        if (!form.name.trim()) return
        if (editCourse) {
            setCourses(courses.map(c => c.id === editCourse.id ? { ...c, ...form } : c))
        } else {
            const colorIdx = courses.length % courseColors.length
            setCourses([...courses, { id: Date.now(), ...form, colorIdx }])
        }
        setShowDrawer(false)
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
                                <span className={`flex items-center gap-1 text-[11px] font-semibold text-gray-500 px-2 py-1 rounded-lg ${color.tag}`}>
                                    <BadgeDollarSign size={11} /> {course.price}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 z-[200] bg-black/20 transition-opacity duration-300
                    ${showDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Right Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-[300] flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-[16px] font-bold text-[#1f2d5a]">
                        {editCourse ? "Kursni tahrirlash" : "Kurs qo'shish"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
                    {drawerFields.map(field => (
                        <div key={field.key}>
                            <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
                                {field.label} <span className="text-red-500">*</span>
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    rows={3}
                                    value={form[field.key]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[field.key]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-[13px] font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all active:scale-95"
                    >
                        Saqlash
                    </button>
                </div>
            </div>
        </div>
    )
}
