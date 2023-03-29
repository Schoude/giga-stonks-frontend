interface Earning {
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
