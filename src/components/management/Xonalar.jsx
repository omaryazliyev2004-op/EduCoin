import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, X, ArchiveRestore, Trash } from "lucide-react"
import { Button, IconButton, Tooltip, CircularProgress, Alert } from "@mui/material"
import api from "../../api"

const filialFilters = [
    "AiCoder markazi",
    "Fizika va Matematika",
    "4-maktab",
    "Niner markazi",
    "IELTS full mock",
    "IELTS full mock centre",
    "Arxiv",
]

export default function Xonalar() {
    const [activeFilter, setActiveFilter]     = useState("AiCoder markazi")
    const [rooms, setRooms]                   = useState([])
    const [archivedIds, setArchivedIds]       = useState(() => {
        try {
            const saved = localStorage.getItem("archivedRoomIds")
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })
    const [showDrawer, setShowDrawer]         = useState(false)
    const [editRoom, setEditRoom]             = useState(null)
    const [form, setForm]                     = useState({ name: "", capacity: "" })
    const [loading, setLoading]               = useState(false)
    const [error, setError]                   = useState("")

    // Arxivga o'tkazish modal
    const [archiveId, setArchiveId]           = useState(null)
    const [archiveLoading, setArchiveLoading] = useState(false)

    // Qayta tiklash modal
    const [restoreId, setRestoreId]           = useState(null)
    const [restoreLoading, setRestoreLoading] = useState(false)

    // Butunlay o'chirish modal
    const [deleteId, setDeleteId]             = useState(null)
    const [deleteLoading, setDeleteLoading]   = useState(false)

    const fetchRooms = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get("/rooms")
            setRooms(response.data?.data || [])
        } catch (err) {
            console.error("Xonalarni yuklashda xato:", err)
            setError("Xonalarni yuklashda xatolik yuz berdi. Tarmoqni tekshiring.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchRooms(), 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        localStorage.setItem("archivedRoomIds", JSON.stringify(archivedIds))
    }, [archivedIds])

    const openAdd = () => {
        setEditRoom(null)
        setForm({ name: "", capacity: "" })
        setShowDrawer(true)
    }

    const openEdit = (room) => {
        setEditRoom(room)
        setForm({ name: room.name, capacity: String(room.capacity) })
        setShowDrawer(true)
    }

    const handleClose = () => setShowDrawer(false)

    // Arxivga o'tkazish (soft delete)
    const handleArchive = async () => {
        setArchiveLoading(true)
        try {
            // Agar backendda arxiv endpoint bo'lsa: await api.patch(`/rooms/${archiveId}/archive`)
            setArchivedIds(prev => [...prev, archiveId])
            setArchiveId(null)
        } catch (err) {
            console.error("Arxivlashda xato:", err)
            setError("Xonani arxivlashda xatolik yuz berdi.")
            setArchiveId(null)
        } finally {
            setArchiveLoading(false)
        }
    }

    // Arxivdan qayta tiklash
    const handleRestore = async () => {
        setRestoreLoading(true)
        try {
            // Agar backendda restore endpoint bo'lsa: await api.patch(`/rooms/${restoreId}/restore`)
            setArchivedIds(prev => prev.filter(id => id !== restoreId))
            setRestoreId(null)
        } catch (err) {
            console.error("Qayta tiklashda xato:", err)
            setError("Xonani qayta tiklashda xatolik yuz berdi.")
            setRestoreId(null)
        } finally {
            setRestoreLoading(false)
        }
    }

    // Butunlay o'chirish (faqat arxivdan)
    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await api.delete(`/rooms/${deleteId}`)
            setRooms(prev => prev.filter(r => r.id !== deleteId))
            setArchivedIds(prev => prev.filter(id => id !== deleteId))
            setDeleteId(null)
        } catch (err) {
            console.error("Xonani o'chirishda xato:", err)
            setError("Xonani o'chirishda xatolik yuz berdi.")
            setDeleteId(null)
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleSave = async () => {
        if (!form.name.trim() || !form.capacity) return
        setLoading(true)
        setError("")
        try {
            if (editRoom) {
                await api.patch(`/rooms/${editRoom.id}`, {
                    name: form.name,
                    capacity: Number(form.capacity)
                })
                await fetchRooms()
            } else {
                await api.post("/rooms", {
                    name: form.name,
                    capacity: Number(form.capacity)
                })
                await fetchRooms()
            }
            setShowDrawer(false)
        } catch (err) {
            console.error("Xonani saqlashda xato:", err)
            setError("Xonani saqlashda xatolik yuz berdi.")
        } finally {
            setLoading(false)
        }
    }

    // Filtratsiya
    const visibleRooms = activeFilter === "Arxiv"
        ? rooms.filter(r => archivedIds.includes(r.id))
        : rooms.filter(r => !archivedIds.includes(r.id))

    const archiveRoom = rooms.find(r => r.id === archiveId)
    const restoreRoom = rooms.find(r => r.id === restoreId)
    const deleteRoom  = rooms.find(r => r.id === deleteId)

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-[21.5px] font-bold text-[#1f2d5a]">Xonalar</h2>
                    <p className="text-[14.5px] text-gray-500">Markazlardagi mavjud xonalar ro'yxati</p>
                </div>
                {activeFilter !== "Arxiv" && (
                    <Button
                        variant="contained"
                        onClick={openAdd}
                        startIcon={<Plus size={15} />}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "800",
                            px: 3,
                            py: 1.2,
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": { backgroundColor: "#6d28d9", boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)" }
                        }}
                    >
                        Xonani qo'shish
                    </Button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {filialFilters.map((f) => {
                    const isArchive = f === "Arxiv"
                    const count = isArchive ? archivedIds.length : null
                    return (
                        <Button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                height: 32,
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: "600",
                                px: 2.5,
                                backgroundColor: activeFilter === f ? (isArchive ? "#f59e0b" : "#7c3aed") : "white",
                                borderColor: activeFilter === f ? (isArchive ? "#f59e0b" : "#7c3aed") : "#e5e7eb",
                                color: activeFilter === f ? "white" : "#6b7280",
                                boxShadow: activeFilter === f ? "0 4px 6px -1px rgba(124, 58, 237, 0.1)" : "none",
                                "&:hover": {
                                    backgroundColor: activeFilter === f ? (isArchive ? "#d97706" : "#6d28d9") : "#f9fafb",
                                    borderColor: activeFilter === f ? (isArchive ? "#d97706" : "#6d28d9") : "#d1d5db"
                                }
                            }}
                        >
                            {f}
                            {isArchive && count > 0 && (
                                <span className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeFilter === f ? "bg-white/30 text-white" : "bg-amber-100 text-amber-600"}`}>
                                    {count}
                                </span>
                            )}
                        </Button>
                    )
                })}
            </div>

            {/* Arxiv banner */}
            {activeFilter === "Arxiv" && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-[13.5px] text-amber-700">
                        Bu yerda o'chirilgan xonalar saqlanadi. Ularni qayta tiklash yoki butunlay o'chirish mumkin.
                    </span>
                </div>
            )}

            {error && (
                <Alert severity="error" className="mb-4 rounded-xl">{error}</Alert>
            )}

            {/* Rooms grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <CircularProgress sx={{ color: "#7c3aed" }} />
                </div>
            ) : visibleRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
                    <div>
                        <p className="text-[16.5px] font-extrabold text-[#1f2d5a]">Hech qanday xona topilmadi.</p>
                        <p className="mt-1 text-[14.5px] text-gray-400">
                            {activeFilter === "Arxiv"
                                ? "Arxivda xona topilmadi."
                                : "Xonalar ro'yxatini qayta yuklab ko'ring yoki yangi xona qo'shing."}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {activeFilter === "Arxiv" && (
                            <Button
                                onClick={() => setActiveFilter("AiCoder markazi")}
                                variant="contained"
                                sx={{ textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}
                            >
                                Asosiy ro'yxatga qaytish
                            </Button>
                        )}
                        <Button
                            onClick={fetchRooms}
                            variant="outlined"
                            sx={{ textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", borderColor: "#e5e7eb", color: "#4b5563" }}
                        >
                            Qayta yuklash
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
                    <div className="grid grid-cols-4 gap-4">
                        {visibleRooms.map((room) => {
                            const isArchived = archivedIds.includes(room.id)
                            return (
                                <div
                                    key={room.id}
                                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all
                                        ${isArchived
                                            ? "bg-amber-50/60 border-amber-100 hover:border-amber-200 hover:shadow-md"
                                            : "bg-gray-50/50 border-gray-100 hover:border-violet-200 hover:shadow-md hover:bg-violet-50/30"
                                        }`}
                                >
                                    <div>
                                        <p className="text-[15.5px] font-bold text-[#1f2d5a] leading-tight">{room.name}</p>
                                        <p className="text-[13.5px] text-gray-400 mt-0.5">Sig'imi: {room.capacity}</p>
                                        {isArchived && (
                                            <span className="inline-block mt-1 text-[11.5px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                                Arxivda
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isArchived ? (
                                            <>
                                                <Tooltip title="Qayta tiklash">
                                                    <IconButton
                                                        onClick={() => setRestoreId(room.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#f59e0b", backgroundColor: "#fffbeb" }, borderRadius: "8px" }}
                                                    >
                                                        <ArchiveRestore size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Butunlay o'chirish">
                                                    <IconButton
                                                        onClick={() => setDeleteId(room.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" }, borderRadius: "8px" }}
                                                    >
                                                        <Trash size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Arxivga o'tkazish">
                                                    <IconButton
                                                        onClick={() => setArchiveId(room.id)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#f59e0b", backgroundColor: "#fffbeb" }, borderRadius: "8px" }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Tahrirlash">
                                                    <IconButton
                                                        onClick={() => openEdit(room)}
                                                        size="small"
                                                        sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed", backgroundColor: "#f5f3ff" }, borderRadius: "8px" }}
                                                    >
                                                        <Pencil size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 z-[200] bg-black/20 transition-opacity duration-300
                    ${showDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Right Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[300] flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-50">
                    <div>
                        <h3 className="text-[18.5px] font-bold text-gray-800">
                            {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
                        </h3>
                        <p className="text-[14px] text-gray-400 mt-0.5">
                            Bu yerda siz yangi xona ma'lumotlarini kiritishingiz mumkin.
                        </p>
                    </div>
                    <IconButton
                        onClick={handleClose}
                        sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563", backgroundColor: "#f9fafb" } }}
                    >
                        <X size={16} />
                    </IconButton>
                </div>

                <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-2 block">
                            Nomi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Xona nomi (masalan: Room 101)"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[14.5px] font-semibold text-gray-700 mb-2 block">
                            Sig'imi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.capacity}
                            onChange={e => setForm({ ...form, capacity: e.target.value })}
                            placeholder="Masalan: 20"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all"
                        />
                        <p className="text-[13px] text-gray-400 mt-1.5 ml-1">Ushbu xonaga sig'adigan maksimal o'quvchilar soni.</p>
                    </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        fullWidth
                        sx={{ textTransform: "none", height: 40, borderRadius: "12px", borderColor: "#e5e7eb", fontSize: "13px", fontWeight: "800", color: "#4b5563", "&:hover": { backgroundColor: "#f9fafb", borderColor: "#d1d5db" } }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        fullWidth
                        sx={{ textTransform: "none", height: 40, borderRadius: "12px", backgroundColor: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "800", boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)", "&:hover": { backgroundColor: "#6d28d9" } }}
                    >
                        Saqlash
                    </Button>
                </div>
            </div>

            {/* Arxivga o'tkazish Modal */}
            {archiveId && (
                <>
                    <div onClick={() => setArchiveId(null)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px]">
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Xonani arxivga o'tkazish</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{archiveRoom?.name}"</span> xonasini arxivga o'tkazmoqchimisiz?
                                Xona o'chirilmaydi — arxivdan qayta tiklash mumkin bo'ladi.
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
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Xonani qayta tiklash</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{restoreRoom?.name}"</span> xonasini arxivdan qaytarib olmoqchimisiz?
                                Xona yana faol ro'yxatga qo'shiladi.
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
                            <h3 className="text-[18px] font-bold text-gray-800 mb-2">Xonani butunlay o'chirish</h3>
                            <p className="text-[14.5px] text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">"{deleteRoom?.name}"</span> xonasini butunlay o'chirishni tasdiqlaysizmi?
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
