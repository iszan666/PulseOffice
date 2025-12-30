import { db } from '@/lib/db'
import { users, suratMasuk, suratKeluar, absensi } from '@/lib/db/schema'
import { count, eq, and, sql } from 'drizzle-orm'
import {
    Users,
    Mail,
    Clock,
    ArrowUpRight,
    TrendingUp,
    FileText,
    ChevronRight,
    Activity,
    Calendar
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
    const [employeeCount] = await db.select({ value: count() }).from(users)
    const [incomingCount] = await db.select({ value: count() }).from(suratMasuk)
    const [outgoingCount] = await db.select({ value: count() }).from(suratKeluar)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [attendanceToday] = await db.select({ value: count() })
        .from(absensi)
        .where(eq(absensi.date, today))

    return {
        employees: employeeCount.value,
        incoming: incomingCount.value,
        outgoing: outgoingCount.value,
        attendance: attendanceToday.value
    }
}

export default async function DashboardPage() {
    const stats = await getStats()

    const cards = [
        {
            name: 'Total Workforce',
            value: stats.employees,
            icon: Users,
            color: 'bg-indigo-500',
            trend: '+2.5%',
            label: 'active personnel',
            href: '/dashboard/employees'
        },
        {
            name: 'Incoming Mail',
            value: stats.incoming,
            icon: Mail,
            color: 'bg-blue-500',
            trend: '+12',
            label: 'this month',
            href: '/dashboard/surat-masuk'
        },
        {
            name: 'Outgoing Mail',
            value: stats.outgoing,
            icon: FileText,
            color: 'bg-indigo-600',
            trend: 'Stable',
            label: 'tracking enabled',
            href: '/dashboard/surat-keluar'
        },
        {
            name: 'Active Attendance',
            value: stats.attendance,
            icon: Clock,
            color: 'bg-slate-900',
            trend: 'Check-ins',
            label: 'for today',
            href: '/dashboard/absensi'
        },
    ]

    return (
        <div className="space-y-12">
            {/* Dark Mode Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                        Executive <span className="text-indigo-500 italic">Command</span>
                    </h1>
                    <p className="mt-4 text-slate-400 font-bold text-lg flex items-center italic">
                        <Activity className="mr-2 text-indigo-400" size={24} />
                        Intelligence stream operational.
                    </p>
                </div>
                <div className="flex items-center space-x-4 bg-slate-900 px-6 py-4 rounded-[32px] border border-white/5 shadow-2xl">
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                        <Calendar className="text-indigo-400" size={20} />
                    </div>
                    <span className="text-sm font-black text-slate-200 uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* High-Contrast Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        href={card.href}
                        className="group bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-sm hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-700 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-[0.05] rounded-bl-full transition-transform group-hover:scale-125 duration-700`} />

                        <div className="flex justify-between items-start mb-8">
                            <div className={`${card.color} p-4 rounded-2xl text-white shadow-2xl shadow-indigo-500/20 transition-transform group-hover:-rotate-12 duration-500`}>
                                <card.icon size={26} />
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">
                                    {card.trend}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">Delta Matrix</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{card.value}</h3>
                            <p className="text-[13px] font-black text-slate-400 uppercase tracking-wider">{card.name}</p>
                            <p className="text-[10px] font-bold text-indigo-500/60 mt-4 flex items-center uppercase tracking-widest">
                                <TrendingUp size={12} className="mr-1.5" />
                                {card.label}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Dark Mode Secondary Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-indigo-600 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
                    <div className="absolute top-[-30%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center px-4 py-1 bg-white/10 rounded-full border border-white/20 mb-6 font-black text-[10px] uppercase tracking-widest">
                            System Version 2.5
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-6 leading-tight max-w-md">Master Your Digital Ecosystem</h2>
                        <p className="text-indigo-50/80 text-lg font-medium max-w-xl leading-relaxed mb-10 italic">
                            Redefined management with intelligence-driven tracking and seamless correspondence integration. Your professional workflow, perfected.
                        </p>
                        <Link
                            href="/dashboard/employees"
                            className="inline-flex items-center px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            Orchestrate Team
                            <ArrowUpRight className="ml-2" size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[48px] p-10 border border-white/5 shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-widest">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse" />
                            Direct Access
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Dispatch Mail', href: '/dashboard/surat-masuk', color: 'bg-white/5 text-slate-300 border-white/5' },
                                { name: 'Identity Portal', href: '/dashboard/absensi', color: 'bg-white/5 text-slate-300 border-white/5' },
                                { name: 'Core Directory', href: '/dashboard/employees', color: 'bg-white/5 text-slate-300 border-white/5' }
                            ].map((action) => (
                                <Link
                                    key={action.name}
                                    href={action.href}
                                    className={`flex items-center justify-between p-5 ${action.color} border rounded-[24px] font-black text-xs uppercase tracking-widest hover:border-indigo-500/40 hover:bg-white/10 transition-all group`}
                                >
                                    {action.name}
                                    <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="pt-8 mt-8 relative z-10">
                        <p className="text-[10px] font-black text-slate-600 leading-relaxed uppercase tracking-[0.3em] text-center italic">
                            Encryption Active &bull; Secure Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
