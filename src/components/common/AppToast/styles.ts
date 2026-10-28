import { Animated, Platform, StyleSheet } from 'react-native';
import { Colors, Spacing, ToastMetrics } from '@/constants';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 20,
  },
  pill: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ToastMetrics.gap,
    borderRadius: ToastMetrics.radius,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: ToastMetrics.paddingHorizontal,
    paddingVertical: ToastMetrics.paddingVertical,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: Platform.OS === 'android' ? 0 : 8,
  },
  text: { flex: 1, gap: 1 },
  title: {
    fontSize: ToastMetrics.titleSize,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: ToastMetrics.messageSize,
    lineHeight: 18,
    fontWeight: '500',
  },
  success: { backgroundColor: Colors.successSoft },
  error: { backgroundColor: Colors.errorSoft },
  warning: { backgroundColor: Colors.warningSoft },
  info: { backgroundColor: Colors.card },
  close: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export const closeHitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
export const createToastPosition = (top: number) =>
  StyleSheet.create({ position: { top: top + Spacing.sm } }).position;
export const createToastAnimation = (
  opacity: Animated.Value,
  translateY: Animated.Value,
) => ({ opacity, transform: [{ translateY }] });
