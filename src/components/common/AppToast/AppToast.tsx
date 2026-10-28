import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Motion, ToastMetrics } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AppIcon } from '../AppIcon';
import { AppText } from '../AppText';
import type { AppToastProps } from './types';
import {
  closeHitSlop,
  createToastAnimation,
  createToastPosition,
  styles,
} from './styles';

// Adapted base AppToast: spring entry, fade/slide exit, pill and type feedback.
export function AppToast({
  visible,
  onDismiss,
  message,
  title,
  type = 'info',
  duration = Motion.toastDuration,
}: AppToastProps): React.JSX.Element {
  const { top } = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-80)).current;
  const position = useMemo(() => createToastPosition(top), [top]);
  const animation = useMemo(
    () => createToastAnimation(opacity, translateY),
    [opacity, translateY],
  );
  const dismiss = useCallback(() => {
    if (reduced) {
      onDismiss();
      return;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onDismiss();
      }
    });
  }, [reduced, onDismiss, opacity, translateY]);

  useEffect(() => {
    if (!visible) {
      dismiss();
      return () => {
        opacity.stopAnimation();
        translateY.stopAnimation();
      };
    }
    AccessibilityInfo.announceForAccessibility(
      [title, message].filter(Boolean).join('. '),
    );
    if (reduced) {
      opacity.setValue(1);
      translateY.setValue(0);
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    const timer = setTimeout(dismiss, duration);
    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
  }, [
    visible,
    title,
    message,
    duration,
    reduced,
    opacity,
    translateY,
    dismiss,
  ]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, position, animation]}
    >
      <View
        accessibilityLiveRegion="polite"
        style={[styles.pill, styles[type]]}
      >
        <AppIcon
          name={type === 'success' ? 'check' : 'info'}
          size={ToastMetrics.icon}
          tone={
            type === 'success'
              ? 'success'
              : type === 'error'
              ? 'error'
              : 'primary'
          }
        />
        <View style={styles.text}>
          {title && <AppText style={styles.title}>{title}</AppText>}
          <AppText style={styles.message}>{message}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng thông báo"
          onPress={dismiss}
          hitSlop={closeHitSlop}
          style={styles.close}
        >
          <AppIcon name="close" tone="secondary" size="sm" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
