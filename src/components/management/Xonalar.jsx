import { useState } from 'react'
import { RefreshCw, Plus, Trash2, Pencil, X } from "lucide-react"

const filialFilters = [
    "AiCoder markazi",
    "Fizika va Matematika",
    "4-maktab",
    "Niner markazi",
    "IELTS full mock",
    "IELTS full mock centre",
    "Arxiv",
]

const initialRooms = [
    { id: 1, name: "genious room", capacity: 15 },
    { id: 2, name: "Impact room", capacity: 12 },
    { id: 3, name: "1A", capacity: 25 },
    { id: 4, name: "205-xona", capacity: 32 },
    { id: 5, name: "16-xona", capacity: 18 },
    { id: 6, name: "5 xona", capacity: 30 },
    { id: 7, name: "IELTS with islombek", capacity: 20 },
    { id: 8, name: "Beginner", capacity: 18 },
    { id: 9, name: "99", capacity: 25 },
]

export default function Xonalar() {
    const [activeFilter, setActiveFilter] = useState("AiCoder markazi")
    const [rooms, setRooms] = useState(initialRooms)
    const [showDrawer, setShowDrawer] = useState(false)
    const [editRoom, setEditRoom] = useState(null)
    const [form, setForm] = useState({ name: "", capacity: "" })

    const openAdd = () => {
        setEditRoom(null)
        setForm({ name: "", capacity: "" })
        setShowDrawer(true)
    }

    const openEdit = (room) => {
        setEditRoom(room)
        setForm({ name: room.name, capacity: room.capacity })
        setShowDrawer(true)
    }

    const handleClose = () => setShowDrawer(false)

    const handleDelete = (id) => setRooms(rooms.filter(r => r.id !== id))

    const handleSave = () => {
        if (!form.name.trim() || !form.capacity) return
        if (editRoom) {
            setRooms(rooms.map(r => r.id === editRoom.id
                ? { ...r, name: form.name, capacity: Number(form.capacity) }
                : r
            ))
        } else {
            setRooms([...rooms, { id: Date.now(), name: form.name, capacity: Number(form.capacity) }])
        }
        setShowDrawer(false)
    }

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-[#1f2d5a]">Xonalar</h2>
                    <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-all">
                        <RefreshCw size={15} />
                    </button>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[13px] font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all active:scale-95"
                >
                    <Plus size={15} />
                    Xonani qo'shish
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {filialFilters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all border
                            ${activeFilter === f
                                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100"
                                : "bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Rooms grid */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-4 gap-4">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all bg-gray-50/50 hover:bg-violet-50/30"
                        >
                            <div>
                                <p className="text-[14px] font-bold text-[#1f2d5a] leading-tight">{room.name}</p>
                                <p className="text-[12px] text-gray-400 mt-0.5">Sig'imi: {room.capacity}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button
                                    onClick={() => openEdit(room)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-all"
                                >
                                    <Pencil size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 z-[200] bg-black/20 transition-opacity duration-300
                    ${showDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Right Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[340px] bg-white shadow-2xl z-[300] flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-[16px] font-bold text-[#1f2d5a]">
                        {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
                            Nomi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Xona nomi"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
                            Sig'imi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.capacity}
                            onChange={e => setForm({ ...form, capacity: e.target.value })}
                            placeholder="Masalan: 20"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                    </div>
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
