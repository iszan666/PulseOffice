import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, full_name, role, position, department, phone } = body

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create User in DB
        const [user] = await db.insert(users).values({
            email,
            password: hashedPassword,
            name: full_name,
            role: (role || 'staff') as any,
            position,
            department,
            phone
        }).returning()

        // Exclude password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword })
    } catch (err: any) {
        console.error(err)
        // Drizzle error codes might differ from Prisma. 
        // For local Postgres, unique constraint violation usually throws a generic error or specific PG error.
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    try {
        await db.delete(users).where(eq(users.id, id))
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
