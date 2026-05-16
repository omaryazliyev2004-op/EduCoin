import { useMemo, useState } from "react"
import {
    Archive,
    Calendar,
    ChevronDown,
    Clock,
    GraduationCap,
    MoreVertical,
    Plus,
    RefreshCw,
    Users,
    X,
} from "lucide-react"

const initialGroups = [
    {
        id: 1,
        name: "N26",
        course: "Backend",
        duration: "6 oy",
        time: "09:30",
        days: "Du, Se, Chor, Pay, Ju",
        room: "Autodesk",
        teacher: "Mohirbek",
        students: 1,
        active: true,
    },
    {
        id: 2,
        name: "n105",
        course: "Backend",
        duration: "6 oy",
        time: "16:00",
        days: "Se, Pay, Shan",
        room: "Autodesk",
        teacher: "Mohirbek",
        students: 4,
        active: true,
    },
]

const weekDays = [
    { label: "Dushanba", short: "Du" },
    { label: "Seshanba", short: "Se" },
    { label: "Chorshanba", short: "Chor" },
    { label: "Payshanba", short: "Pay" },
    { label: "Juma", short: "Ju" },
    { label: "Shanba", short: "Shan" },
    { label: "Yakshanba", short: "Yak" },
]

const emptyForm = {
    name: "",
    course: "",
    room: "",
    days: [],
    time: "09:00",
    startDate: "",
    description: "",
    teachers: [],
    students: [],
}

export default function Class() {
    const [groups, setGroups] = useState(initialGroups)
    const [showDrawer, setShowDrawer] = useState(false)
    const [picker, setPicker] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [activeTab, setActiveTab] = useState("groups")
    const [openMenu, setOpenMenu] = useState(null)

    const dynamicStats = useMemo(
        () => [
            { label: "Jami guruhlar", value: groups.length, icon: Users },
            { label: "O'qituvchilar", value: 0, icon: Users },
            { label: "O'quvchilar", value: 0, icon: GraduationCap, avatars: true },
        ],
        [groups.length]
    )

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }))
    }

    const closeDrawer = () => {
        setShowDrawer(false)
        setPicker(null)
    }

    const toggleDay = (short) => {
        setForm((current) => ({
            ...current,
            days: current.days.includes(short)
                ? current.days.filter((day) => day !== short)
                : [...current.days, short],
        }))
    }

    const toggleListItem = (field, item) => {
        setForm((current) => ({
            ...current,
            [field]: current[field].includes(item)
                ? current[field].filter((value) => value !== item)
                : [...current[field], item],
        }))
    }

    const addGroup = () => {
        if (!form.name.trim() || !form.course || !form.room || form.days.length === 0) return

        setGroups((current) => [
            ...current,
            {
                id: Date.now(),
                name: form.name,
                course: form.course,
                duration: "6 oy",
                time: form.time,
                days: form.days.join(", "),
                room: form.room,
                teacher: form.teachers[0] || "Biriktirilmagan",
                students: form.students.length,
                active: true,
            },
        ])
        setForm(emptyForm)
        closeDrawer()
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] px-6 py-7 sm:px-8">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-[28px] font-extrabold tracking-tight text-[#111827]">
                    Guruhlar
                </h1>
                <button
                    onClick={() => setShowDrawer(true)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-[13px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 active:scale-95"
                >
                    <Plus size={17} strokeWidth={2.6} />
                    Guruh qo'shish
                </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`h-9 rounded-lg px-4 text-[12px] font-extrabold shadow-sm ring-1 ring-gray-100 ${
                        activeTab === "groups" ? "bg-white text-[#111827]" : "text-gray-500 hover:bg-white"
                    }`}
                >
                    Guruhlar
                </button>
                <button
                    onClick={() => setActiveTab("archive")}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-2 text-[12px] font-extrabold transition hover:bg-white ${
                        activeTab === "archive" ? "bg-white text-violet-600" : "text-[#111827]"
                    }`}
                >
                    <Archive size={15} />
                    Arxiv
                </button>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {dynamicStats.map(({ label, value, icon: Icon, avatars }) => (
                    <div
                        key={label}
                        className="relative min-h-[96px] rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
                    >
                        <button
                            onClick={() => setOpenMenu(openMenu === label ? null : label)}
                            className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-600"
                        >
                            <MoreVertical size={17} />
                        </button>
                        {openMenu === label && (
                            <div className="absolute right-3 top-9 z-10 rounded-xl border border-gray-100 bg-white px-3 py-2 text-[12px] font-semibold text-gray-500 shadow-xl">
                                {label} statistikasi
                            </div>
                        )}
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-[#111827]">
                            <Icon size={17} />
                        </div>
                        <p className="text-[12px] font-medium text-gray-600">{label}</p>
                        <p className="mt-1 text-[28px] font-extrabold leading-none text-[#111827]">
                            {value}
                        </p>
                        {avatars && (
                            <div className="absolute bottom-5 right-8 flex -space-x-2">
                                {["I", "M", "S"].map((item, index) => (
                                    <span
                                        key={item}
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-extrabold text-white ${
                                            index === 0
                                                ? "bg-[#1f2d5a]"
                                                : index === 1
                                                  ? "bg-orange-400"
                                                  : "bg-pink-500"
                                        }`}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#fafbfe] text-[12px] font-extrabold text-gray-500">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-5 py-4">Guruh nomi</th>
                                <th className="px-5 py-4">Kurs</th>
                                <th className="px-5 py-4">Davomiyligi</th>
                                <th className="px-5 py-4">Dars vaqti</th>
                                <th className="px-5 py-4">Xona</th>
                                <th className="px-5 py-4">O'qituvchi</th>
                                <th className="px-5 py-4 text-center">Talabalar</th>
                                <th className="w-[54px] px-4 py-4 text-right">
                                    <RefreshCw size={14} className="ml-auto text-gray-400" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === "groups" ? groups : []).map((group) => (
                                <tr
                                    key={group.id}
                                    className="border-b border-gray-50 text-[13px] font-semibold text-[#111827] last:border-b-0"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    setGroups((current) =>
                                                        current.map((item) =>
                                                            item.id === group.id
                                                                ? { ...item, active: !item.active }
                                                                : item
                                                        )
                                                    )
                                                }
                                                className={`relative h-[22px] w-[42px] rounded-full shadow-inner transition ${
                                                    group.active ? "bg-violet-600" : "bg-gray-300"
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition ${
                                                        group.active ? "right-0.5" : "left-0.5"
                                                    }`}
                                                />
                                            </button>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                                                    group.active
                                                        ? "bg-emerald-50 text-emerald-500"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {group.active ? "FAOL" : "NOFAOL"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 font-extrabold">{group.name}</td>
                                    <td className="px-5 py-5">
                                        <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-[11px] font-extrabold text-fuchsia-600">
                                            {group.course}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5">{group.duration}</td>
                                    <td className="px-5 py-5 text-center">
                                        <p className="font-extrabold">{group.time}</p>
                                        <p className="mt-0.5 text-[11px] font-semibold text-gray-500">
                                            {group.days}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5">{group.room}</td>
                                    <td className="px-5 py-5">
                                        <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-extrabold">
                                            {group.teacher}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 text-center font-extrabold">
                                        {group.students}
                                    </td>
                                    <td className="px-4 py-5 text-right">
                                        <button
                                            onClick={() => setOpenMenu(openMenu === group.id ? null : group.id)}
                                            className="text-gray-500 transition hover:text-violet-600"
                                        >
                                            <MoreVertical size={17} />
                                        </button>
                                        {openMenu === group.id && (
                                            <div className="absolute right-10 z-10 rounded-xl border border-gray-100 bg-white p-2 text-left shadow-xl">
                                                <button
                                                    onClick={() => {
                                                        setGroups((current) => current.filter((item) => item.id !== group.id))
                                                        setOpenMenu(null)
                                                    }}
                                                    className="rounded-lg px-3 py-2 text-[12px] font-semibold text-red-500 hover:bg-red-50"
                                                >
                                                    O'chirish
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activeTab === "archive" && (
                        <div className="px-6 py-10 text-center text-[13px] font-semibold text-gray-400">
                            Arxivlangan guruhlar topilmadi.
                        </div>
                    )}
                </div>
            </section>

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-[220] bg-black/45 transition-opacity duration-300 ${
                    showDrawer ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                className={`fixed right-0 top-0 z-[230] flex h-screen w-full max-w-[430px] flex-col bg-white shadow-[-18px_0_45px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
                    showDrawer ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 px-5 pb-4 pt-5">
                    <div>
                        <h2 className="text-[17px] font-extrabold text-[#111827]">
                            Guruh qo'shish
                        </h2>
                        <p className="mt-1 text-[12px] font-medium text-gray-500">
                            Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.
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

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                    <FieldLabel label="Guruh nomi" required>
                        <input
                            value={form.name}
                            onChange={(event) => updateForm("name", event.target.value)}
                            placeholder="Frontend 2024"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </FieldLabel>

                    <FieldLabel label="Kurs" required>
                        <div className="relative">
                            <select
                                value={form.course}
                                onChange={(event) => updateForm("course", event.target.value)}
                                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[13px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            >
                                <option value="">Tanlang</option>
                                <option>Backend</option>
                                <option>Frontend</option>
                                <option>Foundation</option>
                            </select>
                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </FieldLabel>

                    <FieldLabel label="Xona" required>
                        <div className="relative">
                            <select
                                value={form.room}
                                onChange={(event) => updateForm("room", event.target.value)}
                                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[13px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            >
                                <option value="">Tanlang</option>
                                <option>Autodesk</option>
                                <option>Najot</option>
                                <option>React</option>
                            </select>
                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </FieldLabel>

                    <div>
                        <RequiredTitle>Dars kunlari</RequiredTitle>
                        <div className="grid grid-cols-2 gap-2">
                            {weekDays.map((day) => (
                                <button
                                    key={day.short}
                                    onClick={() => toggleDay(day.short)}
                                    className="flex h-9 items-center gap-2 rounded-lg border border-gray-100 px-3 text-left text-[12px] font-extrabold text-gray-700 transition hover:bg-violet-50"
                                >
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                                            form.days.includes(day.short)
                                                ? "border-violet-600 bg-violet-600"
                                                : "border-gray-200 bg-white"
                                        }`}
                                    >
                                        {form.days.includes(day.short) && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                        )}
                                    </span>
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <FieldLabel label="Dars vaqti" required>
                        <div className="relative">
                            <input
                                type="time"
                                value={form.time}
                                onChange={(event) => updateForm("time", event.target.value)}
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 pr-10 text-[13px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                            <Clock
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </FieldLabel>

                    <FieldLabel label="Boshlanish sanasi" required>
                        <div className="relative">
                            <input
                                value={form.startDate}
                                onChange={(event) => updateForm("startDate", event.target.value)}
                                placeholder="dd/mm/yyyy"
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 pr-10 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                            <Calendar
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
                            />
                        </div>
                    </FieldLabel>

                    <FieldLabel label="Tavsif">
                        <textarea
                            value={form.description}
                            onChange={(event) => updateForm("description", event.target.value)}
                            placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
                            className="min-h-[78px] w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-[13px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </FieldLabel>

                    <PickerButton
                        label="O'qituvchilar"
                        values={form.teachers}
                        onClick={() => setPicker("teachers")}
                    />
                    <PickerButton
                        label="Talabalar"
                        values={form.students}
                        onClick={() => setPicker("students")}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                    <button
                        onClick={closeDrawer}
                        className="h-10 rounded-xl border border-gray-100 bg-white px-5 text-[13px] font-extrabold text-gray-700 transition hover:bg-gray-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={addGroup}
                        className="h-10 rounded-xl bg-violet-600 px-6 text-[13px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                        disabled={!form.name.trim() || !form.course || !form.room || form.days.length === 0}
                    >
                        Saqlash
                    </button>
                </div>
            </aside>

            {picker && (
                <PickerModal
                    title={picker === "teachers" ? "O'qituvchi qo'shish" : "Talaba qo'shish"}
                    items={picker === "teachers" ? ["Mohirbek", "Azizbek"] : ["Ali Valiyev", "Salim Qodirov", "Bobur", "Qodir Salimov"]}
                    selected={picker === "teachers" ? form.teachers : form.students}
                    onToggle={(item) => toggleListItem(picker, item)}
                    onClose={() => setPicker(null)}
                />
            )}
        </div>
    )
}

function RequiredTitle({ children }) {
    return (
        <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
            {children} <span className="text-red-500">*</span>
        </span>
    )
}

function FieldLabel({ label, required, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-[12px] font-extrabold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </span>
            {children}
        </label>
    )
}

function PickerButton({ label, values, onClick }) {
    return (
        <div>
            <span className="mb-2 block text-[12px] font-extrabold text-gray-700">{label}</span>
            {values.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {values.map((value) => (
                        <span
                            key={value}
                            className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold text-violet-600"
                        >
                            {value}
                        </span>
                    ))}
                </div>
            )}
            <button
                onClick={onClick}
                className="flex h-10 w-full items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 text-[13px] font-extrabold text-violet-600 shadow-sm transition hover:bg-violet-50"
            >
                <Plus size={16} />
                Qo'shish
            </button>
        </div>
    )
}

function PickerModal({ title, items, selected, onToggle, onClose }) {
    return (
        <div className="fixed inset-0 z-[260] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/15" onClick={onClose} />
            <div className="relative w-full max-w-[328px] rounded-xl bg-white p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[16px] font-extrabold text-[#111827]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-50"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="mb-3 overflow-hidden rounded-lg border border-gray-100 bg-white">
                    {items.map((item) => (
                        <label
                            key={item}
                            className="flex h-9 cursor-pointer items-center gap-3 px-3 text-[12px] font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(item)}
                                onChange={() => onToggle(item)}
                                className="h-3.5 w-3.5 rounded border-gray-300 accent-violet-600"
                            />
                            {item}
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="h-9 rounded-lg border border-gray-100 bg-white px-4 text-[12px] font-extrabold text-gray-700 transition hover:bg-gray-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={onClose}
                        className="h-9 rounded-lg bg-violet-500 px-5 text-[12px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-600"
                    >
                        Qo'shish
                    </button>
                </div>
            </div>
        </div>
    )
}
