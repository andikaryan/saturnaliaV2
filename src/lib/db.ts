// src/lib/db.ts
import { Shortlink } from "@/types/shortlink.types";
import { IDomain } from "@/types/domain.types";

// In-memory database with localStorage persistence for development
class InMemoryDB {
  private shortlinks: Shortlink[];
  private readonly domains: IDomain[];
  private shortlinkId: number;
  private domainId: number;

  constructor() {
    // Initialize with default values or load from localStorage if available
    let storedData;
    
    if (typeof window !== 'undefined') {
      try {        storedData = JSON.parse(localStorage.getItem('saturnaliaDB') ?? '{}');
      } catch (e) {
        console.error('Failed to load data from localStorage', e);
        storedData = {};
      }
    }

    this.shortlinks = storedData?.shortlinks ?? [
      {
        id: "0",
        shortlink: "test",
        longlink: "https://www.google.com",
        domain_id: "1",
        created_at: new Date().toISOString(),
        clicks: 0
      }
    ];
    
    this.domains = storedData?.domains ?? [
      {
        id: "1",
        domain: "http://localhost:3000",
        created_at: new Date().toISOString()
      }
    ];
    
    this.shortlinkId = storedData?.shortlinkId ?? 1;
    this.domainId = storedData?.domainId ?? 2;

    // Log initial state
    console.log('InMemoryDB initialized with:', {
      shortlinks: this.shortlinks,
      domains: this.domains,
      shortlinkId: this.shortlinkId,
      domainId: this.domainId
    });
  }

  // Save current state to localStorage
  private persistData() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saturnaliaDB', JSON.stringify({
          shortlinks: this.shortlinks,
          domains: this.domains,
          shortlinkId: this.shortlinkId,
          domainId: this.domainId
        }));
      } catch (e) {
        console.error('Failed to save data to localStorage', e);
      }
    }
  }  async getShortlinks() {
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
    
    console.log(`DB: Created new shortlink: ${JSON.stringify(newShortlink)}`);
    console.log(`DB: Current shortlinks: ${JSON.stringify(this.shortlinks)}`);
    
    this.persistData();
    return { id: newShortlink.id };
  }  async updateShortlink({ id, shortlink, longlink, domain_id }: { id: string; shortlink: string; longlink: string; domain_id?: string | null }) {
    const index = this.shortlinks.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.shortlinks[index] = {
      ...this.shortlinks[index],
      shortlink,
      longlink,
      domain_id: domain_id ?? this.shortlinks[index].domain_id
    };
    
    this.persistData();
    return { id };
  }

  async deleteShortlink(id: string) {
    const index = this.shortlinks.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.shortlinks.splice(index, 1);
    this.persistData();
    return true;
  }  async getShortlinkBySlug(shortlink: string) {
    console.log(`DB: Looking for shortlink with slug: ${shortlink}`);
    console.log(`DB: Available shortlinks: ${JSON.stringify(this.shortlinks)}`);
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    console.log(`DB: Found link: ${JSON.stringify(link)}`);
    return link ?? null;
  }

  async incrementClicks(shortlink: string) {
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    if (link) {
      link.clicks = (link.clicks ?? 0) + 1;
      console.log(`DB: Incremented clicks for ${shortlink} to ${link.clicks}`);
      this.persistData();
      return true;
    }
    console.log(`DB: Failed to increment clicks for ${shortlink}, link not found`);
    return false;
  }

  async createDomain(domain: string) {
    const newDomain: IDomain = {
      id: String(this.domainId++),
      domain,
      created_at: new Date().toISOString()
    };
    
    this.domains.push(newDomain);
    this.persistData();
    return { id: newDomain.id };
  }

  async deleteDomain(id: string) {
    const index = this.domains.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    this.domains.splice(index, 1);
    this.persistData();
    return true;
  }
}

// Create a singleton instance
const db = new InMemoryDB();
export default db;
