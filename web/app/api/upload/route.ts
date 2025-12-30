import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder') as string // 'surat-masuk' or 'surat-keluar'

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = Date.now() + '_' + file.name.replaceAll(' ', '_')

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder || 'misc')
        await mkdir(uploadDir, { recursive: true })

        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Return the public URL
        const publicUrl = `/uploads/${folder || 'misc'}/${filename}`

        return NextResponse.json({ url: publicUrl })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
