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
      <div className="empty-state text-center p-[60px_20px] text-gray-500">
        <p className="text-lg mb-2.5">
          No tags yet. Be the first to tag a scene!
        </p>
        <p className="text-sm">
          Help others by tagging scenes with specific phobias and intensity levels.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Timeline Overview */}
      <section className="mb-8">
        <h3 className="text-xl mb-4 border-b-2 border-white/10 pb-2">
          Timeline Overview
        </h3>

        {/* Overall Intensity Statistics */}
        <div className="p-4 bg-white/5 rounded mb-4 flex gap-5 justify-center">
          <div className="text-center">
            <div className="text-[0.85rem] opacity-70 mb-1.5">
              Maximum Intensity
            </div>
            <div className="text-2xl font-bold">
              {maxIntensity}/10
            </div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-[0.85rem] opacity-70 mb-1.5">
              Average Intensity
            </div>
            <div className="text-2xl font-bold">
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
          className="w-full text-left p-3 bg-white/5 border border-white/10 rounded text-white text-lg cursor-pointer flex justify-between items-center"
        >
          <span>Individual Tags ({tags.length})</span>
          <span>{isExpanded ? '▲' : '▼'}</span>
        </button>

        {isExpanded && (
          <div className="individual-tags mt-4 flex flex-col gap-2.5">
            {tags.map((tag, idx) => {
              const phobia = getPhobiaById(tag.phobiaId);
              return (
                <div
                  key={idx}
                  className="tag-item p-4 bg-white/[0.03] border border-white/10 rounded flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-base font-bold mb-1.5">
                        {formatTimestamp(tag.timestamp)} - {phobia?.name || 'Unknown Phobia'}
                      </div>
                      <div className="text-sm opacity-80">
                        Intensity: {tag.intensity}/10
                        {' • '}
                        {tag.count} user{tag.count > 1 ? 's' : ''} tagged this
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveTag(idx)}
                      className="px-3 py-1.5 bg-danger-red text-white border-none rounded text-[0.85rem] cursor-pointer transition-colors hover:bg-[#d32f2f]"
                    >
                      Delete
                    </button>
                  </div>
                  {tag.notes && (
                    <div className="text-sm p-2.5 bg-white/5 rounded italic opacity-90">
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
