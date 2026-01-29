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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div
          role="alert"
          className="p-2.5 bg-danger-red text-white rounded text-sm"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="timestamp"
          className="block mb-1.5 font-bold"
        >
          Timestamp (mm:ss)
        </label>
        <input
          id="timestamp"
          type="text"
          placeholder="e.g., 45:30"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="w-full p-2 text-base border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phobia"
          className="block mb-1.5 font-bold"
        >
          Phobia Type
        </label>
        <select
          id="phobia"
          value={phobiaId}
          onChange={(e) => setPhobiaId(e.target.value)}
          className="w-full p-2 text-base border border-gray-300 rounded"
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
          className="block mb-1.5 font-bold"
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
          className="w-full"
        />
        <div className="flex justify-between text-[0.85rem] text-gray-500 mt-1.5">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block mb-1.5 font-bold"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what happens in this scene..."
          rows={3}
          className="w-full p-2 text-base border border-gray-300 rounded resize-y"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-3 text-base font-bold bg-[#1976d2] text-white border-none rounded cursor-pointer"
      >
        Add Tag
      </button>
    </form>
  );
}
