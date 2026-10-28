import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface SwipeAction {
  key: string;
  label: string;
  accessibilityLabel?: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export interface AppSwipeableRowProps {
  children: ReactNode;
  actions: SwipeAction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
