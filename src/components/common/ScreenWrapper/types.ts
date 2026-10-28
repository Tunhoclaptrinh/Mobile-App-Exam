import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ScreenContentInsets {
  top: number;
}
export interface ScreenWrapperProps {
  children?: ReactNode | ((insets: ScreenContentInsets) => ReactNode);
  scrollable?: boolean;
  topInset?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  headerPlacement?: 'fixed' | 'overlay';
  estimatedHeaderHeight?: number;
  footer?: ReactNode;
  bottomInset?: boolean;
}
