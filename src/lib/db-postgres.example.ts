// src/lib/db-postgres.ts CONTOH IMPLEMENTASI
// Gantilah InMemoryDB dengan implementasi ini untuk versi production
// Catatan: File ini hanya contoh, sesuaikan dengan kebutuhan Anda
import { sql } from '@vercel/postgres';

class PostgresDB {
  // Inisialisasi database jika belum ada
  async initializeDB() {
    try {
      // Buat tabel shortlinks jika belum ada
      await sql`
        CREATE TABLE IF NOT EXISTS shortlinks (
          id SERIAL PRIMARY KEY,
          shortlink TEXT UNIQUE NOT NULL,
          longlink TEXT NOT NULL,
          domain_id TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          clicks INTEGER DEFAULT 0
        )
      `;

      // Buat tabel domains jika belum ada
      await sql`
        CREATE TABLE IF NOT EXISTS domains (
          id SERIAL PRIMARY KEY,
          domain TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;      // Insert default domain jika belum ada
      const { rowCount } = await sql`SELECT * FROM domains LIMIT 1`;
      if (rowCount === 0) {
        await sql`
          INSERT INTO domains (domain) 
          VALUES (${process.env.DEFAULT_DOMAIN ?? 'https://saturnalia.vercel.app'})
        `;
      }

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // Shortlink methods
  async getShortlinks() {
    const { rows } = await sql`SELECT * FROM shortlinks ORDER BY id DESC`;
    return rows;
  }

  async getShortlinkBySlug(shortlink: string) {
    const { rows } = await sql`
      SELECT * FROM shortlinks WHERE shortlink = ${shortlink} LIMIT 1
    `;
    return rows.length > 0 ? rows[0] : null;
  }
  async createShortlink({ shortlink, longlink, domain_id }: { 
    shortlink: string;
    longlink: string;
    domain_id?: string | null 
  }) {
    const { rows } = await sql`
      INSERT INTO shortlinks (shortlink, longlink, domain_id)
      VALUES (${shortlink}, ${longlink}, ${domain_id ?? '1'})
      RETURNING id
    `;
    return { id: rows[0].id };
  }
  async updateShortlink({ id, shortlink, longlink, domain_id }: {
    id: string;
    shortlink: string;
    longlink: string;
    domain_id?: string | null
  }) {
    const result = await sql`
      UPDATE shortlinks
      SET shortlink = ${shortlink},
          longlink = ${longlink},
          domain_id = ${domain_id ?? null}
      WHERE id = ${id}
    `;
    return result.rowCount && result.rowCount > 0 ? { id } : null;
  }
  async deleteShortlink(id: string) {
    const result = await sql`
      DELETE FROM shortlinks WHERE id = ${id}
    `;
    return result.rowCount && result.rowCount > 0;
  }

  async incrementClicks(shortlink: string) {
    const result = await sql`
      UPDATE shortlinks
      SET clicks = clicks + 1
      WHERE shortlink = ${shortlink}
    `;
    return result.rowCount && result.rowCount > 0;
  }

  // Domain methods
  async getDomains() {
    const { rows } = await sql`SELECT * FROM domains`;
    return rows;
  }

  async createDomain(domain: string) {
    const { rows } = await sql`
      INSERT INTO domains (domain)
      VALUES (${domain})
      RETURNING id
    `;
    return { id: rows[0].id };
  }
  async deleteDomain(id: string) {
    const result = await sql`
      DELETE FROM domains WHERE id = ${id}
    `;
    return result.rowCount && result.rowCount > 0;
  }
}

// Create a singleton instance
const db = new PostgresDB();

// Initialize DB tables
(async () => {
  if (process.env.NODE_ENV !== 'test') {
    await db.initializeDB();
  }
})();

export default db;
