'use client'

import { useState } from 'react'
import {
    Plus,
    Search,
    MoreVertical,
    Mail,
    User,
    Phone,
    Briefcase,
    Trash2,
    X,
    Loader2,
    Filter,
    ArrowUpDown,
    CheckCircle2
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

interface Employee {
    id: string
    email: string
    name: string
    role: string
    position?: string
    department?: string
    phone?: string
    image?: string
}

export default function EmployeeList({ initialData }: { initialData: Employee[] }) {
    const [employees, setEmployees] = useState<Employee[]>(initialData)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'staff',
        position: '',
        department: '',
        phone: ''
    })

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to add employee')

            setEmployees([data.user, ...employees])
            setIsAddModalOpen(false)
            setFormData({
                full_name: '',
                email: '',
                password: '',
                role: 'staff',
                position: '',
                department: '',
                phone: ''
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Action Handlers
    const handleDeleteEmployee = async (id: string) => {
        if (!confirm('Are you sure you want to remove this employee? This action cannot be undone.')) return

        try {
            const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setEmployees(employees.filter(emp => emp.id !== id))
            }
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
                        Workforce <span className="text-indigo-500">Intelligence</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-3 italic">
                        Operational Personnel Directory
                    </p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-7 rounded-[24px] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest border-t border-white/20">
                            <Plus className="mr-3" size={20} />
                            Enlist Personnel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950/90 backdrop-blur-3xl border-white/10 rounded-[40px] p-0 overflow-hidden shadow-2xl max-w-xl">
                        <div className="bg-slate-900/50 p-10 border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
                            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter relative z-10">Personnel Enrollment</DialogTitle>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 relative z-10 opacity-80 italic">Initialize tactical identity entry</p>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-10 space-y-8">
                            {error && (
                                <div className="bg-red-500/10 text-red-400 p-5 rounded-2xl text-xs font-bold border border-red-500/20 italic">
                                    REGISTRY ERROR: {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Label</Label>
                                    <Input
                                        required
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 text-white text-sm font-bold focus:ring-indigo-500/20 placeholder:text-slate-700"
                                        placeholder="Full Name"
                                        value={formData.full_name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Communication ID</Label>
                                    <Input
                                        type="email"
                                        required
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 text-white text-sm font-bold focus:ring-indigo-500/20 placeholder:text-slate-700"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Credentials</Label>
                                    <Input
                                        type="password"
                                        required
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 text-white text-sm font-bold focus:ring-indigo-500/20 placeholder:text-slate-700"
                                        placeholder="Secure Password"
                                        value={formData.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Role</Label>
                                    <Input
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 text-white text-sm font-bold focus:ring-indigo-500/20 placeholder:text-slate-700"
                                        placeholder="Position / Title"
                                        value={formData.position}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, position: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Strategic Sector</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(val: string) => setFormData({ ...formData, department: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 text-white text-sm font-bold focus:ring-indigo-500/20">
                                            <SelectValue placeholder="Department" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 rounded-2xl shadow-2xl">
                                            <SelectItem value="Management" className="text-white hover:bg-white/5 font-bold">Management</SelectItem>
                                            <SelectItem value="Operations" className="text-white hover:bg-white/5 font-bold">Operations</SelectItem>
                                            <SelectItem value="Finance" className="text-white hover:bg-white/5 font-bold">Finance</SelectItem>
                                            <SelectItem value="Development" className="text-white hover:bg-white/5 font-bold">Development</SelectItem>
                                            <SelectItem value="Security" className="text-white hover:bg-white/5 font-bold">Security</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="pt-6 border-t border-white/5">
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black h-16 rounded-[20px] shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs border-t border-white/20"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Finalize Registration Entry'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Advanced Search & Controls */}
            <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative group flex-1 max-w-2xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Scan personnel database signatures..."
                        className="w-full bg-white/5 border border-white/10 rounded-[28px] py-6 pl-16 pr-8 text-white placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 transition-all font-bold text-lg"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="rounded-2xl h-14 px-6 text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">
                        <Filter className="mr-2" size={16} /> Filter Results
                    </Button>
                </div>
            </div>

            {/* Personnel Registry Display */}
            <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 uppercase tracking-[0.25em] font-black text-[10px] text-slate-500">
                                <th className="px-10 py-8">Identity Signature</th>
                                <th className="px-10 py-8">Operational Vector</th>
                                <th className="px-10 py-8 text-right">System Matrix</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="group hover:bg-white/[0.02] transition-colors duration-500">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="h-16 w-16 rounded-[24px] bg-slate-900 border border-white/10 flex items-center justify-center font-black text-indigo-400 text-2xl group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:bg-indigo-600/5 transition-all duration-300">
                                                {emp.name ? emp.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-white tracking-tighter uppercase mb-0.5">{emp.name}</p>
                                                <p className="text-xs font-bold text-slate-500 flex items-center tracking-tight">
                                                    <Mail size={14} className="mr-2 text-indigo-500/50" />
                                                    {emp.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {emp.department || 'General Core'}
                                            </span>
                                            <p className="text-sm font-bold text-slate-400 uppercase italic tracking-tighter opacity-80 pl-1">{emp.position || emp.role}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30 border border-white/5 transition-all active:scale-90 hover:shadow-xl">
                                                <MoreVertical size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEmployee(emp.id)}
                                                className="p-4 bg-red-500/5 rounded-2xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-90"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Identity Modules */}
                <div className="md:hidden divide-y divide-white/5">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="p-8 space-y-6 bg-slate-900/30 backdrop-blur-md">
                            <div className="flex items-center space-x-5">
                                <div className="h-16 w-16 rounded-[20px] bg-slate-900 border border-white/5 flex items-center justify-center font-black text-indigo-400 text-xl shadow-lg">
                                    {emp.name ? emp.name[0].toUpperCase() : 'U'}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-white uppercase tracking-tighter">{emp.name}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest italic">
                                        {emp.department || 'Core Unit'}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-60">Stream ID</p>
                                    <p className="text-xs font-bold text-slate-300 truncate tracking-tight">{emp.email}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-60">Designation</p>
                                    <p className="text-xs font-bold text-slate-300 capitalize tracking-tight font-serif">{emp.role}</p>
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-2">
                                <button className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 active:scale-[0.98] transition-all hover:bg-white/10 hover:text-white">Analysis Data</button>
                                <button
                                    onClick={() => handleDeleteEmployee(emp.id)}
                                    className="px-6 bg-red-500/10 text-red-500/40 rounded-2xl border border-red-500/20 active:scale-[0.95] transition-all hover:text-red-400 hover:bg-red-500/20"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-32 bg-slate-900/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center p-8 bg-slate-900 rounded-[40px] mb-8 text-slate-700 border border-white/10 shadow-3xl">
                                <Search size={64} className="opacity-20" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Zero Signature Match</h3>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-3 px-10 max-w-md mx-auto leading-relaxed">The specified personnel matrix does not correlate with any verified identity signatures in the system.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
