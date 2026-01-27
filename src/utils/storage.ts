const STORAGE_KEY = 'movies-phobia:selected-phobias';

/**
 * Save selected phobia IDs to localStorage
 * @param phobiaIds - Array of phobia IDs to save
 */
export function savePhobias(phobiaIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phobiaIds));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Unable to save phobias.');
      // Optionally clear old data or notify user
    } else {
      console.error('Error saving phobias to localStorage:', error);
    }
  }
}

/**
 * Load selected phobia IDs from localStorage
 * @returns Array of phobia IDs, or empty array if none found
 */
export function loadPhobias(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading phobias from localStorage:', error);
    return [];
  }
}

/**
 * Clear all saved phobias from localStorage
 */
export function clearPhobias(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing phobias from localStorage:', error);
  }
}
