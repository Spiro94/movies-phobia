import type { DangerScores, DangerColor } from '../types/danger';
import type { SceneTag } from '../types/phobia';

/**
 * Calculate danger scores based on scene tags and selected phobias
 * @param tags - Array of scene tags with phobia IDs and intensities
 * @param selectedPhobias - Array of selected phobia IDs
 * @returns DangerScores object with overall score and per-phobia scores
 */
export function calculateDangerScores(
  tags: SceneTag[],
  selectedPhobias: string[]
): DangerScores {
  const byPhobia: Record<string, number> = {};

  // Initialize scores for all selected phobias
  selectedPhobias.forEach((phobiaId) => {
    byPhobia[phobiaId] = 0;
  });

  // Calculate max intensity for each selected phobia
  tags.forEach((tag) => {
    if (selectedPhobias.includes(tag.phobiaId)) {
      byPhobia[tag.phobiaId] = Math.max(
        byPhobia[tag.phobiaId] || 0,
        tag.intensity * 10  // Convert 1-10 scale to 0-100
      );
    }
  });

  // Calculate overall score as the maximum of all phobia scores
  const phobiaScores = Object.values(byPhobia);
  const overall = phobiaScores.length > 0 ? Math.max(...phobiaScores) : 0;

  return {
    overall,
    byPhobia,
  };
}

/**
 * Calculate average intensity for a set of tags, weighted by user count
 * @param tags - Array of scene tags with intensity and count
 * @returns Average intensity (0-10) weighted by number of users per tag
 */
export function calculateAverageIntensity(tags: SceneTag[]): number {
  if (tags.length === 0) return 0;

  let totalIntensity = 0;
  let totalUsers = 0;

  tags.forEach(tag => {
    totalIntensity += tag.intensity * tag.count;
    totalUsers += tag.count;
  });

  return totalUsers > 0 ? totalIntensity / totalUsers : 0;
}

/**
 * Calculate average intensity per phobia for selected phobias
 * @param tags - Array of scene tags
 * @param selectedPhobias - Array of selected phobia IDs
 * @returns Record mapping phobia ID to average intensity
 */
export function calculateAverageIntensityByPhobia(
  tags: SceneTag[],
  selectedPhobias: string[]
): Record<string, number> {
  const byPhobia: Record<string, number> = {};

  selectedPhobias.forEach(phobiaId => {
    const phobiaTags = tags.filter(tag => tag.phobiaId === phobiaId);
    byPhobia[phobiaId] = calculateAverageIntensity(phobiaTags);
  });

  return byPhobia;
}

/**
 * Get danger color based on score
 * @param score - Danger score from 0-100
 * @returns Hex color code
 */
export function getDangerColor(score: number): DangerColor {
  if (score <= 30) {
    return '#4caf50'; // Green - safe
  } else if (score <= 70) {
    return '#ff9800'; // Yellow/Orange - moderate
  } else {
    return '#f44336'; // Red - high danger
  }
}
