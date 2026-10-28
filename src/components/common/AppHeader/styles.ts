import { StyleSheet } from 'react-native';
import {
  BorderRadius,
  Colors,
  FloatingChrome,
  HeaderMetrics,
  Spacing,
} from '@/constants';

// Floating-pill dimensions from the base's dynamicIslandPill and islandTitle.
export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    zIndex: 10,
  },
  row: {
    ...FloatingChrome,
    minHeight: HeaderMetrics.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  largeRow: { minHeight: HeaderMetrics.largeHeight },
  title: { flex: 1, gap: 1, paddingVertical: Spacing.xxs },
  standardTitle: {
    fontSize: HeaderMetrics.titleSize,
    lineHeight: HeaderMetrics.titleLine,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  largeTitle: {
    fontSize: HeaderMetrics.largeTitleSize,
    lineHeight: HeaderMetrics.largeTitleLine,
  },
  subtitle: {
    fontSize: HeaderMetrics.subtitleSize,
    lineHeight: HeaderMetrics.subtitleLine,
    fontWeight: '500',
  },
  center: { textAlign: 'center' },
  spacer: { width: HeaderMetrics.action },
  back: {
    width: HeaderMetrics.action,
    height: HeaderMetrics.action,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  pressed: { opacity: 0.7 },
});
export const backHitSlop = { top: 6, bottom: 6, left: 6, right: 6 };
export const createHeaderInsets = (top: number) =>
  StyleSheet.create({ header: { paddingTop: top + Spacing.sm } }).header;
