# Instruksi Deployment ke Vercel

## Langkah-Langkah Deployment

1. **Persiapan Repository**:
   - Pastikan repository sudah di-push ke GitHub, GitLab, atau BitBucket
   - Pastikan file-file konfigurasi sudah benar (`next.config.ts`, `vercel.json`)

2. **Connect Repository di Vercel**:
   - Login ke [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik "New Project"
   - Pilih repository yang berisi aplikasi Saturnalia
   - Klik "Import"

3. **Konfigurasi Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (jika project berada di root repository)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
   - Klik "Deploy"

4. **Environment Variables** (Optional, untuk database persisten):
   - Di Dashboard Vercel project Anda, buka tab "Settings" > "Environment Variables"
   - Tambahkan variabel yang ada di file `.env.example`, pastikan untuk menggantinya dengan nilai yang sesuai
   - Klik "Save"

5. **Domain Kustom** (Optional):
   - Di Dashboard Vercel project, buka tab "Domains"
   - Tambahkan domain kustom Anda
   - Ikuti instruksi untuk konfigurasi DNS

## Penggunaan Database Persisten

Untuk menggunakan database persisten seperti Vercel Postgres:

1. **Membuat Database**:
   - Di Dashboard Vercel, buka tab "Storage"
   - Klik "Create" dan pilih "Postgres"
   - Ikuti wizard untuk membuat database

2. **Menghubungkan Database**:
   - Tambahkan environment variable `DATABASE_URL` dari database yang baru dibuat
   - Perbarui implementasi database di `src/lib/db.ts` untuk menggunakan koneksi Postgres

## Testing Deployment

Setelah deployment berhasil, tes URL shortener dengan cara:

1. Buka domain Vercel Anda (`your-app.vercel.app`)
2. Buat short URL baru
3. Coba akses short URL tersebut untuk memastikan redirectnya berfungsi

## Pemecahan Masalah

- **Error 404 pada short URL**: Pastikan route handler `/s/[id]` sudah benar
- **Database reset pada setiap deployment**: Ini normal jika menggunakan penyimpanan memori. Gunakan database persisten untuk menyimpan data secara permanen
- **CORS error**: Periksa pengaturan CORS di `next.config.ts`
