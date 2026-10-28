import { Animated, StyleSheet } from 'react-native';
import { Spacing, Typography } from '@/constants';
import { SWIPE_ACTION_WIDTH } from './gesture';

export interface SwipeablePalette {
  card: string;
  primarySoft: string;
  primaryText: string;
  errorSoft: string;
  error: string;
}
export const createSwipeableStyles = (
  Colors: SwipeablePalette,
  cardRadius: number,
  controlRadius: number,
) =>
  StyleSheet.create({
    container: { borderRadius: cardRadius, overflow: 'hidden' },
    foreground: { borderRadius: cardRadius, backgroundColor: Colors.card },
    actions: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingLeft: Spacing.sm,
      gap: Spacing.sm,
    },
    action: {
      width: SWIPE_ACTION_WIDTH - Spacing.sm,
      minHeight: 44,
      borderRadius: controlRadius,
      backgroundColor: Colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      padding: Spacing.sm,
      marginVertical: Spacing.sm,
    },
    destructive: { backgroundColor: Colors.errorSoft },
    label: {
      ...Typography.caption,
      fontWeight: '600',
      color: Colors.primaryText,
      textAlign: 'center',
    },
    destructiveLabel: { color: Colors.error },
    pressed: { opacity: 0.65 },
    disabled: { opacity: 0.4 },
  });
export const createTranslationStyle = (translateX: Animated.Value) => ({
  transform: [{ translateX }],
});
