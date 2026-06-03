import { useState, useEffect } from "react"
import { Bell, Moon, Search, Sun, Calendar, Plus, ChevronDown, Globe } from "lucide-react"
import { IconButton, Badge, Avatar, Menu, MenuItem, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function Header() {
    const [notifAnchorEl, setNotifAnchorEl] = useState(null)
    const [profileAnchorEl, setProfileAnchorEl] = useState(null)
    const [addAnchorEl, setAddAnchorEl] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const [langAnchorEl, setLangAnchorEl] = useState(null)
    const [selectedLang, setSelectedLang] = useState("O'zbekcha")
    
    const [userName, setUserName] = useState("Admin")
    const [userInitial, setUserInitial] = useState("A")

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const base64Url = token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                }).join(''))

                const decoded = JSON.parse(jsonPayload)
                const name = decoded.first_name || decoded.name || decoded.phone || "Admin"
                
                setUserName(name)
                setUserInitial(name.charAt(0).toUpperCase())
            } catch (e) {
                console.error("Tokenni o'qishda xatolik:", e)
            }
        }
    }, [])

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Calendar Button */}
                <IconButton
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        color: "#4b5563",
                        "&:hover": { backgroundColor: "#f9fafb" }
                    }}
                >
                    <Calendar size={17} />
                </IconButton>

                {/* + Qo'shish Button */}
                <div>
                    <Button
                        onClick={(e) => setAddAnchorEl(e.currentTarget)}
                        endIcon={<ChevronDown size={14} />}
                        startIcon={<Plus size={16} />}
                        sx={{
                            textTransform: "none",
                            height: 40,
                            backgroundColor: "#7c3aed",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "800",
                            px: 2.5,
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.2)",
                            "&:hover": {
                                backgroundColor: "#6d28d9",
                                boxShadow: "0 10px 15px -3px rgba(109, 40, 217, 0.3)"
                            }
                        }}
                    >
                        Qo'shish
                    </Button>
                    <Menu
                        anchorEl={addAnchorEl}
                        open={Boolean(addAnchorEl)}
                        onClose={() => setAddAnchorEl(null)}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    borderRadius: "14px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                                    border: "1px solid #f3f4f6",
                                    p: 0.5,
                                    minWidth: 160
                                }
                            }
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                navigate("/dashboard/groups")
                                setAddAnchorEl(null)
                            }}
                            sx={{ borderRadius: "8px", fontSize: "12.5px", fontWeight: 600, py: 1 }}
                        >
                            Guruh qo'shish
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate("/dashboard/students")
                                setAddAnchorEl(null)
                            }}
                            sx={{ borderRadius: "8px", fontSize: "12.5px", fontWeight: 600, py: 1 }}
                        >
                            Talaba qo'shish
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate("/dashboard/teachers")
                                setAddAnchorEl(null)
                            }}
                            sx={{ borderRadius: "8px", fontSize: "12.5px", fontWeight: 600, py: 1 }}
                        >
                            O'qituvchi qo'shish
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate("/dashboard/settings?tab=kurslar")
                                setAddAnchorEl(null)
                            }}
                            sx={{ borderRadius: "8px", fontSize: "12.5px", fontWeight: 600, py: 1 }}
                        >
                            Kurs qo'shish
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate("/dashboard/settings?tab=xonalar")
                                setAddAnchorEl(null)
                            }}
                            sx={{ borderRadius: "8px", fontSize: "12.5px", fontWeight: 600, py: 1 }}
                        >
                            Xona qo'shish
                        </MenuItem>
                    </Menu>
                </div>

                {/* Qidirish Input */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 w-60 h-10 shadow-sm focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50 transition">
                    <Search size={14} className="text-gray-400" />
                    <input className="text-[14.5px] w-full outline-none text-black placeholder-gray-400 font-medium" placeholder="Qidirish..." />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Button
                        onClick={(e) => setLangAnchorEl(e.currentTarget)}
                        endIcon={<ChevronDown size={14} className="text-gray-400" />}
                        startIcon={<Globe size={16} className="text-gray-500" />}
                        sx={{
                            textTransform: "none",
                            height: 36,
                            backgroundColor: "#f9fafb",
                            color: "#4b5563",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "600",
                            px: 1.5,
                            border: "1px solid #e5e7eb",
                            "&:hover": {
                                backgroundColor: "#f3f4f6"
                            }
                        }}
                    >
                        {selectedLang}
                    </Button>
                    <Menu
                        anchorEl={langAnchorEl}
                        open={Boolean(langAnchorEl)}
                        onClose={() => setLangAnchorEl(null)}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    borderRadius: "14px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                                    border: "1px solid #f3f4f6",
                                    p: 0.5,
                                    minWidth: 140
                                }
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {["O'zbekcha", "Ruscha", "English"].map((lang) => (
                            <MenuItem
                                key={lang}
                                onClick={() => {
                                    setSelectedLang(lang)
                                    setLangAnchorEl(null)
                                }}
                                sx={{
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: selectedLang === lang ? 700 : 500,
                                    color: selectedLang === lang ? "#7c3aed" : "#4b5563",
                                    backgroundColor: selectedLang === lang ? "#f5f3ff" : "transparent",
                                    py: 1,
                                    "&:hover": {
                                        backgroundColor: selectedLang === lang ? "#ede9fe" : "#f3f4f6"
                                    }
                                }}
                            >
                                {lang}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>

                <div className="relative">
                    <IconButton
                        onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "12px",
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            color: "#6b7280",
                            "&:hover": { backgroundColor: "#f3f4f6" }
                        }}
                    >
                        <Badge variant="dot" color="error" overlap="circular">
                            <Bell size={16} />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={notifAnchorEl}
                        open={Boolean(notifAnchorEl)}
                        onClose={() => setNotifAnchorEl(null)}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1.5,
                                    borderRadius: "18px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                                    border: "1px solid #f3f4f6",
                                    p: 2,
                                    width: 256
                                }
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <p className="text-[14.5px] font-bold text-gray-800">Bildirishnomalar</p>
                        <p className="mt-2 text-[13.5px] text-gray-400">Hozircha yangi xabar yo'q.</p>
                    </Menu>
                </div>

                <IconButton
                    onClick={() => setDarkMode(!darkMode)}
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#0f172a" : "#f9fafb",
                        border: "1px solid",
                        borderColor: darkMode ? "#0f172a" : "#e5e7eb",
                        color: darkMode ? "#ffffff" : "#6b7280",
                        transition: "all 0.2s",
                        "&:hover": { backgroundColor: darkMode ? "#1e293b" : "#f3f4f6" }
                    }}
                >
                    {darkMode ? (
                        <Sun size={16} className="text-white" />
                    ) : (
                        <Moon size={16} className="text-gray-500" />
                    )}
                </IconButton>

                <div className="relative">
                    <IconButton
                        onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                        sx={{ p: 0 }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                fontSize: "13px",
                                fontSpread: "normal",
                                fontWeight: "bold",
                                backgroundColor: "#7c3aed",
                                borderRadius: "12px",
                                cursor: "pointer"
                            }}
                        >
                            {userInitial}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={profileAnchorEl}
                        open={Boolean(profileAnchorEl)}
                        onClose={() => setProfileAnchorEl(null)}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1.5,
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                                    border: "1px solid #f3f4f6",
                                    p: 0.5,
                                    minWidth: 160
                                }
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <div className="px-3 py-2 text-[14.5px] font-bold text-gray-800 border-b border-gray-50 mb-1">
                            {userName}
                        </div>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchorEl(null)
                                localStorage.removeItem("token")
                                window.location.href = "/"
                            }}
                            sx={{
                                borderRadius: "10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#ef4444",
                                "&:hover": {
                                    backgroundColor: "#fef2f2"
                                }
                            }}
                        >
                            Chiqish
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    )
}
