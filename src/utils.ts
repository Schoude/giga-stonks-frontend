import type { IntervalValues, FHCandles, Candle } from './types/stock-chart';

/**
 * Gets yesterday's date as ISO string.
 *
 * @example 20230301
 */
export function getISODate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * Gets today's date as ISO string.
 *
 * @example 20230301
 */
export function getISODateToday() {
  const date = new Date();
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 *
 * @param isoString '20230215'
 * @returns '2023-02-15'
 */
export function ISODateToJSDate(isoString: string) {
  const year = isoString.slice(0, 4);
  const month = isoString.slice(4, 6);
  const day = isoString.slice(6, 8);

  return `${year}-${month}-${day}`;
}

export function getInterval(interval: IntervalValues): { from: number; to: number; } {
  const now = new Date();

  switch (interval) {
    case 'minutes-30': {
      const fromday = new Date(now);
      fromday.setMinutes(fromday.getMinutes() - 30);
      const from = Math.floor(fromday.getTime() / 1000);
      const to = Math.floor(now.getTime() / 1000);

      return {
        from,
        to,
      }
    }

    case 'hours-1': {
      const fromday = new Date(now);
      fromday.setHours(fromday.getHours() - 1);
      const from = Math.floor(fromday.getTime() / 1000);
      const to = Math.floor(now.getTime() / 1000);

      return {
        from,
        to,
      }
    }

    case 'hours-3': {
      const fromday = new Date(now);
      fromday.setHours(fromday.getHours() - 3);
      const from = Math.floor(fromday.getTime() / 1000);
      const to = Math.floor(now.getTime() / 1000);

      return {
        from,
        to,
      }
    }

    case 'days-1': {
      now.setHours(23, 59, 59, 0);
      const fromday = new Date(now);
      fromday.setHours(0, 0, 0, 0);
      const from = fromday.getTime() / 1000;
      const to = now.getTime() / 1000;

      return {
        from,
        to,
      }
    }

    case 'days-2':
    default: {
      now.setHours(23, 59, 59, 0);
      const fromday = new Date(now);
      fromday.setDate(fromday.getDate() - 1);
      fromday.setHours(0, 0, 0, 0);
      const from = fromday.getTime() / 1000;
      const to = now.getTime() / 1000;

      return {
        from,
        to,
      }
    }

    case 'week': {
      now.setHours(23, 59, 59, 0);
      const fromday = new Date(now);
      fromday.setDate(fromday.getDate() - 7);
      fromday.setHours(0, 0, 0, 0);
      const from = fromday.getTime() / 1000;
      const to = now.getTime() / 1000;

      return {
        from,
        to,
      }
    }
  }
}

export function collectCandleData(data: FHCandles): Candle[] {
  return data.t.map((timestamp, index) => ({
    c: data.c[index],
    o: data.o[index],
    h: data.h[index],
    l: data.l[index],
    v: data.v[index],
    time: new Date((timestamp) * 1000),
  }));
}
