[![Watch the video](https://raw.githubusercontent.com/justin-theodorus/belejar-linkedin-demo/thumbnail.png)](https://raw.githubusercontent.com/justin-theodorus/belejar-linkedin-demo/video demo.mov)

# Belajar LinkedIn Demo - Justin Stevenson Theodorus

Aplikasi web untuk mengelola kelas online, pengguna, dan pendaftaran (enrollments). Aplikasi ini dibuat untuk menyelesaikan Case Assessment Backend Engineer. Semua test API bisa dilakukan melalui web browser untuk mempermudah pengecekkan. Dibuatdengan Next.js 15, React 19, TypeScript, dan Supabase.

## 🚀 Features

* **Register & Log In Pengguna**: Sistem registrasi dan login
* **Manajemen Kelas**: Membuat, membaca, memperbarui, dan menghapus kelas
* **Sistem Pendaftaran**: Pengguna dapat mendaftar ke kelas yang tersedia
* **REST API**: Endpoint API lengkap untuk semua operasi
* **UI Interaktif**: Antarmuka modern, responsif, menggunakan Shadcn/ui
* **Dashboard Testing API**: Antarmuka bawaan untuk menguji semua endpoint

## 🛠️ Tech Stack

* **Frontend**: Next.js 15, React 19, TypeScript
* **UI Components**: Shadcn/ui, Tailwind CSS
* **Backend**: Next.js API Routes
* **Database**: Supabase (PostgreSQL)
* **State Management**: Custom React hooks

## 📋 Requirements

* Node.js 18+
* npm, yarn, pnpm, atau bun
* Akun Supabase (tersedia gratis)

## Instruksi Setup

### 1. Clone dan Install Dependensi

```bash
# Clone repository
git clone <repository-url>
cd belajar-linkedin-class

# Install dependencies
npm install
```

### 2. Setup Database (Supabase)

#### Membuat Proyek Supabase

1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login atau buat akun baru
3. Klik **New Project**
4. Pilih organisasi dan isi:
   * Nama proyek (contoh: `belajar-linkedin-class`)
   * Password database
5. Tunggu hingga proyek selesai dibuat (±1–2 menit)

#### Membuat Tabel Database

1. Di dashboard Supabase, buka **SQL Editor**
2. Salin isi dari `schema.sql` ke editor
3. Klik **Run** untuk membuat tabel

Skema mencakup tiga tabel utama:

* **Users**: Menyimpan informasi akun pengguna
* **Classes**: Menyimpan detail kelas dan referensi instruktur
* **Enrollments**: Melacak pendaftaran pengguna ke kelas

### 3. Konfigurasi Environment Variables

1. Salin file environment contoh:

   ```bash
   cp .env.local.example .env.local
   ```

2. Di dashboard Supabase, buka **Settings → API**

3. Salin nilai berikut ke file `.env.local`:

   * **Project URL**: dari bagian "Project URL"
   * **Anon key**: dari bagian "Project API keys"

Contoh `.env.local`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🎯 Cara Menggunakan Aplikasi

### Untuk Pengguna

#### 1. Registrasi Akun

* Buka halaman utama aplikasi
* Klik "Register" atau buka form registrasi
* Isi nama, email, dan password
* Submit untuk membuat akun

#### 2. Lihat & Daftar Kelas

* Lihat daftar kelas di homepage
* Klik kelas untuk melihat detail
* Gunakan modal pendaftaran untuk join kelas
* Pantau kelas yang sudah didaftarkan

#### 3. Membuat Kelas (Instruktur)

* Login → buka menu "Create Class"
* Isi judul & deskripsi kelas
* Submit untuk membuat kelas baru

### Untuk Developer / Pengujian API

#### Dashboard Pengujian API

Aplikasi menyediakan antarmuka built-in untuk uji API:

1. Buka bagian "API Test" di aplikasi
2. Gunakan form interaktif untuk mencoba setiap endpoint
3. Lihat response & status code secara real-time
4. Bisa menguji operasi CRUD tanpa tools eksternal

**Contoh Alur Uji API:**

1. **Registrasi User**

   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login**

   ```bash
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Membuat Kelas**

   ```bash
   curl -X POST http://localhost:3000/api/classes \
     -H "Content-Type: application/json" \
     -d '{"title":"React Basics","description":"Belajar React dari nol","instructorId":1}'
   ```

4. **Lihat Semua Kelas**

   ```bash
   curl http://localhost:3000/api/classes
   ```

5. **Enroll ke Kelas**

   ```bash
   curl -X POST http://localhost:3000/api/enroll \
     -H "Content-Type: application/json" \
     -d '{"userId":1,"classId":1}'
   ```

---

## Dokumentasi API

Aplikasi ini menyediakan REST API berikut:

### Manajemen User

* `POST /api/register` – Registrasi user baru
* `POST /api/login` – Autentikasi user

### Manajemen Kelas

* `GET /api/classes` – Ambil semua kelas
* `POST /api/classes` – Buat kelas baru
* `GET /api/classes/[id]` – Ambil detail kelas
* `PUT /api/classes/[id]` – Update kelas
* `DELETE /api/classes/[id]` – Hapus kelas

### Pendaftaran

* `POST /api/enroll` – Daftarkan user ke kelas

---

## Struktur Proyek

```
belajar-linkedin-class/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Komponen React
│   ├── auth/             # Komponen autentikasi
│   ├── classes/          # Komponen manajemen kelas
│   ├── testing/          # Komponen pengujian API
│   └── ui/               # Komponen UI reusable
├── hooks/                # Custom React hooks
├── lib/                  # Utility & koneksi database
├── public/               # Static assets
└── schema.sql            # Skema database
```


