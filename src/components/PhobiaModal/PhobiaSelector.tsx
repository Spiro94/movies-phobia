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
    <div style={{ width: '100%' }}>
      {/* Header with count and clear button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #333',
        }}
      >
        <div style={{ fontSize: '14px', color: '#aaa' }}>
          {selectedCount === 0
            ? 'No phobias selected'
            : `${selectedCount} phobia${selectedCount === 1 ? '' : 's'} selected`}
        </div>
        {selectedCount > 0 && (
          <button
            onClick={onClear}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '1px solid #ff9800',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff9800';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff9800';
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Phobias grouped by category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Object.entries(grouped).map(([category, phobias]) => (
          <fieldset
            key={category}
            style={{
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '16px',
              margin: 0,
            }}
          >
            <legend
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                padding: '0 8px',
              }}
            >
              {categoryNames[category]}
            </legend>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {phobias.map((phobia) => (
                <label
                  key={phobia.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPhobias.includes(phobia.id)}
                    onChange={() => onToggle(phobia.id)}
                    style={{
                      marginRight: '8px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      width: '16px',
                      height: '16px',
                      accentColor: '#646cff',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {phobia.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#aaa',
                        marginTop: '2px',
                      }}
                    >
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
