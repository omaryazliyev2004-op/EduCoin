import { useState } from "react"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button, IconButton, Tooltip } from "@mui/material"

const emptyForm = { name: "", note: "" }

export default function BasicCrud({ title, description, addLabel, initialItems }) {
    const [items, setItems] = useState(initialItems)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const openAdd = () => {
        setEditItem(null)
        setForm(emptyForm)
        setDrawerOpen(true)
    }

    const openEdit = (item) => {
        setEditItem(item)
        setForm({ name: item.name, note: item.note })
        setDrawerOpen(true)
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
        setEditItem(null)
    }

    const saveItem = () => {
        if (!form.name.trim()) return

        if (editItem) {
            setItems((current) =>
                current.map((item) => (item.id === editItem.id ? { ...item, ...form } : item))
            )
        } else {
            setItems((current) => [{ id: Date.now(), ...form }, ...current])
        }
        closeDrawer()
    }

    return (
        <div>
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <h2 className="text-[21.5px] font-bold text-[#1f2d5a]">{title}</h2>
                    <p className="text-[14.5px] text-gray-500">{description}</p>
                </div>
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
                        "&:hover": {
                            backgroundColor: "#6d28d9",
                            boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                        }
                    }}
                >
                    {addLabel}
                </Button>

            </div>

            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
                        >
                            <div>
                                <p className="text-[15.5px] font-bold text-[#1f2d5a]">{item.name}</p>
                                <p className="mt-0.5 text-[13.5px] text-gray-400">{item.note}</p>
                            </div>
                             <div className="flex gap-1">
                                <Tooltip title="Tahrirlash">
                                    <IconButton
                                        onClick={() => openEdit(item)}
                                        size="small"
                                        sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed", backgroundColor: "#f5f3ff" }, borderRadius: "8px" }}
                                    >
                                        <Pencil size={14} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="O'chirish">
                                    <IconButton
                                        onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}
                                        size="small"
                                        sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" }, borderRadius: "8px" }}
                                    >
                                        <Trash2 size={14} />
                                    </IconButton>
                                </Tooltip>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-[200] bg-black/20 transition-opacity duration-300 ${
                    drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />
            <aside
                className={`fixed right-0 top-0 z-[300] flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
                    drawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between border-b border-gray-50 px-6 pb-4 pt-6">
                    <div>
                        <h3 className="text-[18.5px] font-bold text-gray-800">
                            {editItem ? "Tahrirlash" : addLabel}
                        </h3>
                        <p className="mt-0.5 text-[14px] text-gray-400">Ma'lumotlarni kiriting.</p>
                    </div>
                    <IconButton onClick={closeDrawer} sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563" } }}>
                        <X size={20} />
                    </IconButton>

                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <label className="block">
                        <span className="mb-2 block text-[14.5px] font-semibold text-gray-700">
                            Nomi <span className="text-red-500">*</span>
                        </span>
                        <input
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            placeholder="Nomini kiriting"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[14.5px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-[14.5px] font-semibold text-gray-700">Izoh</span>
                        <textarea
                            value={form.note}
                            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                            placeholder="Qo'shimcha izoh"
                            className="min-h-[96px] w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-[14.5px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>
                </div>

                <div className="flex gap-3 border-t border-gray-100 px-6 py-5">
                    <Button
                        onClick={closeDrawer}
                        variant="outlined"
                        fullWidth
                        sx={{
                            textTransform: "none",
                            height: 40,
                            borderRadius: "12px",
                            borderColor: "#e5e7eb",
                            fontSize: "13px",
                            fontWeight: "800",
                            color: "#4b5563",
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                borderColor: "#d1d5db"
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={saveItem}
                        variant="contained"
                        disabled={!form.name.trim()}
                        fullWidth
                        sx={{
                            textTransform: "none",
                            height: 40,
                            borderRadius: "12px",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "800",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: "#6d28d9",
                                boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            },
                            "&:disabled": {
                                backgroundColor: "#f3f4f6",
                                color: "#9ca3af",
                                boxShadow: "none"
                            }
                        }}
                    >
                        Saqlash
                    </Button>

                </div>
            </aside>
        </div>
    )
}
