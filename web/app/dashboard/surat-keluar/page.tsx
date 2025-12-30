import { db } from '@/lib/db'
import { suratKeluar } from '@/lib/db/schema'
import MailList from '@/components/mail/MailList'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function SuratKeluarPage() {
    const data = await db.select().from(suratKeluar).orderBy(desc(suratKeluar.createdAt))

    const formattedData = data.map(item => ({
        id: item.id,
        type: 'outgoing' as const,
        subject: item.perihal,
        mailNumber: item.nomorSurat,
        date: item.tanggalKirim,
        sender: 'Office Management',
        recipient: item.penerima || 'External',
        attachmentUrl: item.fileUrl,
        description: ''
    }))

    return (
        <div className="space-y-6">
            <MailList initialData={formattedData} type="outgoing" />
        </div>
    )
}
