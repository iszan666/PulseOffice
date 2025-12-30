import { db } from '@/lib/db'
import { suratMasuk, suratKeluar } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { type, nomor_surat, perihal, file_url, pengirim, penerima, tanggal_terima, tanggal_kirim } = body

        let data
        if (type === 'masuk') {
            [data] = await db.insert(suratMasuk).values({
                nomorSurat: nomor_surat,
                pengirim,
                perihal,
                tanggalTerima: new Date(tanggal_terima),
                fileUrl: file_url,
                createdById: session.user.id!
            }).returning()
        } else {
            [data] = await db.insert(suratKeluar).values({
                nomorSurat: nomor_surat,
                penerima,
                perihal,
                tanggalKirim: new Date(tanggal_kirim),
                fileUrl: file_url,
                createdById: session.user.id!
            }).returning()
        }

        return NextResponse.json(data)
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') // 'masuk' or 'keluar'

    if (!id || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    try {
        if (type === 'masuk') {
            await db.delete(suratMasuk).where(eq(suratMasuk.id, id))
        } else {
            await db.delete(suratKeluar).where(eq(suratKeluar.id, id))
        }
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
