import { useState } from "react"
import { Pencil, Plus, Trash2, X } from "lucide-react"

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
                    <h2 className="text-[20px] font-bold text-[#1f2d5a]">{title}</h2>
                    <p className="text-[13px] text-gray-500">{description}</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 active:scale-95"
                >
                    <Plus size={15} />
                    {addLabel}
                </button>
            </div>

            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
                        >
                            <div>
                                <p className="text-[14px] font-bold text-[#1f2d5a]">{item.name}</p>
                                <p className="mt-0.5 text-[12px] text-gray-400">{item.note}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={14} />
                                </button>
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
                        <h3 className="text-[17px] font-bold text-gray-800">
                            {editItem ? "Tahrirlash" : addLabel}
                        </h3>
                        <p className="mt-0.5 text-[12.5px] text-gray-400">Ma'lumotlarni kiriting.</p>
                    </div>
                    <button onClick={closeDrawer} className="text-gray-300 hover:text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <label className="block">
                        <span className="mb-2 block text-[13px] font-semibold text-gray-700">
                            Nomi <span className="text-red-500">*</span>
                        </span>
                        <input
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            placeholder="Nomini kiriting"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-[13px] font-semibold text-gray-700">Izoh</span>
                        <textarea
                            value={form.note}
                            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                            placeholder="Qo'shimcha izoh"
                            className="min-h-[96px] w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>
                </div>

                <div className="flex gap-3 border-t border-gray-100 px-6 py-5">
                    <button
                        onClick={closeDrawer}
                        className="flex-1 rounded-xl border border-gray-200 py-3 text-[13px] font-semibold text-gray-500 transition hover:bg-gray-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={saveItem}
                        disabled={!form.name.trim()}
                        className="flex-1 rounded-xl bg-violet-600 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                    >
                        Saqlash
                    </button>
                </div>
            </aside>
        </div>
    )
}
