import type { ReactNode } from 'react';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  leading?: ReactNode;
  titleAlign?: 'left' | 'center';
  size?: 'md' | 'lg';
}
