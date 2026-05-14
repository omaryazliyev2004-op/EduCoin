import { Shield } from "lucide-react"

export default function Rollar() {
    return (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                <Shield size={32} className="text-violet-500" />
            </div>
            <h3 className="text-[17px] font-bold text-gray-700 mb-2">Rollar bo'limi</h3>
            <p className="text-gray-400 text-[13px] max-w-[280px]">Ushbu bo'lim hozirda ishlab chiqish jarayonida.</p>
        </div>
    )
}
