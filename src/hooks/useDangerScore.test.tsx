import { renderHook } from '@testing-library/react';
import { useDangerScore } from './useDangerScore';
import type { SceneTag } from '../types/phobia';

describe('useDangerScore', () => {
  it('returns 0 scores when no tags exist', () => {
    const { result } = renderHook(() =>
      useDangerScore({
        tags: [],
        selectedPhobias: ['arachnophobia', 'acrophobia'],
      })
    );

    expect(result.current.scores.overall).toBe(0);
    expect(result.current.scores.byPhobia.arachnophobia).toBe(0);
    expect(result.current.scores.byPhobia.acrophobia).toBe(0);
  });

  it('calculates danger scores correctly when tags exist', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 7, timestamp: 120, notes: '', count: 1 },
      { phobiaId: 'acrophobia', intensity: 5, timestamp: 240, notes: '', count: 1 },
      { phobiaId: 'arachnophobia', intensity: 9, timestamp: 360, notes: '', count: 2 },
    ];

    const { result } = renderHook(() =>
      useDangerScore({
        tags,
        selectedPhobias: ['arachnophobia', 'acrophobia'],
      })
    );

    // Max intensity for arachnophobia is 9
    expect(result.current.scores.byPhobia.arachnophobia).toBe(9);
    // Max intensity for acrophobia is 5
    expect(result.current.scores.byPhobia.acrophobia).toBe(5);
    // Overall score is max of all phobia scores (9)
    expect(result.current.scores.overall).toBe(9);
  });

  it('only includes selected phobias in scores', () => {
    const tags: SceneTag[] = [
      { phobiaId: 'arachnophobia', intensity: 8, timestamp: 120, notes: '', count: 1 },
      { phobiaId: 'claustrophobia', intensity: 10, timestamp: 240, notes: '', count: 1 },
    ];

    const { result } = renderHook(() =>
      useDangerScore({
        tags,
        selectedPhobias: ['arachnophobia'], // Only arachnophobia selected
      })
    );

    expect(result.current.scores.byPhobia.arachnophobia).toBe(8);
    expect(result.current.scores.byPhobia.claustrophobia).toBeUndefined();
    expect(result.current.scores.overall).toBe(8);
  });

  it('returns correct danger color based on score', () => {
    const { result: lowScore } = renderHook(() =>
      useDangerScore({ tags: [], selectedPhobias: [] })
    );
    expect(lowScore.current.getColor(25)).toBe('#4caf50'); // Green

    const { result: mediumScore } = renderHook(() =>
      useDangerScore({ tags: [], selectedPhobias: [] })
    );
    expect(mediumScore.current.getColor(50)).toBe('#ff9800'); // Yellow

    const { result: highScore } = renderHook(() =>
      useDangerScore({ tags: [], selectedPhobias: [] })
    );
    expect(highScore.current.getColor(85)).toBe('#f44336'); // Red
  });
});
