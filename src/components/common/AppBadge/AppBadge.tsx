import React from 'react';
import { View } from 'react-native';
import { AppText } from '../AppText';
import type { AppBadgeProps } from './types';
import { styles } from './styles';

export function AppBadge({
  label,
  tone = 'primary',
}: AppBadgeProps): React.JSX.Element {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <AppText variant="caption" style={styles[`${tone}Text`]}>
        {label}
      </AppText>
    </View>
  );
}
