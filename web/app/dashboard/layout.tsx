'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Users,
    Mail,
    Clock,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    FileText,
    ChevronRight,
    Bell,
    Search,
    Building2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Employees', href: '/dashboard/employees', icon: Users },
        { name: 'Incoming Mail', href: '/dashboard/surat-masuk', icon: Mail },
        { name: 'Outgoing Mail', href: '/dashboard/surat-keluar', icon: FileText },
        { name: 'Attendance', href: '/dashboard/absensi', icon: Clock },
    ]

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            {/* Dark Mode Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                sidebarOpen ? "translate-x-0 shadow-2xl shadow-indigo-500/10" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center space-x-3 px-2 mb-10">
                        <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Building2 className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter italic">Pulse<span className="text-indigo-500 opacity-80">Office</span></span>
                    </div>

                    <nav className="flex-1 space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={clsx(
                                        "flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-[13px] font-black transition-all group relative overflow-hidden uppercase tracking-widest",
                                        isActive
                                            ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/10"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon size={18} className={clsx(isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
                                    <span className="relative z-10">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white/20 rounded-l-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                        <div className="px-4 py-4 rounded-2xl bg-slate-800/50 border border-white/5 group hover:border-indigo-500/20 transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                                    {user?.name?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="truncate flex-1">
                                    <p className="text-xs font-black text-white truncate leading-none mb-1 uppercase tracking-tighter">
                                        {user?.name || 'Administrator'}
                                    </p>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Online
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Scroll-aware Deep Dark Header */}
                <header className="sticky top-0 z-30 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 bg-slate-900 rounded-xl border border-white/5 text-slate-400 lg:hidden hover:text-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden lg:flex relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Universal Search..."
                                className="bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-bold text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="p-2.5 bg-slate-900 rounded-xl border border-white/5 text-slate-400 hover:text-indigo-400 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900 animate-bounce" />
                        </button>
                        <div className="h-8 w-px bg-white/5 mx-2" />
                        <div className="flex items-center space-x-3 group cursor-pointer px-1 py-1 rounded-xl transition-all">
                            <div className="h-9 w-9 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400 border border-white/5 transition-all group-hover:bg-slate-700">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {children}
                    </div>
                    {/* Bottom Decorative Element */}
                    <div className="fixed bottom-[-10%] left-[50%] -translate-x-1/2 w-[80%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
                </main>
            </div>
        </div>
    )
}
