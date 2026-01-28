import { useState } from 'react';
import type { SceneTag } from '../../types/phobia';
import { SceneTimeline } from '../Timeline/SceneTimeline';
import { formatTimestamp } from '../../utils/timeFormatting';
import { getPhobiaById } from '../../utils/phobias';
import { calculateAverageIntensity } from '../../utils/dangerScoring';

interface TimelineTagsProps {
  tags: SceneTag[];
  onRemoveTag: (index: number) => void;
}

export function TimelineTags({ tags, onRemoveTag }: TimelineTagsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate overall statistics
  const maxIntensity = tags.length > 0
    ? Math.max(...tags.map(t => t.intensity))
    : 0;
  const averageIntensity = calculateAverageIntensity(tags);

  if (tags.length === 0) {
    return (
      <div
        className="empty-state"
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666',
        }}
      >
        <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          No tags yet. Be the first to tag a scene!
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Help others by tagging scenes with specific phobias and intensity levels.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Timeline Overview */}
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '15px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px',
        }}>
          Timeline Overview
        </h3>

        {/* Overall Intensity Statistics */}
        <div style={{
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          marginBottom: '15px',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px' }}>
              Maximum Intensity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {maxIntensity}/10
            </div>
          </div>
          <div style={{
            width: '1px',
            background: 'rgba(255, 255, 255, 0.2)'
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px' }}>
              Average Intensity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {averageIntensity.toFixed(1)}/10
            </div>
          </div>
        </div>

        <SceneTimeline tags={tags} />
      </section>

      {/* Individual Tags (Expandable) */}
      <section>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Individual Tags ({tags.length})</span>
          <span>{isExpanded ? '▲' : '▼'}</span>
        </button>

        {isExpanded && (
          <div
            className="individual-tags"
            style={{
              marginTop: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {tags.map((tag, idx) => {
              const phobia = getPhobiaById(tag.phobiaId);
              return (
                <div
                  key={idx}
                  className="tag-item"
                  style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                      }}>
                        {formatTimestamp(tag.timestamp)} - {phobia?.name || 'Unknown Phobia'}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        opacity: 0.8,
                      }}>
                        Intensity: {tag.intensity}/10
                        {' • '}
                        {tag.count} user{tag.count > 1 ? 's' : ''} tagged this
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveTag(idx)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#d32f2f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f44336';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {tag.notes && (
                    <div style={{
                      fontSize: '0.9rem',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      fontStyle: 'italic',
                      opacity: 0.9,
                    }}>
                      "{tag.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
