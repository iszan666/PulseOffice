'use client'

import { useState } from 'react'
import {
    Clock,
    MapPin,
    Calendar,
    ArrowRightCircle,
    ArrowLeftCircle,
    CheckCircle2,
    AlertCircle,
    Loader2,
    History,
    Timer
} from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AttendanceRecord {
    id: string
    date: string | Date
    checkIn: string | null
    checkOut: string | null
    status: string
}

export default function AttendanceTracker({ initialToday, initialHistory }: { initialToday: AttendanceRecord | null, initialHistory: AttendanceRecord[] }) {
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(initialToday)
    const [history, setHistory] = useState<AttendanceRecord[]>(initialHistory)
    const [loading, setLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

    // Update time every second
    useState(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(timer)
    })

    const handleAttendance = async (action: 'check_in' | 'check_out') => {
        setLoading(true)
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    status: 'Present',
                    id: todayRecord?.id
                })
            })

            const data = await res.json()
            if (res.ok) {
                setTodayRecord(data)
                if (action === 'check_in') {
                    setHistory([data, ...history.slice(0, 4)])
                } else {
                    setHistory(history.map(h => h.id === data.id ? data : h))
                }
            }
        } catch (err) {
            console.error('Attendance error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Main Console */}
            <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden shadow-indigo-500/10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left: Time & Status */}
                    <div className="bg-slate-950/50 p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/5">
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-8">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Live Portal</span>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">{currentTime}</h1>
                            <p className="text-slate-400 font-bold flex items-center tracking-tight">
                                <Calendar size={18} className="mr-2 text-indigo-400" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        <div className="mt-12 space-y-4 relative z-10">
                            <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-md">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Daily Status</p>
                                <div className="flex items-center space-x-4">
                                    {todayRecord ? (
                                        <div className="h-12 w-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/30">
                                            <Clock size={24} />
                                        </div>
                                    )}
                                    <span className="text-2xl font-black tracking-tight text-white/90">
                                        {todayRecord ? (todayRecord.checkOut ? 'Shift Completed' : 'Session Active') : 'Standby Mode'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="p-10 flex flex-col justify-center bg-slate-900/30 backdrop-blur-xl">
                        <div className="space-y-8">
                            {!todayRecord ? (
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 rounded-[28px] border border-white/5 italic text-slate-400 text-sm leading-relaxed text-center">
                                        Welcome to your workspace. Please initialize your shift by performing a secure check-in.
                                    </div>
                                    <Button
                                        onClick={() => handleAttendance('check_in')}
                                        disabled={loading}
                                        className="w-full h-20 rounded-[28px] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] group border-t border-white/20"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <span className="flex items-center justify-center text-lg font-black tracking-tight uppercase">
                                                Initialize Check-In
                                                <ArrowRightCircle className="ml-3 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            ) : !todayRecord.checkOut ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-[28px] text-center">
                                            <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-2">Check-in</p>
                                            <p className="text-xl font-black text-white">{todayRecord.checkIn}</p>
                                        </div>
                                        <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] text-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Check-out</p>
                                            <p className="text-xl font-black text-slate-600 tracking-widest">--:--</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleAttendance('check_out')}
                                        disabled={loading}
                                        className="w-full h-20 rounded-[28px] bg-white/10 hover:bg-white/15 text-white shadow-xl transition-all active:scale-[0.98] group border border-white/10 backdrop-blur-lg"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <span className="flex items-center justify-center text-lg font-black tracking-tight uppercase">
                                                Complete Check-Out
                                                <ArrowLeftCircle className="ml-3 group-hover:-translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 py-4">
                                    <div className="h-24 w-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                        <CheckCircle2 size={48} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tight">Shift Finalized</h3>
                                        <p className="text-slate-400 font-medium mt-2">Your work hours have been successfully recorded.</p>
                                    </div>
                                    <div className="inline-flex items-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-sm font-bold text-indigo-300">
                                        <Timer size={18} className="mr-2 text-indigo-400" />
                                        Logged: {todayRecord.checkIn} — {todayRecord.checkOut}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-6">
                    <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
                        <History className="mr-3 text-indigo-400" size={24} />
                        Recent Logs
                    </h2>
                    <Button variant="ghost" className="text-indigo-400 font-bold hover:bg-white/5 px-6 rounded-2xl">
                        View Full History
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((record) => (
                        <div key={record.id} className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-sm p-8 rounded-[32px] border border-white/10 transition-all group shadow-lg shadow-black/5 hover:border-indigo-500/30">
                            <div className="flex justify-between items-start mb-6">
                                <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-indigo-300 uppercase tracking-[0.15em] leading-none">
                                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${record.status === 'Present' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">In</p>
                                    <p className="text-lg font-black text-white tracking-tight">{record.checkIn || '--:--'}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-white/5"></div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Out</p>
                                    <p className="text-lg font-black text-white tracking-tight">{record.checkOut || '--:--'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] backdrop-blur-sm">
                            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Clock className="text-slate-600" size={32} />
                            </div>
                            <p className="text-slate-500 font-bold italic text-lg">No records available yet.</p>
                            <p className="text-slate-600 text-sm mt-1">Your attendance activity will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
