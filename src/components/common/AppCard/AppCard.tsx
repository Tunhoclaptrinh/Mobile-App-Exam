import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import type { AppCardProps } from './types';
import { createCardLayoutStyle, styles } from './styles';

// Base AppCard surface/layout split, including accessibility and press slots.
export function AppCard({
  children,
  variant = 'glass',
  padding = 'base',
  gap = 'sm',
  style,
  onPress,
  onLongPress,
  disabled = false,
  ...props
}: AppCardProps): React.JSX.Element {
  const layout = useMemo(
    () => createCardLayoutStyle(padding, gap),
    [padding, gap],
  );
  const contents = (
    <>
      {variant !== 'flat' && (
        <View pointerEvents="none" style={styles.highlight} />
      )}
      {children}
    </>
  );
  if (onPress || onLongPress) {
    return (
      <Pressable
        {...props}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          layout,
          pressed && styles.pressed,
          style,
        ]}
      >
        {contents}
      </Pressable>
    );
  }
  return (
    <View {...props} style={[styles.base, styles[variant], layout, style]}>
      {contents}
    </View>
  );
}
