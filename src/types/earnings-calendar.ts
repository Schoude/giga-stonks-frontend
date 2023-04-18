export interface Earning {
  currency: string;
  estimate: number;
  fiscalDateEnding: string;
  name: string;
  reportDate: string;
  symbol: string;
};

export interface EarninigsCalendarResponse {
  estimates_high: Earning[];
  estimates_low: Earning[];
}

interface EPSSurprise {
  actual: number;
  estimate: number;
  period: string;
  quarter: number,
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

export type EPSSurprises = EPSSurprise[];
