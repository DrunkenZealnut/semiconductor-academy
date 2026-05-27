import { AlertTriangle, Skull, Droplet, FlaskConical } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { HAZARD_LABELS, type HazardType } from '@/lib/types';

const iconFor: Record<HazardType, React.ComponentType<{ className?: string }>> = {
  'carcinogen-1': Skull,
  'carcinogen-2a': Skull,
  'reproductive-toxin': AlertTriangle,
  mutagen: AlertTriangle,
  corrosive: FlaskConical,
  'acute-toxic': Skull,
  sensitizer: Droplet,
};

const variantFor: Record<HazardType, 'critical' | 'high' | 'moderate'> = {
  'carcinogen-1': 'critical',
  'carcinogen-2a': 'high',
  'reproductive-toxin': 'high',
  mutagen: 'high',
  corrosive: 'moderate',
  'acute-toxic': 'critical',
  sensitizer: 'moderate',
};

export function HazardBadge({ type }: { type: HazardType }) {
  const Icon = iconFor[type];
  return (
    <Tag variant={variantFor[type]} title={HAZARD_LABELS[type]}>
      <Icon aria-hidden className="size-3" />
      {HAZARD_LABELS[type]}
    </Tag>
  );
}
