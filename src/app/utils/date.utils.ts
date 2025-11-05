export class DateUtils {
  /**
   * Converts ISO date string to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
   * Removes timezone information for Java LocalDateTime compatibility
   */
  static toLocalDateTime(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  /**
   * Gets start of day in LocalDateTime format
   */
  static getStartOfDay(date: Date = new Date()): string {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return this.toLocalDateTime(startOfDay.toISOString());
  }

  /**
   * Gets end of day in LocalDateTime format
   */
  static getEndOfDay(date: Date = new Date()): string {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return this.toLocalDateTime(endOfDay.toISOString());
  }
}
