import { useMemo, useState, useEffect } from "react"
import {
    Archive,
    ChevronDown,
    Clock,
    GraduationCap,
    MoreVertical,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    Users,
    X,
} from "lucide-react"
import { Button, IconButton, Tooltip, Menu, MenuItem, CircularProgress, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"
import api from "../api"

const weekDays = [
    { label: "Dushanba", short: "Du", enum: "MONDAY" },
    { label: "Seshanba", short: "Se", enum: "TUESDAY" },
    { label: "Chorshanba", short: "Chor", enum: "WEDNESDAY" },
    { label: "Payshanba", short: "Pay", enum: "THURSDAY" },
    { label: "Juma", short: "Ju", enum: "FRIDAY" },
    { label: "Shanba", short: "Shan", enum: "SATURDAY" },
    { label: "Yakshanba", short: "Yak", enum: "SUNDAY" },
]

const emptyForm = {
    name: "",
    course_id: "",
    room_id: "",
    days: [], // holds weekDays.short
    time: "09:00",
    startDate: "2026-05-20",
    description: "",
    teachers: [], // holds teacher IDs
    students: [], // holds student IDs
    maxStudent: 20
}

export default function Class() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])
    const [courses, setCourses] = useState([])
    const [rooms, setRooms] = useState([])
    const [dbTeachers, setDbTeachers] = useState([])
    const [dbStudents, setDbStudents] = useState([])

    const [showDrawer, setShowDrawer] = useState(false)
    const [picker, setPicker] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [activeTab, setActiveTab] = useState("groups")
    const [actionAnchorEl, setActionAnchorEl] = useState(null)
    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Archive modal
    const [archiveModal, setArchiveModal] = useState(false)
    const [archiveLoading, setArchiveLoading] = useState(false)

    // Archive state (localStorage)
    const [archivedGroupIds, setArchivedGroupIds] = useState(() => {
        try {
            const saved = localStorage.getItem("archivedGroupIds")
            if (!saved) return []
            const parsed = JSON.parse(saved)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        if (Array.isArray(archivedGroupIds)) {
            localStorage.setItem("archivedGroupIds", JSON.stringify(archivedGroupIds))
        }
    }, [archivedGroupIds])

    // Edit drawer
    const [editDrawer, setEditDrawer] = useState(false)
    const [editForm, setEditForm] = useState({ name: "" })
    const [editSaving, setEditSaving] = useState(false)

    const handleActionClick = (event, id) => {
        setActionAnchorEl(event.currentTarget)
        setSelectedGroupId(id)
    }

    const handleActionClose = () => {
        setActionAnchorEl(null)
    }

    const openEditDrawer = () => {
        const g = groups.find(gr => gr.id === selectedGroupId)
        if (g) setEditForm({ name: g.name })
        setEditDrawer(true)
        handleActionClose()
    }

    const handleEditSave = async () => {
        if (!editForm.name.trim() || !selectedGroupId) return
        setEditSaving(true)
        try {
            await api.patch(`/groups/${selectedGroupId}`, { name: editForm.name })
            setGroups(prev => prev.map(g => g.id === selectedGroupId ? { ...g, name: editForm.name } : g))
            setEditDrawer(false)
            setSelectedGroupId(null)
        } catch (err) {
            console.error("Guruhni tahrirlashda xato:", err)
        } finally {
            setEditSaving(false)
        }
    }

    const handleArchive = async () => {
        if (!selectedGroupId) return
        setArchiveLoading(true)
        try {
            if (activeTab === "archive") {
                // Permanent delete
                await api.delete(`/groups/${selectedGroupId}`)
                setArchivedGroupIds(prev => prev.filter(id => id !== selectedGroupId))
                setGroups(prev => prev.filter(g => g.id !== selectedGroupId))
            } else {
                // Soft delete (archive)
                setArchivedGroupIds(prev => [...new Set([...prev, selectedGroupId])])
            }
            setArchiveModal(false)
            setSelectedGroupId(null)
        } catch (err) {
            console.error("Amaliyotda xato:", err)
        } finally {
            setArchiveLoading(false)
        }
    }

    const handleRestore = (e, id) => {
        e.stopPropagation()
        setArchivedGroupIds(prev => prev.filter(item => item !== id))
    }

    // API orqali ma'lumotlarni yuklash
    const loadAllData = async () => {
        setLoading(true)
        setError("")
        try {
            // Guruhlarni yuklash
            const groupRes = await api.get("/groups/all")
            const rawGroups = groupRes.data?.data || []
            const mappedGroups = rawGroups.map((g) => {
                const dayLabels = (g.week_day || []).map(wd => {
                    const found = weekDays.find(d => d.enum === wd)
                    return found ? found.short : wd
                }).join(", ")

                return {
                    id: g.id,
                    name: g.name,
                    course: g.course?.name || "Kurs yo'q",
                    duration: `${g.course?.duration_month || 3} oy`,
                    time: g.start_time || "09:00",
                    days: dayLabels || "Du, Chor, Ju",
                    room: g.room?.name || "Xona yo'q",
                    teacher: g.teachers?.[0]?.full_name || "Biriktirilmagan",
                    students: g.students?.length || 0,
                    active: true,
                }
            })
            setGroups(mappedGroups)
            // Mavjud bo'lmagan arxiv IDlarini tozalash
            const fetchedGroupIds = mappedGroups.map(g => g.id)
            setArchivedGroupIds(prev => prev.filter(id => fetchedGroupIds.includes(id)))

            // O'qituvchilarni yuklash (statistikada kerak)
            const teacherRes = await api.get("/teachers")
            setDbTeachers(teacherRes.data?.data || [])

        } catch (err) {
            console.error("Guruh ma'lumotlarini yuklashda xatolik:", err)
            setError("Guruhlar ma'lumotlarini yuklashda xatolik yuz berdi. Tarmoqni tekshiring.")
        } finally {
            setLoading(false)
        }
    }

    const loadFormData = async () => {
        if (courses.length > 0 && rooms.length > 0 && dbStudents.length > 0) return
        try {
            const [courseRes, roomRes, studentRes] = await Promise.all([
                api.get("/courses").catch(() => ({ data: { data: [] } })),
                api.get("/rooms").catch(() => ({ data: { data: [] } })),
                api.get("/students").catch(() => ({ data: { data: [] } }))
            ])
            setCourses(courseRes.data?.data || [])
            setRooms(roomRes.data?.data || [])
            setDbStudents(studentRes.data?.data || [])
        } catch (err) {
            console.error("Forma ma'lumotlarini yuklashda xato:", err)
        }
    }

    useEffect(() => {
        if (showDrawer) {
            loadFormData()
        }
    }, [showDrawer])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAllData()
        }, 0)

        return () => clearTimeout(timer)
    }, [])

    const totalStudentsCount = useMemo(() => {
        return groups.reduce((acc, g) => acc + g.students, 0)
    }, [groups])

    const dynamicStats = useMemo(
        () => [
            { label: "Jami guruhlar", value: groups.length, icon: Users },
            { label: "O'qituvchilar", value: dbTeachers.length, icon: Users },
            { label: "O'quvchilar", value: totalStudentsCount, icon: GraduationCap, avatars: true },
        ],
        [groups.length, dbTeachers.length, totalStudentsCount]
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

    const toggleListItem = (field, itemId) => {
        setForm((current) => ({
            ...current,
            [field]: current[field].includes(itemId)
                ? current[field].filter((id) => id !== itemId)
                : [...current[field], itemId],
        }))
    }

    const addGroup = async () => {
        if (!form.name.trim() || !form.course_id || !form.room_id || form.days.length === 0) return

        setLoading(true)
        setError("")
        try {
            // Dars kunlarini enum formatiga o'tkazish
            const backendDays = form.days.map(dShort => {
                const found = weekDays.find(wd => wd.short === dShort)
                return found ? found.enum : "MONDAY"
            })

            const payload = {
                name: form.name,
                description: form.description || "Yangi o'quv guruhi",
                course_id: Number(form.course_id),
                teachers: form.teachers.map(Number),
                students: form.students.map(Number),
                room_id: Number(form.room_id),
                start_date: form.startDate || "2026-05-20",
                week_day: backendDays,
                start_time: form.time || "09:00",
                max_student: Number(form.maxStudent || 20)
            }

            await api.post("/groups", payload)
            
            // Qayta yuklash
            await loadAllData()
            
            setForm(emptyForm)
            closeDrawer()
        } catch (err) {
            console.error("Guruh yaratishda xato:", err)
            setError("Guruhni yaratishda xatolik yuz berdi. Payloadni tekshiring.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] px-6 py-7 sm:px-8">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-[29.5px] font-extrabold tracking-tight text-[#111827]">
                    Guruhlar
                </h1>
                <Button
                    variant="contained"
                    onClick={() => setShowDrawer(true)}
                    startIcon={<Plus size={17} strokeWidth={2.6} />}
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
                    Guruh qo'shish
                </Button>
            </div>

            <div className="mb-5 flex items-center gap-3">
                <Button
                    onClick={() => setActiveTab("groups")}
                    sx={{
                        textTransform: "none",
                        height: 36,
                        borderRadius: "8px",
                        px: 2.5,
                        fontSize: "12px",
                        fontWeight: "800",
                        backgroundColor: activeTab === "groups" ? "white" : "transparent",
                        color: activeTab === "groups" ? "#111827" : "#6b7280",
                        border: "1px solid",
                        borderColor: activeTab === "groups" ? "#f3f4f6" : "transparent",
                        boxShadow: activeTab === "groups" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
                        "&:hover": {
                            backgroundColor: activeTab === "groups" ? "white" : "#ffffff80"
                        }
                    }}
                >
                    Guruhlar
                </Button>
                <Button
                    onClick={() => setActiveTab("archive")}
                    startIcon={<Archive size={15} />}
                    sx={{
                        textTransform: "none",
                        height: 36,
                        borderRadius: "8px",
                        px: 2.5,
                        fontSize: "12px",
                        fontWeight: "800",
                        backgroundColor: activeTab === "archive" ? "white" : "transparent",
                        color: activeTab === "archive" ? "#7c3aed" : "#111827",
                        border: "1px solid",
                        borderColor: activeTab === "archive" ? "#f3f4f6" : "transparent",
                        boxShadow: activeTab === "archive" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
                        "&:hover": {
                            backgroundColor: activeTab === "archive" ? "white" : "#ffffff80"
                        }
                    }}
                >
                    Arxiv
                </Button>
            </div>

            {error && (
                <Alert severity="error" className="mb-4 rounded-xl">
                    {error}
                </Alert>
            )}

            <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {dynamicStats.map(({ label, value, icon: Icon, avatars }) => (
                    <div
                        key={label}
                        className="relative min-h-[96px] rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
                    >
                        <Tooltip title={`${label} statistikasi`} placement="top">
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", right: 12, top: 12, color: "#9ca3af", "&:hover": { color: "#4b5563" } }}
                            >
                                <MoreVertical size={17} />
                            </IconButton>
                        </Tooltip>
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-[#111827]">
                            <Icon size={17} />
                        </div>
                        <p className="text-[13.5px] font-medium text-gray-600">{label}</p>
                        <p className="mt-1 text-[29.5px] font-extrabold leading-none text-[#111827]">
                            {value}
                        </p>
                        {avatars && (
                            <div className="absolute bottom-5 right-8 flex -space-x-2">
                                {["I", "M", "S"].map((item, index) => (
                                    <span
                                        key={item}
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10.5px] font-extrabold text-white ${
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

            {/* Groups Grid / Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <CircularProgress sx={{ color: "#7c3aed" }} />
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 text-sm">
                    Guruhlar topilmadi.
                </div>
            ) : (
                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-[#fafbfe] text-[13.5px] font-extrabold text-gray-500">
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-5 py-4">Guruh nomi</th>
                                    <th className="px-5 py-4">Kurs</th>
                                    <th className="px-5 py-4">Davomiyligi</th>
                                    <th className="px-5 py-4 text-center">Dars vaqti</th>
                                    <th className="px-5 py-4">Xona</th>
                                    <th className="px-5 py-4">O'qituvchi</th>
                                    <th className="px-5 py-4 text-center">Talabalar</th>
                                    <th className="w-[54px] px-4 py-4 text-right">
                                        <RefreshCw size={14} className="ml-auto text-gray-400" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === "groups" 
                                    ? groups.filter(g => !archivedGroupIds.includes(g.id))
                                    : groups.filter(g => archivedGroupIds.includes(g.id))
                                ).map((group) => (
                                    <tr
                                        key={group.id}
                                        onClick={() => navigate(`/dashboard/groups/${group.id}`)}
                                        className="cursor-pointer border-b border-gray-50 text-[14.5px] font-semibold text-[#111827] last:border-b-0 transition hover:bg-gray-50/50"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation()
                                                        setGroups((current) =>
                                                            current.map((item) =>
                                                                item.id === group.id
                                                                    ? { ...item, active: !item.active }
                                                                    : item
                                                            )
                                                        )
                                                    }}
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
                                                    className={`rounded-full w-[64px] shrink-0 text-center py-1 text-[11.5px] font-extrabold ${
                                                        group.active
                                                            ? "bg-emerald-50 text-emerald-500"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {group.active ? "FAOL" : "NOFAOL"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 font-extrabold text-violet-700">{group.name}</td>
                                        <td className="px-5 py-5">
                                            <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-[12.5px] font-extrabold text-fuchsia-600 border border-fuchsia-100/40">
                                                {group.course}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 text-gray-500 font-semibold">{group.duration}</td>
                                        <td className="px-5 py-5 text-center">
                                            <p className="font-extrabold">{group.time}</p>
                                            <p className="mt-0.5 text-[12.5px] font-semibold text-gray-400">
                                                {group.days}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 text-gray-500 font-semibold">{group.room}</td>
                                        <td className="px-5 py-5">
                                            <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[12.5px] font-extrabold text-[#1f2d5a]">
                                                {group.teacher}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 text-center font-extrabold">
                                            {group.students}
                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            {activeTab === "archive" ? (
                                                <Button
                                                    onClick={(e) => handleRestore(e, group.id)}
                                                    size="small"
                                                    sx={{ textTransform: "none", fontSize: "12px", color: "#7c3aed", fontWeight: "bold", mr: 1 }}
                                                >
                                                    Tiklash
                                                </Button>
                                            ) : null}
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleActionClick(e, group.id)
                                                }}
                                                size="small"
                                                sx={{ color: "#6b7280", "&:hover": { color: "#7c3aed" } }}
                                            >
                                                <MoreVertical size={17} />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {activeTab === "archive" && groups.filter(g => archivedGroupIds.includes(g.id)).length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                                <div>
                                    <p className="text-[15.5px] font-extrabold text-[#1f2d5a]">Arxivlangan guruhlar topilmadi.</p>
                                    <p className="mt-1 text-[14.5px] font-semibold text-gray-400">
                                        Asosiy guruhlar ro'yxatiga qaytishingiz mumkin.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setActiveTab("groups")}
                                    variant="contained"
                                    sx={{ textTransform: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}
                                >
                                    Guruhlarga qaytish
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-[220] bg-black/45 transition-opacity duration-300 ${
                    showDrawer ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 z-[230] flex h-screen w-full max-w-[430px] flex-col bg-white shadow-[-18px_0_45px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
                    showDrawer ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 px-5 pb-4 pt-5">
                    <div>
                        <h2 className="text-[18.5px] font-extrabold text-[#111827]">
                            Guruh qo'shish
                        </h2>
                        <p className="mt-1 text-[13.5px] font-medium text-gray-500">
                            Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.
                        </p>
                    </div>
                    <IconButton
                        onClick={closeDrawer}
                        sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563", backgroundColor: "#f9fafb" }, borderRadius: "8px", p: 0.5 }}
                        aria-label="Yopish"
                    >
                        <X size={17} />
                    </IconButton>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                    <FieldLabel label="Guruh nomi" required>
                        <input
                            value={form.name}
                            onChange={(event) => updateForm("name", event.target.value)}
                            placeholder="Frontend N105"
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14.5px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </FieldLabel>

                    <FieldLabel label="Kurs" required>
                        <div className="relative">
                            <select
                                value={form.course_id}
                                onChange={(event) => updateForm("course_id", event.target.value)}
                                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[14.5px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            >
                                <option value="">Tanlang</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
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
                                value={form.room_id}
                                onChange={(event) => updateForm("room_id", event.target.value)}
                                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[14.5px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            >
                                <option value="">Tanlang</option>
                                {rooms.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.capacity} kishi)</option>
                                ))}
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
                                    className="flex h-9 items-center gap-2 rounded-lg border border-gray-100 px-3 text-left text-[13.5px] font-extrabold text-gray-700 transition hover:bg-violet-50"
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
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 pr-10 text-[14.5px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                            <Clock
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </FieldLabel>

                    <FieldLabel label="Maksimal o'quvchilar soni" required>
                        <input
                            type="number"
                            value={form.maxStudent}
                            onChange={(event) => updateForm("maxStudent", event.target.value)}
                            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14.5px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </FieldLabel>

                    <FieldLabel label="Boshlanish sanasi" required>
                        <div className="relative">
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(event) => updateForm("startDate", event.target.value)}
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14.5px] font-semibold text-gray-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                        </div>
                    </FieldLabel>

                    <FieldLabel label="Tavsif">
                        <textarea
                            value={form.description}
                            onChange={(event) => updateForm("description", event.target.value)}
                            placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
                            className="min-h-[78px] w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-[14.5px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                        />
                    </FieldLabel>

                    <PickerButton
                        label="O'qituvchilar"
                        values={form.teachers.map(tid => {
                            const found = dbTeachers.find(t => t.id === tid)
                            return found ? found.full_name : tid
                        })}
                        onClick={() => setPicker("teachers")}
                    />
                    <PickerButton
                        label="Talabalar"
                        values={form.students.map(sid => {
                            const found = dbStudents.find(s => s.id === sid)
                            return found ? found.full_name : sid
                        })}
                        onClick={() => setPicker("students")}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
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
                        onClick={addGroup}
                        variant="contained"
                        disabled={!form.name.trim() || !form.course_id || !form.room_id || form.days.length === 0}
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

            {picker && (
                <PickerModal
                    title={picker === "teachers" ? "O'qituvchi qo'shish" : "Talaba qo'shish"}
                    items={picker === "teachers" ? dbTeachers : dbStudents}
                    selected={picker === "teachers" ? form.teachers : form.students}
                    onToggle={(itemId) => toggleListItem(picker, itemId)}
                    onClose={() => setPicker(null)}
                />
            )}

            <Menu
                anchorEl={actionAnchorEl}
                open={Boolean(actionAnchorEl)}
                onClose={handleActionClose}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            borderRadius: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #f3f4f6",
                            p: 0.5,
                            minWidth: 150
                        }
                    }
                }}
            >
                {activeTab === "groups" && (
                    <MenuItem
                        onClick={openEditDrawer}
                        sx={{
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#374151",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                        }}
                    >
                        <Pencil size={14} />Tahrirlash
                    </MenuItem>
                )}
                <MenuItem
                    onClick={() => { handleActionClose(); setArchiveModal(true) }}
                    sx={{
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#ef4444",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "#fef2f2" }
                    }}
                >
                    <Trash2 size={14} />{activeTab === "archive" ? "Butunlay o'chirish" : "O'chirish"}
                </MenuItem>
            </Menu>

            {/* Archive confirm modal */}
            {archiveModal && (
                <>
                    <div onClick={() => setArchiveModal(false)} className="fixed inset-0 z-[400] bg-black/40" />
                    <div className="fixed inset-0 z-[500] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                                    <Trash2 size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-800">
                                        {activeTab === "archive" ? "Butunlay o'chirish" : "Guruhni arxivlash"}
                                    </h3>
                                    <p className="text-[12px] text-gray-400 font-medium">
                                        {activeTab === "archive" ? "Bu amalni ortga qaytarib bo'lmaydi" : "Guruh arxivga o'tkaziladi"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                                <span className="font-bold text-gray-700">"{groups.find(g => g.id === selectedGroupId)?.name}"</span> 
                                {activeTab === "archive" 
                                    ? " guruhini arxivdan butunlay o'chirib yubormoqchimisiz?" 
                                    : " guruhini arxivga o'tkazmoqchimisiz? Arxivdagi guruhni keyinchalik qayta tiklash mumkin."}
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setArchiveModal(false)}
                                    disabled={archiveLoading}
                                    className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleArchive}
                                    disabled={archiveLoading}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white transition disabled:opacity-50 ${activeTab === "archive" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
                                >
                                    {archiveLoading ? <><CircularProgress size={14} color="inherit" />Jarayonda...</> : (activeTab === "archive" ? "Ha, butunlay o'chirish" : "Ha, arxivlash")}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Edit Drawer */}
            <>
                <div
                    onClick={() => setEditDrawer(false)}
                    className={`fixed inset-0 z-[220] bg-black/45 transition-opacity duration-300 ${editDrawer ? "opacity-100" : "pointer-events-none opacity-0"}`}
                />
                <aside className={`fixed right-0 top-0 z-[230] flex h-screen w-full max-w-[430px] flex-col bg-white shadow-[-18px_0_45px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${editDrawer ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex items-start justify-between border-b border-gray-100 px-5 pb-4 pt-5">
                        <div>
                            <h2 className="text-[18.5px] font-extrabold text-[#111827]">Guruhni tahrirlash</h2>
                            <p className="mt-1 text-[13.5px] font-medium text-gray-500">Guruh ma'lumotlarini o'zgartiring va saqlang.</p>
                        </div>
                        <IconButton
                            onClick={() => setEditDrawer(false)}
                            sx={{ color: "#9ca3af", "&:hover": { color: "#4b5563", backgroundColor: "#f9fafb" }, borderRadius: "8px", p: 0.5 }}
                        >
                            <X size={17} />
                        </IconButton>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                        <label className="block">
                            <span className="mb-2 block text-[13.5px] font-extrabold text-gray-700">Guruh nomi <span className="text-red-500">*</span></span>
                            <input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ name: e.target.value })}
                                placeholder="Guruh nomi"
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14.5px] font-semibold text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                            />
                        </label>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                        <Button
                            onClick={() => setEditDrawer(false)}
                            variant="outlined"
                            sx={{ textTransform: "none", height: 40, borderRadius: "12px", borderColor: "#f3f4f6", fontSize: "13px", fontWeight: "800", color: "#4b5563", px: 3, "&:hover": { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" } }}
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            variant="contained"
                            disabled={editSaving || !editForm.name.trim()}
                            sx={{ textTransform: "none", height: 40, borderRadius: "12px", backgroundColor: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "800", px: 3, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)", "&:hover": { backgroundColor: "#6d28d9" }, "&:disabled": { backgroundColor: "#f3f4f6", color: "#9ca3af", boxShadow: "none" } }}
                        >
                            {editSaving ? "Saqlanmoqda..." : "Yangilash"}
                        </Button>
                    </div>
                </aside>
            </>
        </div>
    )
}

function RequiredTitle({ children }) {
    return (
        <span className="mb-2 block text-[13.5px] font-extrabold text-gray-700">
            {children} <span className="text-red-500">*</span>
        </span>
    )
}

function FieldLabel({ label, required, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-[13.5px] font-extrabold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </span>
            {children}
        </label>
    )
}

function PickerButton({ label, values, onClick }) {
    return (
        <div>
            <span className="mb-2 block text-[13.5px] font-extrabold text-gray-700">{label}</span>
            {values.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {values.map((value) => (
                        <span
                            key={value}
                            className="rounded-lg bg-violet-50 px-2.5 py-1 text-[12.5px] font-extrabold text-violet-600"
                        >
                            {value}
                        </span>
                    ))}
                </div>
            )}
            <Button
                onClick={onClick}
                variant="outlined"
                fullWidth
                startIcon={<Plus size={16} />}
                sx={{
                    textTransform: "none",
                    height: 40,
                    borderRadius: "12px",
                    borderColor: "#f3f4f6",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#7c3aed",
                    backgroundColor: "white",
                    justifyContent: "flex-start",
                    px: 2,
                    "&:hover": {
                        backgroundColor: "#f5f3ff",
                        borderColor: "#ddd6fe"
                    }
                }}
            >
                Qo'shish
            </Button>
        </div>
    )
}

function PickerModal({ title, items, selected, onToggle, onClose }) {
    return (
        <div className="fixed inset-0 z-[260] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/15" onClick={onClose} />
            <div className="relative w-full max-w-[328px] rounded-xl bg-white p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[17.5px] font-extrabold text-[#111827]">{title}</h3>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{ color: "#6b7280", "&:hover": { color: "#374151" } }}
                    >
                        <X size={16} />
                    </IconButton>
                </div>
                <div className="mb-3 max-h-[220px] overflow-y-auto rounded-lg border border-gray-100 bg-white">
                    {items.map((item) => (
                        <label
                            key={item.id}
                            className="flex h-9 cursor-pointer items-center gap-3 px-3 text-[13.5px] font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(item.id)}
                                onChange={() => onToggle(item.id)}
                                className="h-3.5 w-3.5 rounded border-gray-300 accent-violet-600"
                            />
                            {item.full_name}
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            height: 36,
                            borderRadius: "8px",
                            borderColor: "#f3f4f6",
                            fontSize: "12px",
                            fontWeight: "800",
                            color: "#4b5563",
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb"
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            height: 36,
                            borderRadius: "8px",
                            backgroundColor: "#7c3aed",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "800",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: "#6d28d9",
                                boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            }
                        }}
                    >
                        Tasdiqlash
                    </Button>
                </div>
            </div>
        </div>
    )
}
