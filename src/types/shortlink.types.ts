export interface Shortlink {
  id: string;
  shortlink: string;
  longlink: string;
  domain_id: string | null;
  created_at?: string;
  clicks?: number;
}
