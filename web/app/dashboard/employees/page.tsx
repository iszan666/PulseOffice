import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import EmployeeList from '@/components/employees/EmployeeList'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
    const profiles = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        position: users.position,
        department: users.department,
        phone: users.phone,
        image: users.image
    })
        .from(users)
        .orderBy(desc(users.createdAt))

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600">Manage access and details for all staff members.</p>
            </div>

            <EmployeeList initialData={profiles as any} />
        </div>
    )
}
