import { useState, useEffect, useCallback } from 'react';
import type { SceneTag } from '../types/phobia';
import { loadSceneTags, saveSceneTags } from '../utils/storage';

interface UseSceneTagsReturn {
  tags: SceneTag[];
  addTag: (tag: Omit<SceneTag, 'count'>) => void;
  removeTag: (index: number) => void;
}

/**
 * Hook for managing scene tags state and localStorage persistence
 * @param movieId - Movie ID to load/save tags for
 * @returns tags array, addTag and removeTag functions
 */
export function useSceneTags(movieId: string): UseSceneTagsReturn {
  const [tags, setTags] = useState<SceneTag[]>(() => loadSceneTags(movieId));

  // Persist tags to localStorage whenever they change
  useEffect(() => {
    saveSceneTags(movieId, tags);
  }, [tags, movieId]);

  const addTag = useCallback((newTag: Omit<SceneTag, 'count'>) => {
    setTags(prev => {
      // Check for duplicate (same timestamp + phobiaId within 5-second window)
      const existing = prev.find(
        t => Math.abs(t.timestamp - newTag.timestamp) <= 5 && t.phobiaId === newTag.phobiaId
      );

      if (existing) {
        // Increment count for existing tag
        return prev.map(t =>
          t === existing ? { ...t, count: t.count + 1 } : t
        );
      }

      // Add new tag with count=1
      return [...prev, { ...newTag, count: 1 }];
    });
  }, []);

  const removeTag = useCallback((index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  }, []);

  return { tags, addTag, removeTag };
}
