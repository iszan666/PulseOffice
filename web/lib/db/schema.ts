import { pgTable, text, timestamp, uuid, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['staff', 'admin']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    role: roleEnum('role').default('staff').notNull(),
    position: text('position'),
    department: text('department'),
    phone: text('phone'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const suratMasuk = pgTable('surat_masuk', {
    id: uuid('id').primaryKey().defaultRandom(),
    nomorSurat: text('nomor_surat').notNull(),
    pengirim: text('pengirim').notNull(),
    perihal: text('perihal').notNull(),
    tanggalTerima: timestamp('tanggal_terima').notNull(),
    fileUrl: text('file_url'),
    createdById: uuid('created_by_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const suratKeluar = pgTable('surat_keluar', {
    id: uuid('id').primaryKey().defaultRandom(),
    nomorSurat: text('nomor_surat').notNull(),
    penerima: text('penerima').notNull(),
    perihal: text('perihal').notNull(),
    tanggalKirim: timestamp('tanggal_kirim').notNull(),
    fileUrl: text('file_url'),
    createdById: uuid('created_by_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const absensi = pgTable('absensi', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    date: timestamp('date').defaultNow().notNull(),
    checkIn: text('check_in'),
    checkOut: text('check_out'),
    status: text('status').notNull(), // Hadir, Izin, etc.
    keterangan: text('keterangan'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        userDateIdx: uniqueIndex('user_date_idx').on(table.userId, table.date),
    };
});
