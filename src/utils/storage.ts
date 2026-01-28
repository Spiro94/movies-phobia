import type { SceneTag } from '../types/phobia';

const STORAGE_KEY = 'movies-phobia:selected-phobias';
const TAGS_STORAGE_KEY = 'movies-phobia:scene-tags';

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

/**
 * Data structure for storing scene tags by movie ID
 */
interface TagStorage {
  [movieId: string]: SceneTag[];
}

/**
 * Load all scene tags from localStorage
 * @returns Object mapping movieId to array of SceneTags
 */
function loadAllSceneTags(): TagStorage {
  try {
    const data = localStorage.getItem(TAGS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading scene tags from localStorage:', error);
    return {};
  }
}

/**
 * Save scene tags for a specific movie to localStorage
 * Tags will migrate to backend API in Phase 2 (authentication + server persistence)
 * @param movieId - Movie ID to save tags for
 * @param tags - Array of scene tags
 */
export function saveSceneTags(movieId: string, tags: SceneTag[]): void {
  try {
    const existing = loadAllSceneTags();
    existing[movieId] = tags;
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(existing));

    // Monitor storage quota (5MB = 5,242,880 bytes, warn at 90%)
    const storageSize = getStorageSize();
    const QUOTA_LIMIT = 5242880;
    const WARNING_THRESHOLD = QUOTA_LIMIT * 0.9;

    if (storageSize > WARNING_THRESHOLD) {
      console.warn(
        `localStorage usage is at ${Math.round((storageSize / QUOTA_LIMIT) * 100)}%. ` +
        `Current: ${Math.round(storageSize / 1024)}KB / ${Math.round(QUOTA_LIMIT / 1024)}KB`
      );
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Tags not saved.');
      // TODO: Show UI warning to user (Phase 2)
    } else {
      console.error('Error saving scene tags to localStorage:', error);
    }
  }
}

/**
 * Load scene tags for a specific movie from localStorage
 * @param movieId - Movie ID to load tags for
 * @returns Array of scene tags, or empty array if none found
 */
export function loadSceneTags(movieId: string): SceneTag[] {
  const all = loadAllSceneTags();
  return all[movieId] || [];
}

/**
 * Get current localStorage usage in bytes
 * @returns Total size of all localStorage data in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}
