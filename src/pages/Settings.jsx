import { useSearchParams } from 'react-router-dom'

// Management components
import Kurslar      from '../components/management/Kurslar'
import Xonalar      from '../components/management/Xonalar'
import Filiallar    from '../components/management/Filiallar'
import Xodimlar     from '../components/management/Xodimlar'
import Sabablar     from '../components/management/Sabablar'
import Rollar       from '../components/management/Rollar'
import Coin         from '../components/management/Coin'
import XabarYuborish from '../components/management/XabarYuborish'
import Tekshiruv    from '../components/management/Tekshiruv'

const tabs = [
    { key: "kurslar",   label: "Kurslar" },
    { key: "xonalar",   label: "Xonalar" },
    { key: "filiallar", label: "Filiallar" },
    { key: "xodimlar",  label: "Xodimlar" },
    { key: "sabablar",  label: "Sabablar" },
    { key: "rollar",    label: "Rollar" },
    { key: "coin",      label: "Coin" },
    { key: "xabar",     label: "Xabar yuborish" },
    { key: "tekshiruv", label: "Tekshiruv" },
]

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "kurslar"

    const handleTabChange = (key) => {
        setSearchParams({ tab: key })
    }

    const renderContent = () => {
        switch (activeTab) {
            case "kurslar":   return <Kurslar />
            case "xonalar":   return <Xonalar />
            case "filiallar": return <Filiallar />
            case "xodimlar":  return <Xodimlar />
            case "sabablar":  return <Sabablar />
            case "rollar":    return <Rollar />
            case "coin":      return <Coin />
            case "xabar":     return <XabarYuborish />
            case "tekshiruv": return <Tekshiruv />
            default:          return null
        }
    }

    return (
        <div className="-m-6 min-h-full bg-[#f4f6fb] p-8">
            <h1 className="text-[26px] font-extrabold text-[#1f2d5a] mb-5 tracking-tight">Boshqarish</h1>

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-gray-200 mb-7 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-4 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-all relative
                            ${activeTab === tab.key
                                ? "text-violet-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-violet-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {renderContent()}
        </div>
    )
}
