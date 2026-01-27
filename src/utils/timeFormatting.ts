/**
 * Parses a timestamp string in "mm:ss" format to total seconds.
 * Returns null if the format is invalid.
 *
 * @param input - Timestamp string in "mm:ss" format (e.g., "75:30" or "10:05")
 * @returns Total seconds as number, or null if invalid
 *
 * @example
 * parseTimestamp("75:30") // 4530
 * parseTimestamp("10:70") // null (invalid seconds)
 * parseTimestamp("-5:30") // null (negative)
 */
export function parseTimestamp(input: string): number | null {
  const match = input.match(/^(\d+):(\d{2})$/);
  if (!match) return null;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  if (seconds >= 60) return null; // Invalid seconds
  if (minutes < 0) return null; // Negative minutes

  return minutes * 60 + seconds;
}

/**
 * Formats seconds into "mm:ss" format.
 *
 * @param seconds - Total seconds
 * @returns Formatted timestamp string (e.g., "75:30")
 *
 * @example
 * formatTimestamp(4530) // "75:30"
 * formatTimestamp(65) // "1:05"
 */
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validates that a timestamp falls within a movie's runtime.
 *
 * @param timestamp - Timestamp in seconds
 * @param runtime - Movie runtime in minutes
 * @returns True if timestamp is valid (> 0 and < runtime)
 *
 * @example
 * validateTimestamp(300, 120) // true (5 minutes into a 120-minute movie)
 * validateTimestamp(8000, 120) // false (exceeds runtime)
 */
export function validateTimestamp(timestamp: number, runtime: number): boolean {
  return timestamp > 0 && timestamp < runtime * 60; // runtime in minutes, timestamp in seconds
}

/**
 * Formats runtime in minutes to human-readable format like "2h 30m".
 *
 * @param minutes - Runtime in minutes
 * @returns Formatted runtime string (e.g., "2h 30m" or "45m")
 *
 * @example
 * formatRuntime(150) // "2h 30m"
 * formatRuntime(45) // "45m"
 */
export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return 'Unknown';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
}
