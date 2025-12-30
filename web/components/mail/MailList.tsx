'use client'

import { useState } from 'react'
import {
    Plus,
    Search,
    FileText,
    Calendar,
    User,
    Tag,
    Upload,
    Trash2,
    ExternalLink,
    Filter,
    Loader2,
    Mail,
    ChevronRight,
    Paperclip
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
import { Textarea } from "@/components/ui/textarea"

interface MailRecord {
    id: string
    type: 'incoming' | 'outgoing'
    subject: string
    mailNumber: string
    date: string | Date
    sender: string
    recipient: string
    attachmentUrl?: string | null
    description?: string | null
}

export default function MailList({ initialData, type }: { initialData: MailRecord[], type: 'incoming' | 'outgoing' }) {
    const [mails, setMails] = useState<MailRecord[]>(initialData)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        mailNumber: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        sender: type === 'incoming' ? '' : 'Office Management',
        recipient: type === 'outgoing' ? '' : 'Office Management',
        description: '',
        attachmentUrl: ''
    })

    const filteredMails = mails.filter(mail =>
        mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.mailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (res.ok) {
                setFormData(prev => ({ ...prev, attachmentUrl: data.url }))
            }
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setUploading(false)
        }
    }

    const handleAddMail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to record mail')

            setMails([data, ...mails])
            setIsAddModalOpen(false)
            setFormData({
                mailNumber: '',
                subject: '',
                date: new Date().toISOString().split('T')[0],
                sender: type === 'incoming' ? '' : 'Office Management',
                recipient: type === 'outgoing' ? '' : 'Office Management',
                description: '',
                attachmentUrl: ''
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return

        try {
            const res = await fetch(`/api/mail?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setMails(mails.filter(m => m.id !== id))
            }
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {type === 'incoming' ? 'Incoming Correspondence' : 'Outgoing Correspondence'}
                    </h1>
                    <p className="text-slate-400 font-medium text-base mt-2">
                        Track and manage your official {type === 'incoming' ? 'incoming' : 'outgoing'} mail records with precision.
                    </p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 px-8 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] whitespace-nowrap border-t border-white/20">
                            <Plus className="mr-2 h-5 w-5" /> Record New Mail
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] rounded-[32px] border border-white/10 shadow-2xl p-0 overflow-hidden bg-slate-950/90 backdrop-blur-2xl">
                        <div className="bg-slate-900 p-10 border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                            <DialogTitle className="text-3xl font-black text-white relative z-10">Record {type === 'incoming' ? 'Incoming' : 'Outgoing'} Mail</DialogTitle>
                            <p className="text-slate-400 text-sm mt-2 relative z-10">Enter formal mail details and attach digital copies for archival.</p>
                        </div>
                        <form onSubmit={handleAddMail} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            {error && (
                                <div className="bg-red-500/10 text-red-400 p-5 rounded-2xl text-sm font-bold border border-red-500/20 italic">
                                    Error: {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Mail Number</Label>
                                    <Input
                                        className="rounded-2xl bg-white/5 border-white/10 h-14 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                        placeholder="REF/2025/001"
                                        required
                                        value={formData.mailNumber}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, mailNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Registration Date</Label>
                                    <Input
                                        type="date"
                                        className="rounded-2xl bg-white/5 border-white/10 h-14 focus:ring-indigo-500/20 focus:border-indigo-500 text-white invert-calendar"
                                        required
                                        value={formData.date as string}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Mail Subject</Label>
                                    <Input
                                        className="rounded-2xl bg-white/5 border-white/10 h-14 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                        placeholder="Formal subject of the correspondence"
                                        required
                                        value={formData.subject}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Sender</Label>
                                    <Input
                                        className="rounded-2xl bg-white/5 border-white/10 h-14 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                        placeholder={type === 'incoming' ? "External organization" : "Internal department"}
                                        required
                                        value={formData.sender}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sender: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Recipient</Label>
                                    <Input
                                        className="rounded-2xl bg-white/5 border-white/10 h-14 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                        placeholder={type === 'outgoing' ? "External target" : "Internal department"}
                                        required
                                        value={formData.recipient}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, recipient: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Digital Attachment</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label
                                                htmlFor="file-upload"
                                                className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed rounded-[20px] cursor-pointer transition-all ${formData.attachmentUrl ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' : 'border-white/10 hover:border-indigo-400 bg-white/5 text-slate-400'
                                                    }`}
                                            >
                                                {uploading ? <Loader2 className="animate-spin mr-3" /> : <Upload className="mr-3 h-5 w-5" />}
                                                <span className="text-sm font-bold">
                                                    {formData.attachmentUrl ? 'Document Attached successfully' : 'Click to upload PDF/Image'}
                                                </span>
                                            </Label>
                                            <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                                        </div>
                                        {formData.attachmentUrl && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:bg-red-500/10 h-14 w-14 rounded-2xl"
                                                onClick={() => setFormData(prev => ({ ...prev, attachmentUrl: '' }))}
                                            >
                                                <Trash2 size={24} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-slate-300 font-bold ml-1 text-xs uppercase tracking-widest">Remarks / Description</Label>
                                    <Textarea
                                        className="rounded-2xl bg-white/5 border-white/10 min-h-[120px] focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                        placeholder="Add any additional context..."
                                        value={formData.description || ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-6 border-t border-white/5 gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-2xl font-bold h-14 px-8 text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    Discard Changes
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 px-12 shadow-lg shadow-indigo-600/20 border-t border-white/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Content Display Controls */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group flex-1 max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by subject or mail number..."
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="rounded-xl h-11 px-4 text-slate-400 hover:text-white border border-white/5 hover:bg-white/5">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* Table for Desktop */}
            <div className="hidden lg:block bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Correspondence Details</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Path</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Digital Copy</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredMails.map((mail) => (
                            <tr key={mail.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-7">
                                    <div className="space-y-1">
                                        <p className="text-base font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{mail.subject}</p>
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{mail.mailNumber}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-300 text-sm">{type === 'incoming' ? mail.sender : mail.recipient}</span>
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mt-0.5">Verified Entity</span>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex items-center text-sm font-bold text-slate-400">
                                        <Calendar size={16} className="mr-2.5 text-indigo-500/70" />
                                        {new Date(mail.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    {mail.attachmentUrl ? (
                                        <a
                                            href={mail.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 hover:bg-indigo-500/20 transition-all shadow-sm"
                                        >
                                            <Paperclip size={14} className="mr-2" /> View Document
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest pl-2">Unattached</span>
                                    )}
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <button
                                        onClick={() => handleDelete(mail.id)}
                                        className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card view for Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                {filteredMails.map((mail) => (
                    <div key={mail.id} className="bg-slate-900/40 p-8 rounded-[32px] border border-white/10 shadow-xl space-y-6 group hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <Mail className="text-indigo-400" size={28} />
                            </div>
                            <span className="text-[10px] font-black bg-white/5 text-indigo-300 py-1.5 px-3 rounded-xl border border-white/10 tracking-[0.1em] uppercase">
                                {mail.mailNumber}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{mail.subject}</h3>
                            <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed font-medium">
                                {mail.description || 'No additional remarks provided in the registration.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-5 border-y border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest">{type === 'incoming' ? 'Primary Sender' : 'Target Recipient'}</p>
                                <p className="text-sm font-bold text-slate-300 truncate">{type === 'incoming' ? mail.sender : mail.recipient}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Entry Date</p>
                                <p className="text-sm font-bold text-slate-300">{new Date(mail.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            {mail.attachmentUrl ? (
                                <a
                                    href={mail.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    <Paperclip size={16} className="mr-2" /> Digital Copy
                                </a>
                            ) : <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Missing File</span>}

                            <button
                                onClick={() => handleDelete(mail.id)}
                                className="p-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMails.length === 0 && (
                <div className="bg-white/5 border-2 border-dashed border-white/5 p-24 rounded-[40px] text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Mail className="text-slate-700" size={40} />
                    </div>
                    <p className="text-slate-400 font-bold text-xl">No correspondence records</p>
                    <p className="text-slate-600 font-medium mt-2 max-w-sm mx-auto">Either refine your tactical search or register a new official entry above.</p>
                </div>
            )}
        </div>
    )
}
