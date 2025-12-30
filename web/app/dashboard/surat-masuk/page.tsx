import { db } from '@/lib/db'
import { suratMasuk } from '@/lib/db/schema'
import MailList from '@/components/mail/MailList'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function SuratMasukPage() {
    const data = await db.select().from(suratMasuk).orderBy(desc(suratMasuk.createdAt))

    const formattedData = data.map(item => ({
        id: item.id,
        type: 'incoming' as const,
        subject: item.perihal,
        mailNumber: item.nomorSurat,
        date: item.tanggalTerima,
        sender: item.pengirim || 'Internal',
        recipient: 'Office Management',
        attachmentUrl: item.fileUrl,
        description: ''
    }))

    return (
        <div className="space-y-6">
            <MailList initialData={formattedData} type="incoming" />
        </div>
    )
}
