import type { IconName } from '../AppIcon';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: IconName;
  badge?: number;
  disabled?: boolean;
}
export interface AppBottomNavProps {
  items: BottomNavItem[];
  activeKey: string;
  onChange: (key: string) => void;
  centerFab?: { title: string; onPress: () => void; disabled?: boolean };
}
