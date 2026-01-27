import { useState, useEffect } from 'react';
import { loadPhobias, savePhobias } from '../utils/storage';

export function usePhobias() {
  const [selectedPhobias, setSelectedPhobias] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadPhobias();
    setSelectedPhobias(stored);
    setIsLoaded(true);
  }, []);

  // Persist to localStorage when selectedPhobias changes
  useEffect(() => {
    if (isLoaded) {
      savePhobias(selectedPhobias);
    }
  }, [selectedPhobias, isLoaded]);

  const togglePhobia = (phobiaId: string) => {
    setSelectedPhobias((prev) => {
      if (prev.includes(phobiaId)) {
        return prev.filter((id) => id !== phobiaId);
      } else {
        return [...prev, phobiaId];
      }
    });
  };

  const setPhobias = (phobiaIds: string[]) => {
    setSelectedPhobias(phobiaIds);
  };

  return {
    selectedPhobias,
    togglePhobia,
    setPhobias,
    isLoaded,
  };
}
