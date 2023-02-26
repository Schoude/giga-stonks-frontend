interface StockQuote {
  "current_price": number;
  "delta": number;
  "delta_percent": number;
  "high": number;
  "low": number;
  "name": string;
  "open": number;
  "previous_close": number;
  "symbol": string;
  "timestamp": number;
}

export interface QuotesData {
  "avg_percentage_gains": number;
  "avg_percentage_losses": number;
  "gainers": StockQuote[];
  "losers": StockQuote[];
  "rate_limit_remaining": number;
  "rate_limit_reset": number;
  "sentiment": 'bullish' | 'bearish';
}
