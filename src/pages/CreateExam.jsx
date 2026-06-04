import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, Info, Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, Quote, Code, Heading1, Heading2, UploadCloud, Paperclip } from "lucide-react"
import { CircularProgress, Alert } from "@mui/material"
import api from "../api"

export default function CreateExam() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [topic, setTopic] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [deadlineDate, setDeadlineDate] = useState("")
    const [deadlineTime, setDeadlineTime] = useState("")
    
    const [loading, setLoading] = useState(false)
    const [topics, setTopics] = useState([])
    const [topicsLoading, setTopicsLoading] = useState(false)
    const [error, setError] = useState("")

    const editorRef = useRef(null)

    useEffect(() => {
        async function loadLessons() {
            setTopicsLoading(true)
            setTimeout(() => {
                setTopics([
                    { id: 1, topic: "1-dars: Kirish" },
                    { id: 2, topic: "2-dars: Asoslar" },
                    { id: 3, topic: "3-dars: Amaliyot" },
                    { id: 4, topic: "4-dars: Takrorlash" },
                    { id: 5, topic: "5-dars: Imtihon" }
                ])
                setTopicsLoading(false)
            }, 600)
        }
        if (id) loadLessons()
    }, [id])

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            setDescription(editorRef.current.innerHTML)
        }
    }

    const handleEditorInput = () => {
        if (editorRef.current) {
            setDescription(editorRef.current.innerHTML)
        }
    }

    const handleLink = () => {
        const url = prompt("Link manzilini kiriting:")
        if (url) execCmd("createLink", url)
    }

    const createExam = async () => {
        const cleanDesc = description.replace(/<[^>]*>/g, "").trim()
        if (!topic || !cleanDesc || !deadlineDate || !deadlineTime) {
            setError("Iltimos, barcha majburiy maydonlarni to'ldiring!")
            return
        }

        setLoading(true)
        setError("")
        
        // Mocking the API post request
        setTimeout(() => {
            setLoading(false)
            navigate(`/dashboard/groups/${id}?tab=lessons`)
        }, 800)
    }

    const toolbarBtnClass = "h-8 min-w-[32px] px-2 inline-flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold"

    return (
        <div className="max-w-3xl px-4 py-8">
            <button
                onClick={() => navigate(`/dashboard/groups/${id}`)}
                className="mb-6 flex items-center gap-2 text-[20px] font-extrabold text-[#1f2937] hover:text-gray-600 transition"
            >
                <ChevronLeft size={20} />
                Imtihon yaratish
            </button>

            {error && <Alert severity="error" className="mb-6 rounded-xl">{error}</Alert>}

            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[14px] text-blue-800 font-medium leading-relaxed">
                    Oxirgi 7 kundagi uyga vazifa berilmagan mavzularni tanlay olasiz!
                </p>
            </div>

            <div className="space-y-6">
                {/* Mavzu */}
                <div>
                    <label className="block text-[14px] font-bold text-[#1f2937] mb-2">
                        <span className="text-red-500 mr-1">*</span>Mavzu
                    </label>
                    <div className="relative">
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={loading || topicsLoading}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-[14.5px] text-gray-700 focus:border-[#10b981] focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 transition-all cursor-pointer disabled:bg-gray-50"
                        >
                            <option value="">Mavzulardan birini tanlang</option>
                            {topics.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.topic || t.title || `Mavzu ${t.id}`}
                                </option>
                            ))}
                        </select>
                        {topicsLoading ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <CircularProgress size={18} sx={{ color: "#10b981" }} />
                            </div>
                        ) : (
                            <ChevronLeft size={18} className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                        )}
                    </div>
                </div>

                {/* Izoh (Rich Text Editor) */}
                <div>
                    <label className="block text-[14px] font-bold text-[#1f2937] mb-2">
                        <span className="text-red-500 mr-1">*</span>Izoh
                    </label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-[#10b981] focus-within:ring-4 focus-within:ring-[#10b981]/10 transition-all">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                            <button type="button" onClick={() => execCmd("formatBlock", "H1")} className={toolbarBtnClass}><Heading1 size={16} /></button>
                            <button type="button" onClick={() => execCmd("formatBlock", "H2")} className={toolbarBtnClass}><Heading2 size={16} /></button>
                            
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>

                            <button type="button" onClick={() => execCmd("bold")} className={toolbarBtnClass}><Bold size={16} /></button>
                            <button type="button" onClick={() => execCmd("italic")} className={toolbarBtnClass}><Italic size={16} /></button>
                            <button type="button" onClick={() => execCmd("underline")} className={toolbarBtnClass}><Underline size={16} /></button>
                            <button type="button" onClick={() => execCmd("strikeThrough")} className={toolbarBtnClass}><Strikethrough size={16} /></button>
                            
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>

                            <button type="button" onClick={() => execCmd("formatBlock", "blockquote")} className={toolbarBtnClass}><Quote size={16} /></button>
                            <button type="button" onClick={() => execCmd("formatBlock", "pre")} className={toolbarBtnClass}><Code size={16} /></button>
                            
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>

                            <button type="button" onClick={() => execCmd("insertUnorderedList")} className={toolbarBtnClass}><List size={16} /></button>
                            <button type="button" onClick={() => execCmd("insertOrderedList")} className={toolbarBtnClass}><ListOrdered size={16} /></button>

                            <div className="w-px h-5 bg-gray-300 mx-1"></div>

                            <button type="button" onClick={handleLink} className={toolbarBtnClass}><Link size={16} /></button>
                        </div>
                        {/* Editor Area */}
                        <div
                            ref={editorRef}
                            className="p-4 min-h-[180px] max-h-[400px] overflow-y-auto text-[14.5px] text-gray-700 leading-relaxed outline-none focus:outline-none"
                            contentEditable
                            onInput={handleEditorInput}
                            placeholder="Imtihon haqida qo'shimcha ma'lumot kiriting..."
                        />
                    </div>
                </div>

                {/* Fayl yuklash */}
                <div>
                    <input
                        type="file"
                        id="exam-file-upload"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.length > 0) {
                                setFile(e.target.files[0])
                            }
                        }}
                    />
                    <label 
                        htmlFor="exam-file-upload"
                        className="flex flex-col items-center justify-center w-full py-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                        <p className="text-[14.5px] font-medium text-gray-500">
                            Yuklash
                        </p>
                        {file && (
                            <div className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-emerald-100 text-emerald-600 font-bold text-[13.5px]">
                                <Paperclip size={16} />
                                {file.name}
                            </div>
                        )}
                    </label>
                </div>

                {/* Sana va Vaqt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[14px] font-bold text-[#1f2937] mb-2">
                            <span className="text-red-500 mr-1">*</span>Tugash sanasi
                        </label>
                        <input
                            type="date"
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            disabled={loading}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14.5px] text-gray-700 focus:border-[#10b981] focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 transition-all disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-bold text-[#1f2937] mb-2">
                            <span className="text-red-500 mr-1">*</span>Tugash vaqti
                        </label>
                        <input
                            type="time"
                            value={deadlineTime}
                            onChange={(e) => setDeadlineTime(e.target.value)}
                            disabled={loading}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14.5px] text-gray-700 focus:border-[#10b981] focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 transition-all disabled:bg-gray-50"
                        />
                    </div>
                </div>

                {/* Tugmalar */}
                <div className="flex items-center justify-end gap-4 pt-6">
                    <button
                        onClick={() => navigate(`/dashboard/groups/${id}`)}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl font-bold bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] transition disabled:opacity-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={createExam}
                        disabled={loading || !topic || !deadlineDate || !deadlineTime}
                        className="px-8 py-2.5 rounded-xl font-bold bg-[#3b82f6] text-white hover:bg-[#2563eb] transition disabled:bg-[#cbd5e1] disabled:text-white disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <CircularProgress size={16} sx={{ color: "white" }} />}
                        {loading ? "E'lon qilinmoqda..." : "E'lon qilish"}
                    </button>
                </div>
            </div>
        </div>
    )
}
