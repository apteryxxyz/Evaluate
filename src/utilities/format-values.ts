/**
 * Use Intl.DateTimeFormat to format a date.
 * @param value The date to format
 * @param dateStyle The date style to use
 */
export function formatDate(
  value: Date,
  dateStyle: 'full' | 'long' | 'medium' | 'short' = 'short',
) {
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle });
  return formatter.format(value);
}
