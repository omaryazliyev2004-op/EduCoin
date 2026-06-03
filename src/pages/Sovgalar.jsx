import { useMemo, useState } from "react"
import { Gift, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react"
import { Button, IconButton, Tooltip } from "@mui/material"

const initialGifts = [
    { id: 1, name: "Notebook", coins: 120, imageName: "" },
    { id: 2, name: "EduCoin hoodie", coins: 350, imageName: "" },
    { id: 3, name: "Sticker pack", coins: 40, imageName: "" },
]

const emptyForm = { name: "", coins: "", imageName: "" }

export default function Sovgalar() {
    const [gifts, setGifts] = useState(initialGifts)
    const [query, setQuery] = useState("")
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editGift, setEditGift] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const filteredGifts = useMemo(() => {
        const value = query.trim().toLowerCase()
        if (!value) return gifts
        return gifts.filter((gift) => gift.name.toLowerCase().includes(value))
    }, [gifts, query])

    const openAdd = () => {
        setEditGift(null)
        setForm(emptyForm)
        setDrawerOpen(true)
    }

    const openEdit = (gift) => {
        setEditGift(gift)
        setForm({ name: gift.name, coins: String(gift.coins), imageName: gift.imageName })
        setDrawerOpen(true)
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
        setEditGift(null)
    }

    const saveGift = () => {
        if (!form.name.trim() || !form.coins) return

        if (editGift) {
            setGifts((current) =>
                current.map((gift) =>
                    gift.id === editGift.id
                        ? { ...gift, name: form.name, coins: Number(form.coins), imageName: form.imageName }
                        : gift
                )
            )
        } else {
            setGifts((current) => [
                { id: Date.now(), name: form.name, coins: Number(form.coins), imageName: form.imageName },
                ...current,
            ])
        }

        closeDrawer()
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setForm((current) => ({ ...current, imageName: file.name }))
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] p-8">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-[27.5px] font-extrabold tracking-tight text-[#1f2d5a]">
                        Sovg'alar
                    </h1>
                    <p className="mt-1 text-[15px] text-gray-400">
                        Talabalar coin orqali olishi mumkin bo'lgan sovg'alar ro'yxati.
                    </p>
                </div>
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
                    Sovg'a qo'shish
                </Button>

            </div>

            <div className="mb-5 flex justify-end">
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search"
                        className="w-[280px] rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-[14.5px] text-[#1f2d5a] shadow-sm outline-none focus:border-violet-300"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGifts.map((gift) => (
                    <div key={gift.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                            <Gift size={36} />
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-[16.5px] font-extrabold text-[#1f2d5a]">{gift.name}</h3>
                                <p className="mt-1 text-[14.5px] font-bold text-orange-500">{gift.coins} coin</p>
                                {gift.imageName && (
                                    <p className="mt-1 max-w-[220px] truncate text-[13.5px] text-gray-400">
                                        {gift.imageName}
                                    </p>
                                )}
                            </div>
                             <div className="flex gap-1">
                                <Tooltip title="Tahrirlash">
                                    <IconButton
                                        onClick={() => openEdit(gift)}
                                        size="small"
                                        sx={{ color: "#9ca3af", "&:hover": { color: "#7c3aed", backgroundColor: "#f5f3ff" }, borderRadius: "8px" }}
                                    >
                                        <Pencil size={15} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="O'chirish">
                                    <IconButton
                                        onClick={() => setGifts((current) => current.filter((item) => item.id !== gift.id))}
                                        size="small"
                                        sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" }, borderRadius: "8px" }}
                                    >
                                        <Trash2 size={15} />
                                    </IconButton>
                                </Tooltip>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            {filteredGifts.length === 0 && (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                    <p className="text-[16.5px] font-extrabold text-[#1f2d5a]">Sovg'a topilmadi.</p>
                    <p className="mt-1 text-[14.5px] text-gray-400">
                        Qidiruv natija bermadi. Qidiruvni tozalab barcha sovg'alarni ko'ring.
                    </p>
                    {query.trim() && (
                        <Button
                            onClick={() => setQuery("")}
                            variant="outlined"
                            sx={{ mt: 2, textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", borderColor: "#e5e7eb", color: "#4b5563" }}
                        >
                            Qidiruvni tozalash
                        </Button>
                    )}
                </div>
            )}

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-300 ${
                    drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />
            <aside
                className={`fixed right-0 top-0 z-[300] flex h-full w-full max-w-[410px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
                    drawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between px-6 pb-4 pt-6">
                    <div>
                        <h3 className="text-[18.5px] font-bold text-gray-800">
                            {editGift ? "Sovg'ani tahrirlash" : "Sovg'a qo'shish"}
                        </h3>
                        <p className="mt-0.5 text-[14px] text-gray-400">
                            Sovg'a nomi, coin narxi va rasmini kiriting.
                        </p>
                    </div>
                    <IconButton onClick={closeDrawer} sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563" } }}>
                        <X size={20} />
                    </IconButton>

                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
                    <label className="block">
                        <span className="mb-1.5 block text-[14.5px] font-semibold text-gray-700">Nomi</span>
                        <input
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            placeholder="Sovg'a nomi"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[14.5px] outline-none focus:border-violet-400"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-[14.5px] font-semibold text-gray-700">Coin narxi</span>
                        <input
                            type="number"
                            value={form.coins}
                            onChange={(event) => setForm((current) => ({ ...current, coins: event.target.value }))}
                            placeholder="Masalan: 120"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[14.5px] outline-none focus:border-violet-400"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-[14.5px] font-semibold text-gray-700">Surati</span>
                        <span className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 p-8 text-center hover:bg-gray-50">
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Upload size={20} className="mb-2 text-gray-400" />
                            <span className="max-w-[260px] truncate text-[13.5px] font-semibold text-gray-600">
                                {form.imageName || "Click to upload or drag and drop"}
                            </span>
                            <span className="mt-1 text-[12.5px] text-gray-400">JPG or PNG (max. 2 MB)</span>
                        </span>
                    </label>
                </div>

                <div className="mt-auto flex justify-end gap-3 border-t border-gray-50 px-6 py-6">
                    <Button
                        onClick={closeDrawer}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            height: 40,
                            borderRadius: "12px",
                            borderColor: "#f3f4f6",
                            fontSize: "13px",
                            fontWeight: "800",
                            color: "#4b5563",
                            px: 3,
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb"
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={saveGift}
                        variant="contained"
                        disabled={!form.name.trim() || !form.coins}
                        sx={{
                            textTransform: "none",
                            height: 40,
                            borderRadius: "12px",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "800",
                            px: 3,
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
