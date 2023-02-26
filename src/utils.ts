export function getISODate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
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
