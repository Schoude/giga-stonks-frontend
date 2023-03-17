/**
 * Taken from here:
 * {@link https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=SAIC&apikey=demo AlphaVantage API}
 *
 * @example
 *  {
 *    "1. symbol": "SAIC",
 *    "2. name": "Science Applications International Corp",
 *    "3. type": "Equity",
 *    "4. region": "United States",
 *    "5. marketOpen": "09:30",
 *    "6. marketClose": "16:00",
 *    "7. timezone": "UTC-04",
 *    "8. currency": "USD",
 *    "9. matchScore": "1.0000"
 *  }
 */
export interface SymbolSearchResponseEntry {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

export type SymbolSearchResponse = {
  bestMatches: SymbolSearchResponseEntry[]
};
