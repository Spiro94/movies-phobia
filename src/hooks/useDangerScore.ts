import { useMemo } from 'react';
import type { SceneTag } from '../types/phobia';
import type { DangerScores, DangerColor } from '../types/danger';
import { calculateDangerScores, getDangerColor } from '../utils/dangerScoring';

interface UseDangerScoreProps {
  tags: SceneTag[];
  selectedPhobias: string[];
}

export function useDangerScore({ tags, selectedPhobias }: UseDangerScoreProps) {
  const scores = useMemo<DangerScores>(() => {
    return calculateDangerScores(tags, selectedPhobias);
  }, [tags, selectedPhobias]);

  const getColor = (score?: number): DangerColor => {
    return getDangerColor(score ?? scores.overall);
  };

  return {
    scores,
    getColor,
  };
}
