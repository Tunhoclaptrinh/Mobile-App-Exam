import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { ControlSizeKey } from '@/constants';

export interface AppButtonProps
  extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: 'primary' | 'outline' | 'danger' | 'glass' | 'tonal' | 'ghost';
  loading?: boolean;
  size?: ControlSizeKey;
  shape?: 'rounded' | 'circle';
  leftIcon?: ReactNode;
  iconOnly?: boolean;
  style?: StyleProp<ViewStyle>;
}
