import { Flame } from 'lucide-react';

/**
 * Spice level, shown the same way everywhere: filled chillies for the level,
 * then the words. Levels come from the owner (1 mild, 2 medium, 3 medium to hot).
 */
export default function SpiceLevel({
  level,
  label,
  size = 15,
  tone = 'light',
}: {
  level: number;
  label: string;
  size?: number;
  tone?: 'light' | 'dark';
}) {
  const empty = tone === 'dark' ? 'text-ivory/25' : 'text-ink/20';
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <Flame key={n} size={size} className={n <= level ? 'fill-chilli text-chilli' : empty} />
        ))}
      </span>
      <span>
        <span className="sr-only">Spice level: </span>
        {label}
      </span>
    </span>
  );
}
