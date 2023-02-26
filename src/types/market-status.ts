export interface MarketStatus {
  "region": string;
  "local_open": string;
  "local_close": string;
  "current_status": 'closed' | 'open';
}
