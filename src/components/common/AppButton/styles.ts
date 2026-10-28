import { Animated, StyleSheet } from 'react-native';
import {
  BorderRadius,
  Colors,
  ControlSize,
  Gradients,
  AppRadii,
} from '@/constants';
import type { ControlSizeKey } from '@/constants';

export const styles = StyleSheet.create({
  base: {
    borderRadius: AppRadii.control,
    borderCurve: 'continuous',
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primary: { backgroundColor: Colors.primary },
  outline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  danger: { backgroundColor: Colors.errorSoft },
  glass: {
    backgroundColor: Colors.surface,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    backgroundImage: Gradients.glass,
  },
  tonal: { backgroundColor: Colors.primarySoft },
  ghost: { backgroundColor: Colors.transparent },
  disabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
    backgroundImage: [],
  },
  circle: { borderRadius: BorderRadius.pill },
  pressed: { opacity: 0.8 },
  primaryText: { color: Colors.card },
  outlineText: { color: Colors.primary },
  dangerText: { color: Colors.error },
  glassText: { color: Colors.primary },
  tonalText: { color: Colors.primary },
  ghostText: { color: Colors.primary },
  disabledText: { color: Colors.disabledText },
});

const sizes = (size: ControlSizeKey) => {
  const metric = ControlSize[size];
  return StyleSheet.create({
    control: {
      height: metric.height,
      minHeight: metric.height,
      paddingHorizontal: metric.paddingHorizontal,
      paddingVertical: 0,
      gap: metric.gap,
    },
    iconContainer: { width: metric.height },
    iconOnly: { width: metric.height, paddingHorizontal: 0 },
    text: {
      fontSize: metric.fontSize,
      lineHeight: metric.lineHeight,
      fontWeight: '600',
      includeFontPadding: false,
    },
  });
};
export const buttonSizes = {
  sm: sizes('sm'),
  md: sizes('md'),
  lg: sizes('lg'),
};
export const createPressStyle = (scale: Animated.Value) => ({
  transform: [{ scale }],
});
