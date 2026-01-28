import { useState, type FormEvent } from 'react';
import type { SceneTag } from '../../types/phobia';
import { parseTimestamp, validateTimestamp } from '../../utils/timeFormatting';
import { PHOBIAS } from '../../utils/phobias';

interface TagFormProps {
  movieRuntime: number; // minutes
  onSubmit: (tag: Omit<SceneTag, 'count'>) => void;
}

export function TagForm({ movieRuntime, onSubmit }: TagFormProps) {
  const [timestamp, setTimestamp] = useState('');
  const [phobiaId, setPhobiaId] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const timestampSeconds = parseTimestamp(timestamp);
    if (!timestampSeconds && timestampSeconds !== 0) {
      setError('Invalid timestamp format. Use mm:ss (e.g., 45:30)');
      return;
    }

    if (!validateTimestamp(timestampSeconds, movieRuntime)) {
      setError(`Timestamp must be between 0 and ${movieRuntime} minutes`);
      return;
    }

    if (!phobiaId) {
      setError('Please select a phobia');
      return;
    }

    onSubmit({
      timestamp: timestampSeconds,
      phobiaId,
      intensity,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTimestamp('');
    setPhobiaId('');
    setIntensity(5);
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {error && (
        <div
          role="alert"
          style={{
            padding: '10px',
            background: '#f44336',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="timestamp"
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Timestamp (mm:ss)
        </label>
        <input
          id="timestamp"
          type="text"
          placeholder="e.g., 45:30"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          required
        />
      </div>

      <div>
        <label
          htmlFor="phobia"
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Phobia Type
        </label>
        <select
          id="phobia"
          value={phobiaId}
          onChange={(e) => setPhobiaId(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          required
        >
          <option value="">Select a phobia...</option>
          {PHOBIAS.map((phobia) => (
            <option key={phobia.id} value={phobia.id}>
              {phobia.name} - {phobia.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="intensity"
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Intensity: {intensity}/10
        </label>
        <input
          id="intensity"
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
          style={{
            width: '100%',
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '5px',
        }}>
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what happens in this scene..."
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Tag
      </button>
    </form>
  );
}
