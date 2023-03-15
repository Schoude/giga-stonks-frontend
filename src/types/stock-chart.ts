export interface FHCandles {
  c: number[];
  o: number[];
  h: number[];
  l: number[];
  v: number[];
  // timestamp in seconds
  t: number[];
}

export interface Candle {
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
  time: Date;
}

export type ObjectValues<T> = T[keyof T];

export const INTERVAL = {
  WEEK: 'week',
  DAYS_2: 'days-2',
  DAYS_1: 'days-1',
  HOURS_3: 'hours-3',
  HOURS_1: 'hours-1',
  MINUTES_30: 'minutes-30',
} as const;

export type IntervalValues = ObjectValues<typeof INTERVAL>;
