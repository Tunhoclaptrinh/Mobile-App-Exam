import type { IconName, IconTone } from '../AppIcon';

export interface CupertinoIconTileProps {
  name: IconName;
  tone?: Exclude<IconTone, 'white' | 'secondary'>;
  size?: 'sm' | 'md' | 'lg';
}
