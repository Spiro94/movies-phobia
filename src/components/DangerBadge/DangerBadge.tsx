import type { DangerColor } from '../../types/danger';

interface DangerBadgeProps {
  score: number;
  color: DangerColor;
  label?: string;
}

export function DangerBadge({ score, color, label }: DangerBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold"
      style={{ backgroundColor: color }}
    >
      {label && <span>{label}:</span>}
      <span>{Math.round(score)}</span>
    </div>
  );
}
