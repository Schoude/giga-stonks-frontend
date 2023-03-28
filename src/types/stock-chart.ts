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
  HOURS_6: 'hours-6',
  HOURS_3: 'hours-3',
  HOURS_1: 'hours-1',
  MINUTES_30: 'minutes-30',
} as const;

export type IntervalValues = ObjectValues<typeof INTERVAL>;
export type IntervalResolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

export const intervalResolution = new Map<IntervalValues, IntervalResolution>([
  ['week', '60'],
  ['days-2', '15'],
  ['days-1', '15'],
  ['hours-6', '5'],
  ['hours-3', '1'],
  ['hours-1', '1'],
  ['minutes-30', '1'],
]);

export const RENDER_TYPE = {
  LINE: 'line',
  CANDLES: 'candles',
} as const;

export type RenderTypeValues = ObjectValues<typeof RENDER_TYPE>;

export type DisplayType = 'full' | 'widget';
