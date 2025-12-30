-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES ENUM
create type user_role as enum ('admin', 'staff');

-- PROFILES (Linked to Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role user_role default 'staff',
  avatar_url text,
  position text, -- Jabatan
  department text, -- Divisi
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table profiles enable row level security;

-- POLICIES FOR PROFILES
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );
create policy "Admins can update all profiles." on profiles for update using ( 
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) 
);


-- SURAT MASUK
create table surat_masuk (
  id uuid default uuid_generate_v4() primary key,
  nomor_surat text not null,
  pengirim text not null,
  perihal text not null,
  tanggal_terima date not null,
  file_url text, -- Link to PDF in Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references profiles(id)
);

alter table surat_masuk enable row level security;

create policy "Staff and Admin can view surat masuk" on surat_masuk for select using ( true );
create policy "Only Admin/Staff can insert surat masuk" on surat_masuk for insert with check ( auth.role() = 'authenticated' );
create policy "Only Admin can update/delete surat masuk" on surat_masuk for all using ( 
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) 
);

-- SURAT KELUAR
create table surat_keluar (
  id uuid default uuid_generate_v4() primary key,
  nomor_surat text not null,
  penerima text not null,
  perihal text not null,
  tanggal_kirim date not null,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references profiles(id)
);

alter table surat_keluar enable row level security;
-- (Policies similar to Surat Masuk)
create policy "View surat keluar" on surat_keluar for select using (true);
create policy "Insert surat keluar" on surat_keluar for insert with check (auth.role() = 'authenticated');


-- ABSENSI
create table absensi (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  date date default current_date not null,
  check_in time,
  check_out time,
  status text check (status in ('Hadir', 'Izin', 'Sakit', 'Alpha')),
  keterangan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date) -- One entry per user per day
);

alter table absensi enable row level security;

create policy "Users can view their own attendance" on absensi for select using ( auth.uid() = user_id );
create policy "Admins can view all attendance" on absensi for select using ( 
   exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
);
create policy "Users can check in (insert)" on absensi for insert with check ( auth.uid() = user_id );
create policy "Users can check out (update)" on absensi for update using ( auth.uid() = user_id );


-- STORAGE BUCKET POLICIES (Conceptual - must be set in Storage UI)
-- Bucket: 'documents'
-- Policy: Authenticad users can upload. Public read or Authenticated read.

-- DUMMY DATA SEED (For testing after tables created)
-- Note: 'auth.uid()' won't work in seed script directly without creating auth users first.
-- The user will need to create users in Supabase Auth, then we can insert profiles.
