import { StyleSheet } from 'react-native';
import { Colors, Gradients, TileMetrics } from '@/constants';

export const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: Colors.primary,
    backgroundImage: Gradients.primary,
  },
  purple: {
    backgroundColor: Colors.purple,
    backgroundImage: 'linear-gradient(180deg, #AF52DE, #7C1FAB)',
  },
  teal: {
    backgroundColor: Colors.teal,
    backgroundImage: 'linear-gradient(180deg, #30B0C7, #007D94)',
  },
  success: {
    backgroundColor: '#34C759',
    backgroundImage: 'linear-gradient(180deg, #34C759, #019426)',
  },
  error: {
    backgroundColor: Colors.error,
    backgroundImage: 'linear-gradient(180deg, #FF3B30, #CC0800)',
  },
  highlight: {
    position: 'absolute',
    top: 1,
    height: 1,
    left: '18%',
    right: '18%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});
const size = (pixels: number) =>
  StyleSheet.create({
    tile: {
      width: pixels,
      height: pixels,
      borderRadius: Math.round(pixels * TileMetrics.radiusRatio),
    },
  }).tile;
export const tileSizes = {
  sm: size(TileMetrics.sm),
  md: size(TileMetrics.md),
  lg: size(TileMetrics.lg),
};
