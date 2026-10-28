import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { AppIconProps } from './types';
import { ControlSize } from '@/constants';
import { createIconSize, iconStyles, styles } from './styles';

// Native line icons keep the base's icon slots without adding a font/SVG dependency.
export function AppIcon({
  name,
  tone = 'primary',
  size = 'md',
}: AppIconProps): React.JSX.Element {
  const color = iconStyles[tone];
  const pixels = typeof size === 'number' ? size : ControlSize[size].iconSize;
  const sizing = useMemo(() => createIconSize(pixels), [pixels]);
  let drawing: React.ReactNode;
  switch (name) {
    case 'book':
      drawing = (
        <View style={[styles.book, color.stroke]}>
          <View style={[styles.spine, color.stroke]} />
          <View style={[styles.bookLine, color.fill]} />
        </View>
      );
      break;
    case 'grid':
      drawing = (
        <View style={styles.grid}>
          {[0, 1, 2, 3].map(key => (
            <View key={key} style={[styles.square, color.stroke]} />
          ))}
        </View>
      );
      break;
    case 'clock':
      drawing = (
        <View style={[styles.circle, color.stroke]}>
          <View style={[styles.clockHand, color.fill]} />
          <View style={[styles.clockMinute, color.fill]} />
        </View>
      );
      break;
    case 'plus':
      drawing = (
        <>
          <View style={[styles.horizontal, color.fill]} />
          <View style={[styles.vertical, color.fill]} />
        </>
      );
      break;
    case 'close':
      drawing = (
        <>
          <View style={[styles.horizontal, styles.diagonal, color.fill]} />
          <View
            style={[styles.horizontal, styles.reverseDiagonal, color.fill]}
          />
        </>
      );
      break;
    case 'back':
    case 'chevron':
      drawing = (
        <View
          style={[styles.chevron, color.stroke, name === 'back' && styles.back]}
        />
      );
      break;
    case 'search':
      drawing = (
        <>
          <View style={[styles.search, color.stroke]} />
          <View style={[styles.handle, color.fill]} />
        </>
      );
      break;
    case 'check':
      drawing = <View style={[styles.check, color.stroke]} />;
      break;
    case 'info':
      drawing = (
        <View style={[styles.circle, color.stroke]}>
          <Text style={[styles.info, color.text]}>i</Text>
        </View>
      );
      break;
    case 'edit':
      drawing = <View style={[styles.pen, color.stroke]} />;
      break;
    case 'trash':
      drawing = (
        <>
          <View style={[styles.bin, color.stroke]} />
          <View style={[styles.lid, color.fill]} />
          <View style={[styles.lidHandle, color.fill]} />
        </>
      );
      break;
    case 'borrow':
    case 'return':
      drawing = (
        <View style={[styles.canvas, name === 'return' && styles.down]}>
          <View style={[styles.arrowLine, color.fill]} />
          <View style={[styles.arrowHead, color.stroke]} />
        </View>
      );
      break;
  }
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={sizing.frame}
    >
      <View style={[styles.canvas, sizing.drawing]}>{drawing}</View>
    </View>
  );
}
