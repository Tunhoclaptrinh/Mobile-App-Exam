import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../AppText';
import { AppIcon } from '../AppIcon';
import type { AppListItemProps } from './types';
import { styles } from './styles';

export function AppListItem({
  title,
  subtitle,
  leading,
  trailing,
  icon,
  value,
  onPress,
  disabled = false,
  destructive = false,
}: AppListItemProps): React.JSX.Element {
  const content = (
    <>
      {leading ??
        (icon && (
          <AppIcon name={icon} tone={destructive ? 'error' : 'secondary'} />
        ))}
      <View style={styles.body}>
        <AppText style={styles.title} tone={destructive ? 'error' : 'default'}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" tone="secondary">
            {subtitle}
          </AppText>
        )}
      </View>
      {trailing ??
        (value !== undefined && (
          <AppText tone="secondary" style={styles.value}>
            {value}
          </AppText>
        ))}
      {onPress && !destructive && (
        <AppIcon name="chevron" tone="secondary" size="sm" />
      )}
    </>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
}
