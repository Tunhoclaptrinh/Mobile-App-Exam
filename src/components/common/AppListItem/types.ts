import type { ReactNode } from 'react';
import type { IconName } from '../AppIcon';

export interface AppListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  icon?: IconName;
  value?: string | number;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}
