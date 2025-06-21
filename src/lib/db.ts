// src/lib/db.ts
import { Shortlink } from "@/types/shortlink.types";
import { IDomain } from "@/types/domain.types";

// In-memory database for development
class InMemoryDB {
  private shortlinks: Shortlink[] = [];
  private readonly domains: IDomain[] = [
    {
      id: "1",
      domain: "http://localhost:3000",
      created_at: new Date().toISOString()
    }
  ];
  private shortlinkId = 1;
  private domainId = 2;
  async getShortlinks() {
    return [...this.shortlinks].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }

  async getDomains() {
    return [...this.domains];
  }

  async createShortlink({ shortlink, longlink, domain_id }: { shortlink: string; longlink: string; domain_id?: string | null }) {
    const newShortlink: Shortlink = {
      id: String(this.shortlinkId++),
      shortlink,
      longlink,
      domain_id: domain_id ?? "1", // Default to the first domain
      created_at: new Date().toISOString(),
      clicks: 0
    };
    
    this.shortlinks.push(newShortlink);
    return { id: newShortlink.id };
  }
  async updateShortlink({ id, shortlink, longlink, domain_id }: { id: string; shortlink: string; longlink: string; domain_id?: string | null }) {
    const index = this.shortlinks.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.shortlinks[index] = {
      ...this.shortlinks[index],
      shortlink,
      longlink,
      domain_id: domain_id ?? this.shortlinks[index].domain_id
    };
    
    return { id };
  }

  async deleteShortlink(id: string) {
    const index = this.shortlinks.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.shortlinks.splice(index, 1);
    return true;
  }
  async getShortlinkBySlug(shortlink: string) {
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    return link || null;
  }

  async incrementClicks(shortlink: string) {
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    if (link) {
      link.clicks = (link.clicks ?? 0) + 1;
      return true;
    }
    return false;
  }

  async createDomain(domain: string) {
    const newDomain: IDomain = {
      id: String(this.domainId++),
      domain,
      created_at: new Date().toISOString()
    };
    
    this.domains.push(newDomain);
    return { id: newDomain.id };
  }

  async deleteDomain(id: string) {
    const index = this.domains.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    this.domains.splice(index, 1);
    return true;
  }
}

// Create a singleton instance
const db = new InMemoryDB();
export default db;
