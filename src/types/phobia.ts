export interface Phobia {
  id: string;
  name: string;
  description: string;
  category: 'animal' | 'natural' | 'blood' | 'situational' | 'other';
}

export interface SceneTag {
  phobiaId: string;
  intensity: number; // 0-100
  timestamp?: string; // Optional time marker in movie
  description?: string;
}
