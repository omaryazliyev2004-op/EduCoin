import { useMemo, useState, useEffect } from 'react'
import { 
    Plus, Filter, Trash2, Pencil, Eye,
    X, AlertCircle, Mail, Calendar, Upload
} from "lucide-react"
import { Button, IconButton, Checkbox, CircularProgress, Alert } from "@mui/material"
import api from "../api"



// ─── Custom Confirm Modal ──────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, message, type = "danger", confirmText = "Ha, o'chirish" }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" onClick={onClose} />
            <div className="relative bg-white w-full max-w-[380px] rounded-[28px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-50 text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${type === "danger" ? "bg-red-50 text-red-500" : "bg-violet-50 text-violet-500"}`}><AlertCircle size={32} /></div>
                <h3 className="text-[20.5px] font-bold text-[#1f2d5a] mb-2">{title}</h3>
                <p className="text-[15px] text-gray-400 leading-relaxed mb-8 px-2">{message}</p>
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: "16px",
                            borderColor: "#f3f4f6",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#6b7280",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb"
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={() => { onConfirm(); onClose(); }}
                        variant="contained"
                        sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            textTransform: "none",
                            backgroundColor: type === "danger" ? "#ef4444" : "#7c3aed",
                            color: "white",
                            boxShadow: type === "danger" ? "0 10px 15px -3px rgba(239, 68, 68, 0.2)" : "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: type === "danger" ? "#dc2626" : "#6d28d9",
                                boxShadow: type === "danger" ? "0 10px 15px -3px rgba(220, 38, 38, 0.3)" : "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            }
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const emptyForm = { 
    phone: "+998", 
    email: "", 
    name: "", 
    birth: "1990-03-01", 
    groups: [],
    gender: "Erkak",
    imageName: "",
    imageFile: null,
    address: ""
}

export default function Teachers() {
    const [teachers, setTeachers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [showDrawer, setShowDrawer] = useState(false)
    const [editTeacher, setEditTeacher] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [archivedTeacherIds, setArchivedTeacherIds] = useState(() => {
        try {
            const saved = localStorage.getItem("archivedTeacherIds")
            if (!saved) return []
            const parsed = JSON.parse(saved)
            return Array.isArray(parsed) ? parsed : []
        } catch { return [] }
    })
    const [isArchiveView, setIsArchiveView] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const [modalConfig, setModalConfig] = useState({ open: false, onConfirm: () => {}, title: "", message: "", type: "danger", confirmText: "Ha, o'chirish" })

    useEffect(() => {
        if (Array.isArray(archivedTeacherIds)) {
            localStorage.setItem("archivedTeacherIds", JSON.stringify(archivedTeacherIds))
        }
    }, [archivedTeacherIds])

    
    // API orqali o'qituvchilarni yuklash
    const fetchTeachers = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get("/teachers")
            const backendData = response.data?.data || []
            
            const mappedTeachers = backendData.map((t) => ({
                id: t.id,
                name: t.full_name,
                avatar: t.photo 
                    ? `https://najot-edu.softwareengineer.uz/${t.photo}` 
                    : `https://i.pravatar.cc/150?u=${t.id}`,
                groups: t.groups || [],
                phone: t.phone || "",
                email: t.email || "moxirbek@gmail.com",
                birth: t.birth_date ? t.birth_date.substring(0, 10) : "1990-03-01",
                created: t.created_at 
                    ? new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
                    : "12.05.2026",
                coins: "0",
                address: t.address || "Tashkent"
            }))

            setTeachers(mappedTeachers)
            // Mavjud bo'lmagan arxiv IDlarini tozalash
            const fetchedIds = mappedTeachers.map(t => t.id)
            setArchivedTeacherIds(prev => prev.filter(id => fetchedIds.includes(id)))
        } catch (err) {
            console.error("O'qituvchilarni yuklashda xato:", err)
            setError("O'qituvchilar ma'lumotlarini yuklashda xatolik yuz berdi.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchTeachers(), 0)
        return () => clearTimeout(timer)
    }, [])

    const baseTeachers = isArchiveView 
        ? teachers.filter(t => archivedTeacherIds.includes(t.id)) 
        : teachers.filter(t => !archivedTeacherIds.includes(t.id))
    const filteredTeachers = useMemo(() => {
        return baseTeachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [baseTeachers, searchQuery])

    useEffect(() => {
        const timer = setTimeout(() => setCurrentPage(1), 0)
        return () => clearTimeout(timer)
    }, [searchQuery, isArchiveView])

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
    const displayedTeachers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredTeachers.slice(start, start + itemsPerPage)
    }, [filteredTeachers, currentPage])

    const isAllSelected = filteredTeachers.length > 0 && selectedIds.length === filteredTeachers.length
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredTeachers.length

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredTeachers.map(t => t.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id, checked) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id])
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id))
        }
    }

    const handleBulkDelete = () => {
        setModalConfig({
            open: true,
            title: isArchiveView ? "Tanlanganlarni butunlay o'chirish?" : "Tanlanganlarni arxivlash?",
            message: isArchiveView 
                ? `Siz haqiqatan ham tanlangan ${selectedIds.length} ta o'qituvchini butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!`
                : `Siz haqiqatan ham tanlangan ${selectedIds.length} ta o'qituvchini arxivga ko'chirmoqchimisiz?`,
            type: "danger",
            confirmText: isArchiveView ? "Ha, butunlay o'chirish" : "Arxivga o'tkazish",
            onConfirm: async () => {
                setLoading(true)
                setError("")
                try {
                    if (isArchiveView) {
                        // API orqali o'chirish
                        await Promise.all(selectedIds.map(id => api.delete(`/teachers/${id}`)))
                        setArchivedTeacherIds(prev => prev.filter(id => !selectedIds.includes(id)))
                        setTeachers(prev => prev.filter(t => !selectedIds.includes(t.id)))
                    } else {
                        // Soft delete (arxivga o'tkazish)
                        setArchivedTeacherIds(prev => [...new Set([...prev, ...selectedIds])])
                    }
                    setSelectedIds([])
                } catch (err) {
                    console.error("Bulk delete xato:", err)
                    setError("Tanlangan o'qituvchilarni o'chirishda xatolik yuz berdi.")
                } finally {
                    setLoading(false)
                }
            }
        })
    }

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
            email: `${teacher.phone.replace(/[^0-9]/g, "")}@tm-edu.uz`,
            birth: teacher.birth,
            address: teacher.address
        })
        setShowDrawer(true)
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setForm((current) => ({ ...current, imageName: file.name, imageFile: file }))
    }

    const handleRestore = (id) => {
        const teacher = teachers.find(t => t.id === id)
        setModalConfig({
            open: true,
            title: "O'qituvchini arxivdan qaytarish?",
            message: `Siz haqiqatan ham "${teacher?.name || ''}" o'qituvchisini arxivdan qayta tiklamoqchimisiz?`,
            type: "restore",
            confirmText: "Qayta tiklash",
            onConfirm: () => {
                setArchivedTeacherIds(prev => prev.filter(item => item !== id))
            }
        })
    }

    const handleDelete = (id) => {
        const teacher = teachers.find(t => t.id === id)
        setModalConfig({
            open: true,
            title: isArchiveView ? "Butunlay o'chirishni tasdiqlaysizmi?" : "O'chirishni tasdiqlaysizmi?",
            message: isArchiveView 
                ? `Ushbu o'qituvchi ("${teacher?.name || ''}") arxivdan butunlay o'chib ketadi. Bu amalni qaytarib bo'lmaydi!` 
                : `Ushbu o'qituvchi ("${teacher?.name || ''}") arxivga ko'chiriladi.`,
            type: isArchiveView ? "danger" : "danger",
            confirmText: isArchiveView ? "Ha, butunlay o'chirish" : "Arxivga o'tkazish",
            onConfirm: async () => {
                setLoading(true)
                setError("")
                try {
                    if (isArchiveView) {
                        await api.delete(`/teachers/${id}`)
                        setArchivedTeacherIds(prev => prev.filter(item => item !== id))
                        setTeachers(prev => prev.filter(t => t.id !== id))
                    } else {
                        setArchivedTeacherIds(prev => [...prev, id])
                    }
                } catch (err) {
                    console.error("Xato:", err)
                    setError("O'qituvchini o'chirishda xatolik yuz berdi.")
                } finally {
                    setLoading(false)
                }
            }
        })
    }

    const handleSave = async () => {
        if (!form.name.trim() || form.phone.length < 5) {
            alert("Iltimos, ism va telefon raqamini to'liq kiriting!")
            return
        }

        setLoading(true)
        setError("")
        try {
            if (editTeacher) {
                // Tahrirlashni API orqali saqlash
                const formData = new FormData()
                formData.append("full_name", form.name)
                formData.append("phone", form.phone)
                formData.append("email", form.email || `${form.phone.replace(/[^0-9]/g, "")}@tm-edu.uz`)
                formData.append("address", form.address || "Toshkent")
                
                if (form.imageFile) {
                    formData.append("photo", form.imageFile)
                }

                await api.patch(`/teachers/${editTeacher.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                
                await fetchTeachers()
            } else {
                // Yangi o'qituvchi qo'shish - Form data orqali (POST /teachers)
                const formData = new FormData()
                formData.append("full_name", form.name)
                formData.append("phone", form.phone)
                formData.append("email", form.email || `${form.phone.replace(/[^0-9]/g, "")}@tm-edu.uz`)
                formData.append("password", "Benazir99!") // Default admin yaratgan parol
                formData.append("address", form.address || "Toshkent")
                
                if (form.imageFile) {
                    formData.append("photo", form.imageFile)
                }

                await api.post("/teachers", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                
                // Muvaffaqiyatli saqlangach qayta yuklash
                await fetchTeachers()
            }
            setSelectedIds([])
            handleClose()
        } catch (err) {
            console.error("O'qituvchini saqlashda xato:", err)
            setError(err.response?.data?.message || err.response?.data?.detail || err.message || "O'qituvchini saqlashda xatolik yuz berdi. Telefon va email takrorlanmaganligiga ishonch hosil qiling.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[27.5px] font-extrabold text-[#1f2d5a] tracking-tight">{isArchiveView ? "Arxiv - O'qituvchilar" : "O'qituvchilar"}</h1>
                    <p className="text-[15px] text-gray-500 mt-1">
                        {isArchiveView ? "Ushbu sahifada o'chirilgan o'qituvchilar arxivi keltirilgan." : "Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="contained"
                        onClick={openAdd}
                        startIcon={<Plus size={16} />}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.2,
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: "#6d28d9",
                                boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            }
                        }}
                    >
                        O'qituvchi qo'shish
                    </Button>
                </div>
            </div>

            {error && (
                <Alert severity="error" className="mb-4 rounded-xl">
                    {error}
                </Alert>
            )}

            {/* Arxiv banner */}
            {isArchiveView && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-[13.5px] text-amber-700 font-medium">
                        Bu yerda o'chirilgan o'qituvchilar arxivi saqlanadi. Ularni qayta tiklash yoki butunlay o'chirish mumkin.
                    </span>
                </div>
            )}

            {/* Bulk Action Alert Banner */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between px-6 py-3.5 mb-5 rounded-2xl bg-red-50/80 border border-red-100 animate-fade-in-up">
                    <span className="text-[15px] font-semibold text-red-600">
                        {selectedIds.length} ta o'qituvchi tanlandi
                    </span>
                    <Button
                        variant="contained"
                        onClick={handleBulkDelete}
                        startIcon={<Trash2 size={15} />}
                        sx={{
                            textTransform: "none",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            backgroundColor: "#ef4444",
                            color: "white",
                            boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.15)",
                            "&:hover": { backgroundColor: "#dc2626" }
                        }}
                    >
                        Tanlanganlarni o'chirish
                    </Button>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-[24px] border border-gray-100">
                    <CircularProgress sx={{ color: "#7c3aed" }} />
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 bg-white rounded-[24px] border border-gray-100 px-6 py-20 text-center">
                    <div>
                        <p className="text-[16.5px] font-bold text-[#1f2d5a]">O'qituvchilar topilmadi.</p>
                        <p className="mt-1 text-[14.5px] text-gray-400">
                            {searchQuery.trim()
                                ? "Qidiruv bo'yicha mos o'qituvchi yo'q. Qidiruvni tozalab ro'yxatga qayting."
                                : isArchiveView
                                    ? "Arxivda o'qituvchi topilmadi. Asosiy ro'yxatga qaytishingiz mumkin."
                                    : "Hozircha o'qituvchi qo'shilmagan."}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {searchQuery.trim() && (
                            <Button
                                variant="outlined"
                                onClick={() => setSearchQuery("")}
                                sx={{ textTransform: "none", borderRadius: "12px", fontWeight: 700, color: "#4b5563", borderColor: "#e5e7eb" }}
                            >
                                Qidiruvni tozalash
                            </Button>
                        )}
                        {isArchiveView && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsArchiveView(false)
                                    setSearchQuery("")
                                }}
                                sx={{ textTransform: "none", borderRadius: "12px", fontWeight: 700, backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}
                            >
                                Asosiy ro'yxatga qaytish
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex gap-2">
                            <Button
                                variant="outlined"
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                startIcon={<Filter size={16} />}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    px: 2,
                                    py: 0.8,
                                    borderColor: "#e5e7eb",
                                    color: "#1f2d5a"
                                }}
                            >
                                Filters
                            </Button>
                            <Button
                                variant={isArchiveView ? "contained" : "outlined"}
                                onClick={() => setIsArchiveView(!isArchiveView)}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    px: 2,
                                    py: 0.8,
                                    backgroundColor: isArchiveView ? "#7c3aed" : "transparent",
                                    color: isArchiveView ? "white" : "#1f2d5a",
                                    borderColor: isArchiveView ? "#7c3aed" : "#e5e7eb",
                                    "&:hover": {
                                        backgroundColor: isArchiveView ? "#6d28d9" : "#f9fafb"
                                    }
                                }}
                            >
                                {isArchiveView ? "Asosiyga qaytish" : "Arxiv"}
                                {!isArchiveView && archivedTeacherIds.length > 0 && (
                                    <span className="ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
                                        {archivedTeacherIds.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[280px] px-4 py-2 bg-gray-50/50 border border-gray-100 rounded-lg text-[14.5px] text-gray-700 focus:outline-none focus:border-violet-300 transition-colors" />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 font-bold text-[#1f2d5a] text-[14.5px]">
                                <th className="px-6 py-4 w-[60px]">
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        sx={{ color: "#cbd5e1", padding: 0, "&.Mui-checked": { color: "#7c3aed" }, "&.MuiCheckbox-indeterminate": { color: "#7c3aed" } }}
                                    />
                                </th>
                                <th className="px-4 py-4 whitespace-nowrap">Nomi &darr;</th>
                                <th className="px-4 py-4 whitespace-nowrap">Guruh</th>
                                <th className="px-4 py-4 whitespace-nowrap">Telefon raqamlari</th>
                                <th className="px-4 py-4 whitespace-nowrap">Email</th>
                                <th className="px-4 py-4 whitespace-nowrap">Manzil</th>
                                <th className="px-4 py-4 whitespace-nowrap">Yaratilgan sana</th>
                                <th className="px-6 py-4 whitespace-nowrap text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedTeachers.map((item) => {
                                const isSelected = selectedIds.includes(item.id)
                                return (
                                    <tr key={item.id} className={`border-b border-gray-50 transition-all ${isSelected ? "bg-violet-50/20" : "hover:bg-gray-50/50"}`}>
                                        <td className="px-6 py-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                                                sx={{ color: "#cbd5e1", padding: 0, "&.Mui-checked": { color: "#7c3aed" } }}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={item.avatar} className="w-9 h-9 rounded-full object-cover" />
                                                <span className="text-[14.5px] font-semibold text-[#1f2d5a]">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 max-w-[200px]">
                                            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-0.5 scrollbar-none">
                                                {item.groups.length === 0 ? (
                                                    <span className="text-gray-400 text-[13.5px]">Guruh yo'q</span>
                                                ) : (
                                                    item.groups.map((g, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-[6px] text-[12.5px] font-medium shrink-0">
                                                            {typeof g === 'object' ? (g.name || g.full_name || `Guruh #${g.id}`) : g}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[14.5px] font-medium text-[#1f2d5a]">{item.phone}</td>
                                        <td className="px-4 py-4 text-[14.5px] font-medium text-[#1f2d5a]">{item.email}</td>
                                        <td className="px-4 py-4 text-[14.5px] font-medium text-[#1f2d5a]">{item.address}</td>
                                        <td className="px-4 py-4 text-[14.5px] font-medium text-[#1f2d5a]">{item.created}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                {!isArchiveView && <Eye size={17} className="text-gray-400 cursor-pointer hover:text-gray-600" />}
                                                {isArchiveView && (
                                                    <Button 
                                                        onClick={() => handleRestore(item.id)}
                                                        size="small" 
                                                        sx={{ minWidth: 0, padding: "4px 8px", textTransform: "none", fontSize: "12px", color: "#7c3aed", fontWeight: "bold" }}
                                                    >
                                                        Tiklash
                                                    </Button>
                                                )}
                                                <Trash2 size={17} onClick={() => handleDelete(item.id)} className="text-gray-400 cursor-pointer hover:text-red-500" />
                                                {!isArchiveView && <Pencil size={17} onClick={() => openEdit(item)} className="text-gray-400 cursor-pointer hover:text-violet-500" />}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-[14.5px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &larr; Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[14.5px] font-medium transition-colors ${
                                            currentPage === i + 1 
                                            ? "bg-violet-600 text-white" 
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-[14.5px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Right Drawer */}
            <div onClick={handleClose} className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-300 ${showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
            <div className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl z-[300] flex flex-col transition-transform duration-300 ease-in-out ${showDrawer ? "translate-x-0" : "translate-x-full"}`}>
                
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h3 className="text-[18.5px] font-bold text-gray-800">{editTeacher ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}</h3>
                        <p className="text-[14px] text-gray-400 mt-0.5">Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                    </div>
                    <IconButton onClick={handleClose} sx={{ color: "#d1d5db", "&:hover": { color: "#6b7280" } }}>
                        <X size={20} />
                    </IconButton>
                </div>

                <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Telefon raqam</label>
                        <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] focus:border-violet-400 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Mail</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Elektron pochtani kiriting" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] focus:border-violet-400 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">O'qituvchi FIO</label>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ma'lumotni kiriting" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] focus:border-violet-400 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Manzili (Address)</label>
                        <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Masalan: Toshkent sh., Chilonzor tumani" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] focus:border-violet-400 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Tug'ilgan sanasi</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="date" value={form.birth} onChange={e => setForm({...form, birth: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] focus:border-violet-400 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Jinsi</label>
                        <div className="flex items-center gap-6">
                            {["Erkak", "Ayol"].map(g => (
                                <label key={g} className="flex items-center gap-2.5 cursor-pointer">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.gender === g ? "border-violet-600" : "border-gray-200"}`}>
                                        {form.gender === g && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                                    </div>
                                    <span className="text-[14.5px] text-gray-600 font-medium">{g}</span>
                                    <input type="radio" className="hidden" name="gender" onChange={() => setForm({...form, gender: g})} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14.5px] font-semibold text-gray-700">Surati</label>
                        <label className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/30 cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 mb-2"><Upload size={18} /></div>
                            <p className="max-w-[260px] truncate text-[13.5px] font-semibold text-gray-600">
                                {form.imageName || "Click to upload or drag and drop"}
                            </p>
                            <p className="mt-1 text-[12.5px] font-semibold text-gray-400">
                                JPG or PNG (max. 2 MB)
                            </p>
                        </label>
                    </div>
                </div>

                <div className="px-6 py-6 border-t border-gray-50 flex justify-end gap-3 mt-auto">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            px: 3,
                            py: 1,
                            borderRadius: "12px",
                            borderColor: "#f3f4f6",
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#6b7280",
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb"
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            px: 3,
                            py: 1,
                            borderRadius: "12px",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "bold",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: "#6d28d9",
                                boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            }
                        }}
                    >
                        Saqlash
                    </Button>
                </div>
            </div>

            <ConfirmModal 
                open={modalConfig.open} 
                onClose={() => setModalConfig({...modalConfig, open: false})} 
                onConfirm={modalConfig.onConfirm} 
                title={modalConfig.title} 
                message={modalConfig.message} 
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
            />
        </div>
    )
}
