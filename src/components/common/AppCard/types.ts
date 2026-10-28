import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import type { Spacing } from '@/constants';

export interface AppCardProps
  extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  variant?: 'elevated' | 'glass' | 'flat' | 'hero';
  padding?: keyof typeof Spacing;
  gap?: keyof typeof Spacing;
  style?: StyleProp<ViewStyle>;
}
