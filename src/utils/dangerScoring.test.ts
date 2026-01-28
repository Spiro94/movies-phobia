import {
  calculateAverageIntensity,
  calculateAverageIntensityByPhobia,
  calculateDangerScores
} from './dangerScoring';
import type { SceneTag } from '../types/phobia';

describe('calculateAverageIntensity', () => {
  it('returns 0 when no tags exist', () => {
    expect(calculateAverageIntensity([])).toBe(0);
  });

  it('returns tag intensity when single tag exists', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 7, timestamp: 120, notes: '', count: 1 }
    ];
    expect(calculateAverageIntensity(tags)).toBe(7);
  });

  it('calculates simple average when all tags have count=1', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 6, timestamp: 120, notes: '', count: 1 },
      { phobiaId: 'arachnophobia', intensity: 8, timestamp: 180, notes: '', count: 1 },
      { phobiaId: 'arachnophobia', intensity: 10, timestamp: 240, notes: '', count: 1 },
    ];
    // (6 + 8 + 10) / 3 = 8
    expect(calculateAverageIntensity(tags)).toBe(8);
  });

  it('calculates weighted average based on user count', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 8, timestamp: 120, notes: '', count: 3 },
      { phobiaId: 'arachnophobia', intensity: 2, timestamp: 180, notes: '', count: 1 },
    ];
    // (8×3 + 2×1) / (3+1) = 26/4 = 6.5
    expect(calculateAverageIntensity(tags)).toBe(6.5);
  });

  it('handles tags with zero count gracefully', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 5, timestamp: 120, notes: '', count: 0 },
    ];
    expect(calculateAverageIntensity(tags)).toBe(0);
  });
});

describe('calculateAverageIntensityByPhobia', () => {
  it('returns 0 for each phobia when no tags exist', () => {
    const result = calculateAverageIntensityByPhobia([], ['arachnophobia', 'acrophobia']);
    expect(result.arachnophobia).toBe(0);
    expect(result.acrophobia).toBe(0);
  });

  it('calculates average per phobia correctly', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 8, timestamp: 120, notes: '', count: 2 },
      { phobiaId: 'arachnophobia', intensity: 6, timestamp: 180, notes: '', count: 1 },
      { phobiaId: 'acrophobia', intensity: 4, timestamp: 240, notes: '', count: 1 },
      { phobiaId: 'acrophobia', intensity: 10, timestamp: 300, notes: '', count: 1 },
    ];

    const result = calculateAverageIntensityByPhobia(
      tags,
      ['arachnophobia', 'acrophobia']
    );

    // arachnophobia: (8×2 + 6×1) / (2+1) = 22/3 ≈ 7.33
    expect(result.arachnophobia).toBeCloseTo(7.33, 2);
    // acrophobia: (4×1 + 10×1) / (1+1) = 14/2 = 7
    expect(result.acrophobia).toBe(7);
  });

  it('ignores non-selected phobias', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 8, timestamp: 120, notes: '', count: 1 },
      { phobiaId: 'claustrophobia', intensity: 9, timestamp: 180, notes: '', count: 1 },
    ];

    const result = calculateAverageIntensityByPhobia(tags, ['arachnophobia']);

    expect(result.arachnophobia).toBe(8);
    expect(result.claustrophobia).toBeUndefined();
  });
});

describe('calculateDangerScores (existing tests for max)', () => {
  it('uses max intensity not average for danger scores', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 3, timestamp: 120, notes: '', count: 5 },
      { phobiaId: 'arachnophobia', intensity: 9, timestamp: 180, notes: '', count: 1 },
    ];

    const result = calculateDangerScores(tags, ['arachnophobia']);

    // Average would be (3×5 + 9×1)/(5+1) = 24/6 = 4
    // But danger score should use max = 9, converted to 0-100 scale = 90
    expect(result.byPhobia.arachnophobia).toBe(90);
    expect(result.overall).toBe(90);
  });
});
