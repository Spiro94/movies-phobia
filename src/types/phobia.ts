export interface Phobia {
  id: string;
  name: string;
  description: string;
  category: 'animal' | 'natural' | 'blood' | 'situational' | 'other';
}

export interface SceneTag {
  phobiaId: string;
  intensity: number; // 1-10 scale for user input
  timestamp: number; // Timestamp in seconds
  notes?: string; // Optional notes about the scene
  count: number; // Number of users who tagged this scene
}
