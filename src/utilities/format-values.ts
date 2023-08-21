/** Use Intl.DateTimeFormat to format a date. */
export function formatDate(
  value: Date,
  dateStyle: 'full' | 'long' | 'medium' | 'short' = 'short',
) {
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle });
  return formatter.format(value);
}
