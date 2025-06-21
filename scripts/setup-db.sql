-- Untuk dijalankan di database Postgres Vercel

-- Drop tables jika sudah ada (hati-hati dengan ini di production)
DROP TABLE IF EXISTS shortlinks;
DROP TABLE IF EXISTS domains;

-- Membuat tabel domains
CREATE TABLE domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel shortlinks
CREATE TABLE shortlinks (
  id SERIAL PRIMARY KEY,
  shortlink VARCHAR(50) NOT NULL UNIQUE,
  longlink TEXT NOT NULL,
  domain_id INTEGER REFERENCES domains(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER DEFAULT 0
);

-- Menambahkan indeks untuk pencarian cepat
CREATE INDEX idx_shortlinks_shortlink ON shortlinks(shortlink);
CREATE INDEX idx_shortlinks_domain_id ON shortlinks(domain_id);
