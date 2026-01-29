import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadPhobias, savePhobias } from '../utils/storage';

interface PhobiaContextValue {
  selectedPhobias: string[];
  togglePhobia: (phobiaId: string) => void;
  setPhobias: (phobiaIds: string[]) => void;
  isLoaded: boolean;
}

const PhobiaContext = createContext<PhobiaContextValue | undefined>(undefined);

interface PhobiaProviderProps {
  children: ReactNode;
}

export function PhobiaProvider({ children }: PhobiaProviderProps) {
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

  return (
    <PhobiaContext.Provider
      value={{
        selectedPhobias,
        togglePhobia,
        setPhobias,
        isLoaded,
      }}
    >
      {children}
    </PhobiaContext.Provider>
  );
}

export function usePhobiaContext() {
  const context = useContext(PhobiaContext);
  if (context === undefined) {
    throw new Error('usePhobiaContext must be used within PhobiaProvider');
  }
  return context;
}
