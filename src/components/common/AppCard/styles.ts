import { StyleSheet } from 'react-native';
import {
  AppleGlassTokens,
  Colors,
  Gradients,
  Shadows,
  Spacing,
} from '@/constants';

export const styles = StyleSheet.create({
  base: {
    borderRadius: AppleGlassTokens.borderRadius,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderCurve: 'continuous',
    position: 'relative',
  },
  elevated: { ...Shadows.sm, backgroundColor: Colors.surface },
  glass: {
    ...AppleGlassTokens.shadows.light,
    backgroundColor: Colors.surface,
    backgroundImage: Gradients.glass,
  },
  hero: {
    ...AppleGlassTokens.shadows.light,
    backgroundColor: Colors.card,
    backgroundImage: Gradients.hero,
  },
  flat: {
    backgroundColor: Colors.surfaceSubtle,
    borderColor: Colors.transparent,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: Spacing.base,
    right: Spacing.base,
    height: 1,
    backgroundColor: AppleGlassTokens.highlight.light,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});

export function createCardLayoutStyle(
  padding: keyof typeof Spacing,
  gap: keyof typeof Spacing,
) {
  return StyleSheet.create({
    card: { padding: Spacing[padding], gap: Spacing[gap] },
  }).card;
}
