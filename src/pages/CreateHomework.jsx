import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Bold, Italic, Underline, Strikethrough, Quote, Code, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, UploadCloud } from "lucide-react"
import api from "../api"

function ToolbarSelect({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-[14.5px] font-bold text-gray-600 transition hover:bg-gray-100"
            >
                {value}
                <svg className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                        {options.map(opt => (
                            <div 
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false) }}
                                className={`cursor-pointer px-3 py-2 text-[14.5px] font-semibold transition ${value === opt ? "bg-gray-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"}`}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function CreateHomework() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [topic, setTopic] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [lessons, setLessons] = useState([])
    const [selectedLessonId, setSelectedLessonId] = useState(null)

    useEffect(() => {
        api.get(`/lessons/my/group/${id}`)
            .then(res => {
                const data = res.data?.data || res.data || []
                const items = Array.isArray(data) ? data : []
                const mapped = items
                    .filter(i => i.id)
                    .map(i => ({ id: i.id, topic: i.topic || i.title || i.name || `Dars ${i.id}` }))
                setLessons(mapped)
            })
            .catch(err => console.error("Darslarni yuklashda xato:", err))
    }, [id])

    const [fontFamily, setFontFamily] = useState("Sans Serif")
    const [fontStyle, setFontStyle] = useState("Normal")
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)

    const handlePublish = async () => {
        if (!topic.trim()) return alert("Mavzuni tanlang yoki kiriting")
        if (!selectedLessonId) return alert("Iltimos, darsni tanlang (Mavzu bo'limidan)")
        
        setIsSubmitting(true)
        try {
            const payload = {
                group_id: Number(id),
                lesson_id: selectedLessonId,
                title: topic,
                description: description || "",
            }

            const formData = new FormData()
            Object.entries(payload).forEach(([k, v]) => formData.append(k, v))
            
            if (selectedFile) {
                formData.append("file", selectedFile)
            }

            await api.post(`/homework`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            
            navigate(`/dashboard/groups/${id}?tab=lessons`)
        } catch (err) {
            const errMsg = err?.response?.data?.message 
                || err?.response?.data?.detail 
                || JSON.stringify(err?.response?.data)
                || "Xatolik yuz berdi"
            alert(errMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="-m-6 min-h-full bg-white px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/dashboard/groups/${id}?tab=lessons`)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-violet-600"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-[25.5px] font-extrabold tracking-tight text-[#111827]">
                    Yangi uyga vazifa yaratish
                </h1>
            </div>

            <div className="max-w-[900px] space-y-6">
                {/* Topic field (Custom Premium Dropdown) */}
                <div className="relative">
                    <label className="mb-2 block text-[16.5px] font-bold text-[#1f2937]">
                        <span className="text-red-500 mr-1">*</span>Mavzu
                    </label>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-5 py-3.5 text-[16.5px] font-semibold transition-all ${
                            isDropdownOpen ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <span className={topic ? "text-gray-800" : "text-gray-400"}>
                            {topic || "Mavzulardan birini tanlang"}
                        </span>
                        <svg className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180 text-emerald-500" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                                <div className="max-h-[250px] overflow-y-auto py-2">
                                    <div 
                                        className="cursor-pointer px-5 py-3 text-[16.5px] font-semibold text-gray-400 hover:bg-gray-50"
                                        onClick={() => { setTopic(""); setSelectedLessonId(null); setIsDropdownOpen(false) }}
                                    >
                                        Mavzulardan birini tanlang
                                    </div>
                                    {lessons.length === 0 && (
                                        <div className="px-5 py-3 text-[14.5px] font-medium text-gray-500 italic">
                                            Ushbu guruh uchun darslar topilmadi
                                        </div>
                                    )}
                                    {lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => { setTopic(lesson.topic); setSelectedLessonId(lesson.id); setIsDropdownOpen(false) }}
                                            className={`cursor-pointer px-5 py-3 text-[16.5px] font-semibold transition-colors ${
                                                selectedLessonId === lesson.id 
                                                ? "bg-emerald-50 text-emerald-600" 
                                                : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                                            }`}
                                        >
                                            {lesson.topic}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Description (Rich text editor mock) */}
                <div>
                    <label className="mb-2 block text-[16.5px] font-bold text-[#1f2937]">
                        <span className="text-red-500 mr-1">*</span>Izoh
                    </label>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-[#fafbfe] px-4 py-2">
                            <button className="px-2 py-1 text-[14.5px] font-bold text-gray-600 hover:bg-gray-100 rounded">H1</button>
                            <button className="px-2 py-1 text-[14.5px] font-bold text-gray-600 hover:bg-gray-100 rounded">H2</button>
                            
                            <div className="w-px h-5 bg-gray-200 mx-2"></div>
                            
                            <ToolbarSelect 
                                options={["Sans Serif", "Serif", "Monospace"]}
                                value={fontFamily}
                                onChange={setFontFamily}
                            />
                            
                            <div className="w-px h-5 bg-gray-200 mx-2"></div>
                            
                            <ToolbarSelect 
                                options={["Normal", "Heading"]}
                                value={fontStyle}
                                onChange={setFontStyle}
                            />

                            <div className="w-px h-5 bg-gray-200 mx-1"></div>

                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Bold size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Italic size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Underline size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Strikethrough size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Quote size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Code size={16} strokeWidth={2.5} /></button>
                            
                            <div className="w-px h-5 bg-gray-200 mx-2"></div>

                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><List size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><ListOrdered size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><AlignLeft size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><AlignCenter size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><AlignRight size={16} strokeWidth={2.5} /></button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"><Link2 size={16} strokeWidth={2.5} /></button>
                        </div>
                        {/* Editor Area */}
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-[220px] w-full resize-none p-5 text-[16.5px] font-medium text-[#1f2937] outline-none"
                            placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                        />
                    </div>
                </div>

                {/* File Upload Area */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition cursor-pointer ${
                        selectedFile ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200 bg-[#fafbfe] hover:border-emerald-300 hover:bg-emerald-50/30"
                    }`}
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 shadow-sm">
                        <UploadCloud size={24} strokeWidth={2.5} />
                    </div>
                    <p className={`text-[16.5px] font-bold ${selectedFile ? "text-emerald-600" : "text-gray-400"}`}>
                        {selectedFile ? selectedFile.name : "Fayl yoki video tanlash uchun shu yerni bosing"}
                    </p>
                    <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={(e) => setSelectedFile(e.target.files[0])} 
                    />
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                        onClick={() => navigate(`/dashboard/groups/${id}?tab=lessons`)}
                        className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-[16.5px] font-bold text-gray-600 transition hover:bg-gray-50 shadow-sm"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#10b981] px-8 py-3 text-[16.5px] font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-[#059669] disabled:opacity-70"
                    >
                        {isSubmitting ? "Saqlanmoqda..." : "E'lon qilish"}
                    </button>
                </div>
            </div>
        </div>
    )
}
