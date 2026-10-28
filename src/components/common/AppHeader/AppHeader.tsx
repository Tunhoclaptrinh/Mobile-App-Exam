import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../AppIcon';
import { AppText } from '../AppText';
import type { AppHeaderProps } from './types';
import { backHitSlop, createHeaderInsets, styles } from './styles';

// Base header slots and back capsule; header owns the top safe area.
export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  leading,
  titleAlign = 'center',
  size = 'md',
}: AppHeaderProps): React.JSX.Element {
  const { top } = useSafeAreaInsets();
  const inset = useMemo(() => createHeaderInsets(top), [top]);
  return (
    <View style={[styles.header, inset]}>
      <View style={[styles.row, size === 'lg' && styles.largeRow]}>
        {showBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            hitSlop={backHitSlop}
            onPress={onBack}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <AppIcon name="back" size={20} />
          </Pressable>
        )}
        {!showBack && (leading ?? <View style={styles.spacer} />)}
        <View style={styles.title}>
          <AppText
            accessibilityRole="header"
            variant="title"
            style={[
              styles.standardTitle,
              size === 'lg' && styles.largeTitle,
              titleAlign === 'center' && styles.center,
            ]}
          >
            {title}
          </AppText>
          {subtitle && (
            <AppText
              tone="secondary"
              variant="caption"
              style={[
                styles.subtitle,
                titleAlign === 'center' && styles.center,
              ]}
            >
              {subtitle}
            </AppText>
          )}
        </View>
        {rightAction ??
          (titleAlign === 'center' ? <View style={styles.spacer} /> : null)}
      </View>
    </View>
  );
}
