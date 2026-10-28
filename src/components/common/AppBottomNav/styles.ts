import { Animated, StyleSheet } from 'react-native';
import {
  BorderRadius,
  Colors,
  DockMetrics,
  FloatingChrome,
  Spacing,
} from '@/constants';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: DockMetrics.horizontalInset,
    paddingTop: Spacing.sm,
  },
  dock: {
    ...FloatingChrome,
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
    height: DockMetrics.height,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: Spacing.xxs,
    borderRadius: BorderRadius.pill,
  },
  selected: { backgroundColor: Colors.primarySoft },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  indicator: {
    position: 'absolute',
    top: DockMetrics.indicatorInset,
    bottom: DockMetrics.indicatorInset,
    left: 0,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.primarySoft,
  },
  iconRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: DockMetrics.labelSize,
    lineHeight: DockMetrics.labelLine,
    marginTop: Spacing.xxs,
    letterSpacing: -0.1,
    fontWeight: '500',
    includeFontPadding: false,
  },
  activeLabel: { color: Colors.primary, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: -3,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxs,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  badgeText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    color: Colors.card,
    includeFontPadding: false,
  },
  fabSlot: {
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: DockMetrics.fab,
    height: DockMetrics.fab,
    borderRadius: DockMetrics.fab / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
});
export const createBottomInset = (bottom: number) =>
  StyleSheet.create({
    wrapper: { paddingBottom: Math.max(bottom, Spacing.md) },
  }).wrapper;
export const createIndicatorStyle = (
  x: Animated.Value,
  width: Animated.Value,
) => ({ width, transform: [{ translateX: x }] });
