import { useMemo, useState } from 'react'
import { 
    Plus, Search, Filter, Trash2, Pencil,
    DownloadCloud, X, AlertCircle, Mail, Calendar, Upload
} from "lucide-react"

// ─── Custom Confirm Modal ──────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, message, type = "danger" }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" onClick={onClose} />
            <div className="relative bg-white w-full max-w-[380px] rounded-[28px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-50 text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${type === "danger" ? "bg-red-50 text-red-500" : "bg-violet-50 text-violet-500"}`}><AlertCircle size={32} /></div>
                <h3 className="text-[19px] font-bold text-[#1f2d5a] mb-2">{title}</h3>
                <p className="text-[13.5px] text-gray-400 leading-relaxed mb-8 px-2">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-100 text-[14px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Bekor qilish</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 rounded-2xl text-[14px] font-bold text-white transition-all shadow-lg ${type === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-100" : "bg-violet-600 hover:bg-violet-700 shadow-violet-100"}`}>Ha, o'chirish</button>
                </div>
            </div>
        </div>
    )
}

const initialTeachers = [
    { id: 1, name: "Qwerty qwert", avatar: "https://i.pravatar.cc/150?u=1", groups: ["Label", "Label", "Label", "+4"], phone: "+998(33)4082808", birth: "2022-01-24", created: "24 Jan 2022", coins: "123 123" },
]

const emptyForm = { 
    phone: "+998", 
    email: "", 
    name: "", 
    birth: "1990-03-01", 
    groups: ["dFDFASC", "JDCCXH"],
    gender: "Erkak",
    imageName: "",
}

export default function Teachers() {
    const [teachers, setTeachers] = useState(initialTeachers)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDrawer, setShowDrawer] = useState(false)
    const [editTeacher, setEditTeacher] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [exported, setExported] = useState(false)

    const [modalConfig, setModalConfig] = useState({ open: false, onConfirm: () => {}, title: "", message: "" })

    const filteredTeachers = useMemo(() => teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())), [teachers, searchQuery])

    const handleClose = () => { setShowDrawer(false); setEditTeacher(null); }

    const openAdd = () => {
        setEditTeacher(null)
        setForm(emptyForm)
        setShowDrawer(true)
    }

    const openEdit = (teacher) => {
        setEditTeacher(teacher)
        setForm({
            ...emptyForm,
            name: teacher.name,
            phone: teacher.phone,
            birth: teacher.birth.split(" ").length === 3 ? "1990-03-01" : teacher.birth,
        })
        setShowDrawer(true)
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setForm((current) => ({ ...current, imageName: file.name }))
    }

    const handleDelete = (id) => {
        setModalConfig({
            open: true,
            title: "O'chirishni tasdiqlaysizmi?",
            message: "Ushbu o'qituvchi tizimdan o'chib ketadi.",
            onConfirm: () => setTeachers(prev => prev.filter(t => t.id !== id))
        })
    }

    const handleSave = () => {
        if (!form.name.trim() || form.phone.length < 5) {
            alert("Iltimos, ism va telefon raqamini to'liq kiriting!")
            return
        }

        if (editTeacher) {
            setTeachers(teachers.map(t => t.id === editTeacher.id ? { ...t, name: form.name, phone: form.phone, birth: form.birth } : t))
        } else {
            setTeachers([{
                id: Date.now(),
                name: form.name,
                phone: form.phone,
                birth: form.birth,
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                groups: form.groups,
                created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                coins: "0"
            }, ...teachers])
        }
        handleClose()
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[26px] font-extrabold text-[#1f2d5a] tracking-tight">O'qituvchilar</h1>
                    <p className="text-[13.5px] text-gray-400 mt-1">Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setExported(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#1f2d5a] rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all"
                    >
                        <DownloadCloud size={16} />{exported ? "Export tayyor" : "Export"}
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[13px] font-bold hover:bg-violet-700 shadow-lg transition-all active:scale-95"><Plus size={16} />O'qituvchi qo'shish</button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[13px] font-semibold transition-all ${
                        filtersOpen
                            ? "bg-violet-50 border-violet-200 text-violet-600"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                >
                    <Filter size={16} />Filters
                </button>
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[280px] pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[13px] text-[#1f2d5a] focus:outline-none focus:border-violet-300 shadow-sm" />
                </div>
            </div>
            {filtersOpen && (
                <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-[12px] font-semibold text-violet-600">
                    Filterlar yoqildi: qidiruv orqali o'qituvchilarni saralashingiz mumkin.
                </div>
            )}

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/30 font-bold text-gray-400 text-[12px] uppercase">
                            <th className="px-6 py-4 w-[60px]"><div className="w-5 h-5 rounded-md border-2 border-gray-200" /></th>
                            <th className="px-4 py-4">Nomi</th><th className="px-4 py-4">Guruh</th><th className="px-4 py-4">Telefon</th><th className="px-4 py-4">Tug'ilgan sana</th><th className="px-4 py-4">Yaratilgan</th><th className="px-4 py-4">Coin</th><th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-violet-50/20 transition-all">
                                <td className="px-6 py-4"><div className="w-5 h-5 rounded-md border-2 border-gray-200" /></td>
                                <td className="px-4 py-4"><div className="flex items-center gap-3"><img src={item.avatar} className="w-10 h-10 rounded-full" /><span className="text-[14px] font-bold text-[#1f2d5a]">{item.name}</span></div></td>
                                <td className="px-4 py-4"><div className="flex items-center gap-1.5">{item.groups.map((g, i) => (<span key={i} className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-gray-400">{g}</span>))}</div></td>
                                <td className="px-4 py-4 text-[13px] font-semibold text-gray-500">{item.phone}</td><td className="px-4 py-4 text-[13px] font-semibold text-gray-500">{item.birth}</td><td className="px-4 py-4 text-[13px] font-semibold text-gray-500">{item.created}</td>
                                <td className="px-4 py-4"><div className="flex items-center gap-2 text-[13px] font-extrabold text-[#f2994a]"><div className="w-2.5 h-2.5 rounded-full bg-[#f2994a]" />{item.coins}</div></td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-violet-600"><Pencil size={17} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={17} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Right Drawer */}
            <div onClick={handleClose} className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-300 ${showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
            <div className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl z-[300] flex flex-col transition-transform duration-300 ease-in-out ${showDrawer ? "translate-x-0" : "translate-x-full"}`}>
                
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-800">{editTeacher ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}</h3>
                        <p className="text-[12.5px] text-gray-400 mt-0.5">Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
                </div>

                <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">Telefon raqam</label>
                        <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:border-violet-400 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">Mail</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Elektron pochtani kiriting" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:border-violet-400 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">O'qituvchi FIO</label>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ma'lumotni kiriting" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:border-violet-400 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">Tug'ilgan sanasi</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="date" value={form.birth} onChange={e => setForm({...form, birth: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:border-violet-400 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[13px] font-semibold text-gray-700">Jinsi</label>
                        <div className="flex items-center gap-6">
                            {["Erkak", "Ayol"].map(g => (
                                <label key={g} className="flex items-center gap-2.5 cursor-pointer">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.gender === g ? "border-violet-600" : "border-gray-200"}`}>
                                        {form.gender === g && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                                    </div>
                                    <span className="text-[13px] text-gray-600 font-medium">{g}</span>
                                    <input type="radio" className="hidden" name="gender" onChange={() => setForm({...form, gender: g})} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">Surati</label>
                        <label className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/30 cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 mb-2"><Upload size={18} /></div>
                            <p className="max-w-[260px] truncate text-[12px] font-semibold text-gray-600">
                                {form.imageName || "Click to upload or drag and drop"}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-gray-400">
                                JPG or PNG (max. 2 MB)
                            </p>
                        </label>
                    </div>
                </div>

                <div className="px-6 py-6 border-t border-gray-50 flex justify-end gap-3 mt-auto">
                    <button onClick={handleClose} className="px-6 py-2.5 rounded-xl border border-gray-100 text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Bekor qilish</button>
                    <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-[13px] font-bold hover:bg-violet-700 shadow-lg transition-all active:scale-95">Saqlash</button>
                </div>
            </div>

            <ConfirmModal open={modalConfig.open} onClose={() => setModalConfig({...modalConfig, open: false})} onConfirm={modalConfig.onConfirm} title={modalConfig.title} message={modalConfig.message} />
        </div>
    )
}
