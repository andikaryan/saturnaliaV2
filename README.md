# Saturnalia URL Shortener

URL shortener yang mudah digunakan dan dibangun dengan Next.js dan Vercel Postgres.

## Fitur

- Buat URL pendek dengan mudah
- Akses dashboard admin untuk mengelola link
- Manajemen domain kustom
- Tampilan responsif yang modern

## Teknologi yang Digunakan

- Next.js App Router
- Tailwind CSS
- Vercel Postgres
- TypeScript
- React Hooks

## Memulai

### Prasyarat

- Node.js 18+ dan npm
- Akun Vercel (untuk database Postgres)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy ke Vercel

Untuk men-deploy aplikasi URL shortener ini ke Vercel, ikuti langkah-langkah berikut:

1. Pastikan Anda memiliki akun Vercel dan telah login
2. Hubungkan repository Git Anda ke Vercel
3. Konfigurasi deployment:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
4. Deploy!

### Menggunakan Database Persisten (disarankan)

Untuk environment production, sebaiknya gunakan database persisten seperti Vercel Postgres atau MongoDB:

1. Buat database baru di Dashboard Vercel
2. Tambahkan environment variable yang diperlukan 
3. Perbarui implementasi `db.ts` dengan koneksi ke database persisten

### Format URL Pendek

URL pendek akan menggunakan format: `https://[your-domain]/s/[short-code]`

- Dalam lingkungan development lokal: `http://localhost:3000/s/[short-code]`
- Setelah di-deploy ke Vercel: `https://your-app.vercel.app/s/[short-code]`
- Dengan domain kustom: `https://your-domain.com/s/[short-code]`

### Mendapatkan Domain Kustom

Untuk meningkatkan profesionalisme layanan URL shortener Anda:

1. Beli domain melalui registrar domain (Namecheap, GoDaddy, dll.)
2. Tambahkan domain ke project Vercel Anda
3. Konfigurasikan DNS record untuk mengarahkan ke server Vercel
