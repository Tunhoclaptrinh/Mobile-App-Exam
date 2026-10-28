import React from 'react';
import { View } from 'react-native';
import { AppIcon } from '../AppIcon';
import type { CupertinoIconTileProps } from './types';
import { TileMetrics } from '@/constants';
import { styles, tileSizes } from './styles';

export function CupertinoIconTile({
  name,
  tone = 'primary',
  size = 'md',
}: CupertinoIconTileProps): React.JSX.Element {
  return (
    <View style={[styles.tile, tileSizes[size], styles[tone]]}>
      <View pointerEvents="none" style={styles.highlight} />
      <AppIcon
        name={name}
        tone="white"
        size={Math.round(TileMetrics[size] * TileMetrics.iconRatio)}
      />
    </View>
  );
}
