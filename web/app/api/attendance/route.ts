import { db } from '@/lib/db'
import { absensi } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { action, status, id } = body
        const timeString = new Date().toLocaleTimeString('en-US', { hour12: false })

        if (action === 'check_in') {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const [data] = await db.insert(absensi).values({
                userId: session.user.id,
                status: status || 'Hadir',
                checkIn: timeString,
                date: today
            }).returning()
            return NextResponse.json(data)
        } else if (action === 'check_out') {
            const [data] = await db.update(absensi)
                .set({ checkOut: timeString })
                .where(eq(absensi.id, id))
                .returning()
            return NextResponse.json(data)
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
        if (err.code === '23505') return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
