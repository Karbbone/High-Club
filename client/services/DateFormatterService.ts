export class DateFormatterService {
  /**
   * Formats a date into the specified format.
   * @param date The date to format (Date object, ISO string, or timestamp).
   * @param format The desired output format (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', etc.).
   * @returns The formatted date string.
   */
  static format(date: Date | string | number, format: string): string {
    if (!date) {
      return 'Date non renseignée';
    }
    const d = date instanceof Date ? date : new Date(date);

    const pad = (n: number) => n.toString().padStart(2, '0');

    const map: Record<string, string> = {
      'YYYY': d.getFullYear().toString(),
      'MM': pad(d.getMonth() + 1),
      'DD': pad(d.getDate()),
      'HH': pad(d.getHours()),
      'mm': pad(d.getMinutes()),
      'ss': pad(d.getSeconds()),
    };

    let formatted = format;
    for (const key in map) {
      formatted = formatted.replace(key, map[key]);
    }
    return formatted;
  }
}

// Example usage:
// DateFormatterService.format(new Date(), 'YYYY-MM-DD')
// DateFormatterService.format('2024-06-01T12:34:56Z', 'DD/MM/YYYY')
// DateFormatterService.format(Date.now(), 'MM-DD-YYYY HH:mm:ss')