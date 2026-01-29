import { PHOBIAS } from '../../utils/phobias';
import type { Phobia } from '../../types/phobia';

interface PhobiaSelectorProps {
  selectedPhobias: string[];
  onToggle: (phobiaId: string) => void;
  onClear: () => void;
}

export function PhobiaSelector({
  selectedPhobias,
  onToggle,
  onClear,
}: PhobiaSelectorProps) {
  // Group phobias by category
  const grouped = PHOBIAS.reduce((acc, phobia) => {
    if (!acc[phobia.category]) {
      acc[phobia.category] = [];
    }
    acc[phobia.category].push(phobia);
    return acc;
  }, {} as Record<string, Phobia[]>);

  const categoryNames: Record<string, string> = {
    animal: 'Animal Phobias',
    natural: 'Natural Environment',
    blood: 'Blood-Injection-Injury',
    situational: 'Situational',
    other: 'Other Specific Phobias',
  };

  const selectedCount = selectedPhobias.length;

  return (
    <div className="w-full">
      {/* Header with count and clear button */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-app-border">
        <div className="text-sm text-gray-400">
          {selectedCount === 0
            ? 'No phobias selected'
            : `${selectedCount} phobia${selectedCount === 1 ? '' : 's'} selected`}
        </div>
        {selectedCount > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1 text-xs bg-transparent text-danger-yellow border border-danger-yellow rounded cursor-pointer transition-all hover:bg-danger-yellow hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Phobias grouped by category */}
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([category, phobias]) => (
          <fieldset
            key={category}
            className="border border-app-border rounded-lg p-4 m-0"
          >
            <legend className="text-sm font-semibold text-white px-2">
              {categoryNames[category]}
            </legend>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
              {phobias.map((phobia) => (
                <label
                  key={phobia.id}
                  className="flex items-start cursor-pointer p-2 rounded transition-colors hover:bg-[#2a2a2a]"
                >
                  <input
                    type="checkbox"
                    checked={selectedPhobias.includes(phobia.id)}
                    onChange={() => onToggle(phobia.id)}
                    className="mr-2 mt-0.5 cursor-pointer w-4 h-4"
                    style={{ accentColor: '#646cff' }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {phobia.name}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {phobia.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
