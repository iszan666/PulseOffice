import { db } from '@/lib/db'
import { absensi } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { auth } from '@/auth'
import AttendanceTracker from '@/components/attendance/AttendanceTracker'

export const dynamic = 'force-dynamic'

export default async function AbsensiPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let todayRecord = null
    let history: any[] = []

    try {
        [todayRecord] = await db.select()
            .from(absensi)
            .where(
                and(
                    eq(absensi.userId, session.user.id),
                    eq(absensi.date, today)
                )
            )
            .limit(1)

        history = await db.select()
            .from(absensi)
            .where(eq(absensi.userId, session.user.id))
            .orderBy(desc(absensi.date))
            .limit(30)
    } catch (error) {
        console.error('Error fetching attendance:', error)
    }

    // Normalize for component
    const formattedToday = todayRecord ? {
        ...todayRecord,
        status: todayRecord.status || 'Present'
    } : null

    const formattedHistory = history.map(h => ({
        ...h,
        status: h.status || 'Present'
    }))

    return (
        <div className="space-y-6">
            <AttendanceTracker initialToday={formattedToday} initialHistory={formattedHistory} />
        </div>
    )
}
