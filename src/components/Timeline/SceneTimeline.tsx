import { useMemo } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import type { SceneTag } from '../../types/phobia';
import { formatTimestamp } from '../../utils/timeFormatting';
import { getDangerColor, calculateAverageIntensity } from '../../utils/dangerScoring';
import { getPhobiaById } from '../../utils/phobias';

interface SceneTimelineProps {
  tags: SceneTag[];
}

interface PhobiaInfo {
  id: string;
  name: string;
  count: number;
}

interface AggregatedTag {
  timestamp: number; // bucket timestamp (30-second window)
  phobias: PhobiaInfo[];
  maxIntensity: number;
  averageIntensity: number; // weighted average across all tags in window
}

export function SceneTimeline({ tags }: SceneTimelineProps) {
  // Aggregate tags into 30-second windows
  const aggregated = useMemo(() => {
    const grouped: Record<number, AggregatedTag & { tagsInWindow: SceneTag[] }> = {};

    tags.forEach(tag => {
      const bucket = Math.round(tag.timestamp / 30) * 30; // 30-second window
      if (!grouped[bucket]) {
        grouped[bucket] = {
          timestamp: bucket,
          phobias: [],
          maxIntensity: 0,
          averageIntensity: 0,
          tagsInWindow: [], // Track tags for averaging
        };
      }

      // Track tag for average calculation
      grouped[bucket].tagsInWindow.push(tag);

      const phobia = grouped[bucket].phobias.find(p => p.id === tag.phobiaId);
      if (phobia) {
        phobia.count += tag.count;
      } else {
        grouped[bucket].phobias.push({
          id: tag.phobiaId,
          name: getPhobiaById(tag.phobiaId)?.name || 'Unknown',
          count: tag.count,
        });
      }

      grouped[bucket].maxIntensity = Math.max(grouped[bucket].maxIntensity, tag.intensity);
    });

    // Calculate average intensity for each window
    const result = Object.values(grouped).map(window => {
      const { tagsInWindow, ...rest } = window;
      return {
        ...rest,
        averageIntensity: calculateAverageIntensity(tagsInWindow),
      };
    });

    return result.sort((a, b) => a.timestamp - b.timestamp);
  }, [tags]);

  if (aggregated.length === 0) {
    return null;
  }

  return (
    <Timeline position="right">
      {aggregated.map((item, index) => (
        <TimelineItem key={item.timestamp}>
          <TimelineSeparator>
            <TimelineDot
              style={{
                backgroundColor: getDangerColor(item.maxIntensity * 10),
                width: '16px',
                height: '16px',
              }}
            />
            {index < aggregated.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <div style={{
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              marginBottom: '10px',
            }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '8px',
                fontSize: '1rem',
              }}>
                {formatTimestamp(item.timestamp)}
              </div>
              <div style={{
                fontSize: '0.85rem',
                opacity: 0.7,
                marginBottom: '8px',
              }}>
                Max: {item.maxIntensity}/10 • Avg: {item.averageIntensity.toFixed(1)}/10
              </div>
              {item.phobias.map(p => (
                <div
                  key={p.id}
                  style={{
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
                >
                  {p.name} ({p.count} user{p.count > 1 ? 's' : ''})
                </div>
              ))}
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
