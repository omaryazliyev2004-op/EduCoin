import { useMemo, useState } from "react"
import {
    Archive,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    ListFilter,
    Pencil,
    Plus,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react"

const initialStudents = [
    {
        id: 1,
        name: "Ali Valiyev",
        initials: "A",
        groups: ["N26", "n105"],
        phone: "+998976541223",
        email: "ali@gmail.com",
        birth: "12.12.2010",
        address: "Sirdaryo",
        created: "12.05.2026",
        accent: "bg-orange-50 text-orange-500",
    },
    {
        id: 2,
        name: "Salim Qodirov",
        initials: "S",
        groups: ["n105"],
        phone: "+998977777777",
        email: "salim@gmail.com",
        birth: "14.01.2007",
        address: "Buxoro",
        created: "14.05.2026",
        accent: "bg-violet-50 text-violet-600",
    },
    {
        id: 3,
        name: "Bobur",
        initials: "B",
        groups: ["n105"],
        phone: "+998999999999",
        email: "bobur@gmail.com",
        birth: "14.03.2002",
        address: "Toshkent",
        created: "14.05.2026",
        accent: "bg-violet-50 text-violet-500",
    },
    {
        id: 4,
        name: "Qodir Salimov",
        initials: "Q",
        groups: ["n105"],
        phone: "+998911111111",
        email: "qodir@gmail.com",
        birth: "29.04.2026",
        address: "O'zbekcha",
        created: "14.05.2026",
        accent: "bg-violet-50 text-violet-600",
    },
]

export default function Students() {
    const [students, setStudents] = useState(initialStudents)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudents, setSelectedStudents] = useState([])
    const [showDrawer, setShowDrawer] = useState(false)
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [groupSearch, setGroupSearch] = useState("")
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [archiveOpen, setArchiveOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [form, setForm] = useState({
        phone: "+998",
        email: "",
        name: "",
        birth: "",
        address: "",
        password: "",
        group: "",
        imageName: "",
    })

    const filteredStudents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        if (!query) return students

        return students.filter((student) =>
            [student.name, student.phone, student.email, student.address]
                .join(" ")
                .toLowerCase()
                .includes(query)
        )
    }, [searchQuery, students])

    const allVisibleSelected =
        filteredStudents.length > 0 &&
        filteredStudents.every((student) => selectedStudents.includes(student.id))

    const toggleStudent = (id) => {
        setSelectedStudents((current) =>
            current.includes(id)
                ? current.filter((studentId) => studentId !== id)
                : [...current, id]
        )
    }

    const toggleAllVisible = () => {
        if (allVisibleSelected) {
            setSelectedStudents((current) =>
                current.filter((id) => !filteredStudents.some((student) => student.id === id))
            )
            return
        }

        setSelectedStudents((current) => [
            ...new Set([...current, ...filteredStudents.map((student) => student.id)]),
        ])
    }

    const removeStudent = (id) => {
        setStudents((current) => current.filter((student) => student.id !== id))
        setSelectedStudents((current) => current.filter((studentId) => studentId !== id))
    }

    const closeDrawer = () => {
        setShowDrawer(false)
        setShowGroupModal(false)
    }

    const addStudent = () => {
        if (!form.name.trim()) return

        const today = new Date().toLocaleDateString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })

        setStudents((current) => [
            {
                id: Date.now(),
                name: form.name,
                initials: form.name.trim().charAt(0).toUpperCase(),
                groups: form.group ? [form.group] : ["n105"],
                phone: form.phone,
                email: form.email || "email@example.com",
                birth: form.birth || "dd.mm.yyyy",
                address: form.address || "Manzil",
                created: today,
                accent: "bg-violet-50 text-violet-600",
            },
            ...current,
        ])
        setForm({
            phone: "+998",
            email: "",
            name: "",
            birth: "",
            address: "",
            password: "",
            group: "",
            imageName: "",
        })
        closeDrawer()
    }

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }))
    }

    const availableGroups = ["N26", "n105"]
    const selectedGroups = form.group ? form.group.split(", ").filter(Boolean) : []
    const filteredGroups = availableGroups.filter((group) =>
        group.toLowerCase().includes(groupSearch.trim().toLowerCase())
    )

    const toggleGroup = (group) => {
        setForm((current) => {
            const nextGroups = selectedGroups.includes(group)
                ? selectedGroups.filter((item) => item !== group)
                : [...selectedGroups, group]

            return { ...current, group: nextGroups.join(", ") }
        })
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        updateForm("imageName", file.name)
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] px-6 py-7 sm:px-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827]">
                        Talabalar
                    </h1>
                    <p className="mt-1 max-w-[760px] text-[13.5px] font-medium leading-6 text-gray-500">
                        Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>

                <button
                    onClick={() => setShowDrawer(true)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-[13px] font-extrabold text-white shadow-lg shadow-violet-100 transition-all hover:bg-violet-700 active:scale-95"
                >
                    <Plus size={17} strokeWidth={2.6} />
                    Talaba qo'shish
                </button>
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-[255px]">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[13px] font-medium text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-[13px] font-bold transition ${
                                filtersOpen
                                    ? "border-violet-200 bg-violet-50 text-violet-600"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <ListFilter size={16} />
                            Filters
                        </button>
                        <button
                            onClick={() => setArchiveOpen(!archiveOpen)}
                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-[13px] font-bold transition ${
                                archiveOpen
                                    ? "border-violet-200 bg-violet-50 text-violet-600"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Archive size={15} />
                            Arxiv
                        </button>
                    </div>
                </div>
                {(filtersOpen || archiveOpen) && (
                    <div className="border-b border-gray-100 px-4 py-3 text-[12px] font-semibold text-gray-500">
                        {filtersOpen && "Filterlar yoqildi: hozircha barcha talabalar ko'rsatilmoqda."}
                        {archiveOpen && " Arxiv bo'limi ochildi: arxivlangan talabalar topilmadi."}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#fafbfe] text-[12px] font-extrabold text-gray-500">
                                <th className="w-[52px] px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={toggleAllVisible}
                                        className="h-4 w-4 rounded border-gray-300 accent-violet-600"
                                    />
                                </th>
                                <th className="px-3 py-3">Nomi ↓</th>
                                <th className="px-3 py-3">Guruh</th>
                                <th className="px-3 py-3">Telefon raqamlari</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Tug'ilgan sanasi</th>
                                <th className="px-3 py-3">Manzil</th>
                                <th className="px-3 py-3">Yaratilgan sana</th>
                                <th className="px-4 py-3 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-gray-50 text-[13px] font-semibold text-[#1f2937] transition hover:bg-violet-50/20 last:border-b-0"
                                >
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudent(student.id)}
                                            className="h-4 w-4 rounded border-gray-300 accent-violet-600"
                                        />
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${student.accent}`}
                                            >
                                                {student.initials}
                                            </div>
                                            <span className="whitespace-nowrap">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {student.groups.map((group) => (
                                                <span
                                                    key={group}
                                                    className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-extrabold text-gray-600"
                                                >
                                                    {group}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">{student.phone}</td>
                                    <td className="whitespace-nowrap px-3 py-4">{student.email}</td>
                                    <td className="whitespace-nowrap px-3 py-4">{student.birth}</td>
                                    <td className="whitespace-nowrap px-3 py-4">{student.address}</td>
                                    <td className="whitespace-nowrap px-3 py-4">{student.created}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                className="text-gray-500 transition hover:text-violet-600"
                                                aria-label={`${student.name} ma'lumotlarini ko'rish`}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeStudent(student.id)}
                                                className="text-gray-500 transition hover:text-red-500"
                                                aria-label={`${student.name}ni o'chirish`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                className="text-violet-600 transition hover:text-violet-700"
                                                aria-label={`${student.name}ni tahrirlash`}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-12 text-center">
                                        <p className="text-[14px] font-bold text-gray-600">
                                            Talaba topilmadi
                                        </p>
                                        <p className="mt-1 text-[13px] text-gray-400">
                                            Qidiruv so'zini o'zgartirib qayta urinib ko'ring.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        <ChevronLeft size={15} />
                        Previous
                    </button>

                    <div className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-600">
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-9 min-w-9 rounded-xl px-3 transition ${
                                    page === currentPage
                                        ? "bg-gray-100 text-gray-900"
                                        : "hover:bg-gray-50 hover:text-violet-600"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-2 text-gray-400">...</span>
                        {[8, 9, 10].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className="h-9 min-w-9 rounded-xl px-3 transition hover:bg-gray-50 hover:text-violet-600"
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage((page) => Math.min(10, page + 1))}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        Next
                        <ChevronRight size={15} />
                    </button>
                </div>
            </section>

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-[220] bg-black/45 transition-opacity duration-300 ${
                    showDrawer ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                className={`fixed right-0 top-0 z-[230] flex h-screen w-full max-w-[392px] flex-col bg-white shadow-[-18px_0_45px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
                    showDrawer ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between px-5 pb-5 pt-6">
                    <div>
                        <h2 className="text-[17px] font-extrabold tracking-tight text-[#111827]">
                            Talaba qo'shish
                        </h2>
                        <p className="mt-1 text-[12px] font-medium text-gray-400">
                            Bu yerda siz yangi Talaba qo'shishingiz mumkin.
                        </p>
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                        aria-label="Yopish"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Telefon raqam
                        </span>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(event) => updateForm("phone", event.target.value)}
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Mail
                        </span>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => updateForm("email", event.target.value)}
                            placeholder="Elektron pochtani kiriting"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Talaba FIO
                        </span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(event) => updateForm("name", event.target.value)}
                            placeholder="Ma'lumotni kiriting"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Tug'ilgan sanasi
                        </span>
                        <div className="relative">
                            <input
                                type="text"
                                value={form.birth}
                                onChange={(event) => updateForm("birth", event.target.value)}
                                placeholder="dd/mm/yyyy"
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 pr-10 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                            <Calendar
                                size={15}
                                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Manzil
                        </span>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(event) => updateForm("address", event.target.value)}
                            placeholder="Manzilni kiriting"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Parol
                        </span>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(event) => updateForm("password", event.target.value)}
                            placeholder="Parolni kiriting"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </label>

                    <div>
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Guruh
                        </span>
                        {selectedGroups.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                {selectedGroups.map((group) => (
                                    <span
                                        key={group}
                                        className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold text-violet-600"
                                    >
                                        {group}
                                    </span>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowGroupModal(true)}
                            className="flex h-10 w-full items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 text-[13px] font-extrabold text-violet-600 shadow-sm transition hover:bg-violet-50"
                        >
                            <Plus size={16} />
                            Guruh qo'shish
                        </button>
                    </div>

                    <div>
                        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                            Surati
                        </span>
                        <label className="flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 text-center transition hover:bg-gray-50">
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Upload size={22} className="mb-3 text-gray-400" />
                            {form.imageName ? (
                                <>
                                    <span className="max-w-[260px] truncate text-[12px] font-extrabold text-violet-600">
                                        {form.imageName}
                                    </span>
                                    <span className="mt-1.5 text-[11px] font-semibold text-gray-400">
                                        Rasm tanlandi
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[12px] font-semibold text-gray-600">
                                        <span className="font-extrabold text-violet-600">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </span>
                                    <span className="mt-1.5 text-[11px] font-semibold text-gray-400">
                                        JPG or PNG (max. 2 MB)
                                    </span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                    <button
                        onClick={closeDrawer}
                        className="h-10 rounded-xl border border-gray-100 bg-white px-5 text-[13px] font-extrabold text-gray-600 transition hover:bg-gray-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={addStudent}
                        disabled={!form.name.trim()}
                        className="h-10 rounded-xl bg-violet-600 px-6 text-[13px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                    >
                        Saqlash
                    </button>
                </div>
            </aside>

            {showGroupModal && (
                <div className="fixed inset-0 z-[260] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/15"
                        onClick={() => setShowGroupModal(false)}
                    />
                    <div className="relative w-full max-w-[328px] rounded-xl bg-white p-4 shadow-2xl">
                        <div className="mb-3 flex items-start justify-between">
                            <div>
                                <h3 className="text-[16px] font-extrabold text-[#111827]">
                                    Guruhga biriktirish
                                </h3>
                                <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                                    Bir yoki bir nechta guruhni tanlang
                                </p>
                            </div>
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-50"
                                aria-label="Guruh oynasini yopish"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={groupSearch}
                            onChange={(event) => setGroupSearch(event.target.value)}
                            placeholder="Guruh qidirish..."
                            className="mb-3 h-9 w-full rounded-lg border border-gray-200 px-3 text-[12px] font-medium text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />

                        <div className="mb-3 overflow-hidden rounded-lg border border-gray-100 bg-white">
                            {filteredGroups.map((group) => {
                                const checked = selectedGroups.includes(group)

                                return (
                                    <label
                                        key={group}
                                        className="flex h-9 cursor-pointer items-center gap-3 px-3 text-[12px] font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleGroup(group)}
                                            className="h-3.5 w-3.5 rounded border-gray-300 accent-violet-600"
                                        />
                                        {group}
                                    </label>
                                )
                            })}
                            {filteredGroups.length === 0 && (
                                <div className="px-3 py-4 text-center text-[12px] font-semibold text-gray-400">
                                    Guruh topilmadi
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="h-9 rounded-lg border border-gray-100 bg-white px-4 text-[12px] font-extrabold text-gray-700 transition hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="h-9 rounded-lg bg-violet-400 px-5 text-[12px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-500"
                            >
                                Qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
