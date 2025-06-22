// src/lib/db.ts
import { Shortlink } from "@/types/shortlink.types";
import { IDomain } from "@/types/domain.types";

// Singleton pattern to ensure we maintain data across API calls in production
// Using let instead of const since we'll update these in the DB class
let globalShortlinks: Shortlink[] | null = null;
let globalDomains: IDomain[] | null = null;
let globalShortlinkId: number | null = null;
let globalDomainId: number | null = null;

// In-memory database with persistence across deployments on Vercel
class InMemoryDB {
  private shortlinks: Shortlink[];
  private readonly domains: IDomain[];
  private shortlinkId: number;
  private domainId: number;  
  
  constructor() {
    // Initialize with default values or use global values if available
    let storedData: { 
      shortlinks?: Shortlink[]; 
      domains?: IDomain[]; 
      shortlinkId?: number; 
      domainId?: number 
    } = {};
      // First try to use global singleton data (for server-side functions)
    if (globalShortlinks !== null) {
      this.shortlinks = globalShortlinks;
      this.domains = globalDomains || [
        {
          id: "1",
          domain: "https://saturnalia-v2-gzr952ors-ryans-projects-0e6d0351.vercel.app",
          created_at: new Date().toISOString()
        }
      ];
      this.shortlinkId = globalShortlinkId || 1;
      this.domainId = globalDomainId || 2;
      return;
    }
    
    // Try localStorage only in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedData = localStorage.getItem('saturnaliaDB');
        if (savedData) {
          storedData = JSON.parse(savedData);
        }
      } catch (e) {
        console.error('Failed to load data from localStorage', e);
      }
    }    // Default shortlinks with a test entry
    const defaultShortlinks = [
      {
        id: "0",
        shortlink: "test",
        longlink: "https://www.google.com",
        domain_id: "1",
        created_at: new Date().toISOString(),
        clicks: 0
      }
    ];
    
    // For production, use the Vercel deployment URL
    const productionDomain = "https://saturnalia-v2-gzr952ors-ryans-projects-0e6d0351.vercel.app";
    const localDomain = "http://localhost:3000";
    
    // Default domains with both localhost and production URL
    const defaultDomains = [
      {
        id: "1",
        domain: typeof window !== 'undefined' ? window.location.origin : productionDomain,
        created_at: new Date().toISOString()
      }
    ];
    
    this.shortlinks = storedData?.shortlinks ?? defaultShortlinks;
    this.domains = storedData?.domains ?? defaultDomains;
    
    this.shortlinkId = storedData?.shortlinkId ?? 1;
    this.domainId = storedData?.domainId ?? 2;    // Log initial state in development only
    if (process.env.NODE_ENV !== 'production') {
      console.log('InMemoryDB initialized with:', {
        shortlinks: this.shortlinks,
        domains: this.domains,
        shortlinkId: this.shortlinkId,
        domainId: this.domainId
      });
    }
  }  // Save current state to both localStorage (client) and global variables (server)
  private persistData() {
    // Update global variables for server-side persistence
    globalShortlinks = this.shortlinks;
    globalDomains = this.domains;
    globalShortlinkId = this.shortlinkId;
    globalDomainId = this.domainId;
    
    // Only persist data in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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
    
    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Data persisted:', { 
        shortlinks: this.shortlinks.length,
        inBrowser: typeof window !== 'undefined'
      });
    }
  }async getShortlinks() {
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
      // Log in development only
    if (process.env.NODE_ENV !== 'production') {
      console.log(`DB: Created new shortlink: ${JSON.stringify(newShortlink)}`);
      console.log(`DB: Current shortlinks: ${JSON.stringify(this.shortlinks)}`);
    }
    
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
    // Always log in production for debugging purposes
    console.log(`DB: Looking for shortlink with slug: ${shortlink}`);
    console.log(`DB: Available shortlinks: ${JSON.stringify(this.shortlinks.map(s => ({ id: s.id, shortlink: s.shortlink })))}`);
    console.log(`Is Browser: ${typeof window !== 'undefined'}, Shortlinks count: ${this.shortlinks.length}`);
    
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    
    console.log(`DB: Found link: ${JSON.stringify(link || 'None')}`);
    
    return link ?? null;
  }
  async incrementClicks(shortlink: string) {
    const link = this.shortlinks.find(s => s.shortlink === shortlink);
    if (link) {
      link.clicks = (link.clicks ?? 0) + 1;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`DB: Incremented clicks for ${shortlink} to ${link.clicks}`);
      }
      
      this.persistData();
      return true;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`DB: Failed to increment clicks for ${shortlink}, link not found`);
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
