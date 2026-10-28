import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable } from 'react-native';
import { Colors, Motion } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AppText } from '../AppText';
import type { AppButtonProps } from './types';
import { buttonSizes, createPressStyle, styles } from './styles';

export function AppButton({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
  leftIcon,
  iconOnly = false,
  shape = 'rounded',
  style,
  onPressIn,
  onPressOut,
  ...props
}: AppButtonProps): React.JSX.Element {
  const unavailable = disabled || loading;
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animationStyle = useMemo(() => createPressStyle(scale), [scale]);
  const animate = (toValue: number) => {
    if (!reduceMotion) {
      Animated.spring(scale, {
        toValue,
        speed: 50,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Animated.View
      style={[
        animationStyle,
        iconOnly && buttonSizes[size].iconContainer,
        style,
      ]}
    >
      <Pressable
        {...props}
        accessibilityRole="button"
        accessibilityLabel={props.accessibilityLabel ?? title}
        accessibilityState={{ disabled: unavailable, busy: loading }}
        disabled={unavailable}
        onPressIn={event => {
          animate(Motion.pressScale);
          onPressIn?.(event);
        }}
        onPressOut={event => {
          animate(1);
          onPressOut?.(event);
        }}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          buttonSizes[size].control,
          iconOnly && buttonSizes[size].iconOnly,
          shape === 'circle' && styles.circle,
          unavailable && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {loading && <ActivityIndicator color={Colors.disabledText} />}
        {!loading && leftIcon}
        {!iconOnly && (
          <AppText
            variant="subtitle"
            style={[
              styles[`${variant}Text`],
              buttonSizes[size].text,
              unavailable && styles.disabledText,
            ]}
          >
            {title}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
}
