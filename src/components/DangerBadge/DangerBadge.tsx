import { DangerColor } from '../../types/danger';

interface DangerBadgeProps {
  score: number;
  color: DangerColor;
  label?: string;
}

export function DangerBadge({ score, color, label }: DangerBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: color,
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {label && <span>{label}:</span>}
      <span>{Math.round(score)}</span>
    </div>
  );
}
