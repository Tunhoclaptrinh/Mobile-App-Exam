import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Colors } from '@/constants';
import { AppText } from '../AppText';
import type { AppInputProps } from './types';
import { inputSizes, styles } from './styles';

export function AppInput({
  label,
  error,
  style,
  onFocus,
  onBlur,
  hideLabel = false,
  leftIcon,
  rightIcon,
  size = 'md',
  ...props
}: AppInputProps): React.JSX.Element {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrapper}>
      {!hideLabel && (
        <AppText variant="caption" tone="secondary">
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputRow,
          inputSizes[size].container,
          focused && styles.focused,
          !!error && styles.invalid,
          props.editable === false && styles.disabled,
        ]}
      >
        {leftIcon}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={Colors.disabledText}
          {...props}
          style={[styles.input, inputSizes[size].text, style]}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        {rightIcon}
      </View>
      {!!error && (
        <AppText
          variant="caption"
          tone="error"
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      )}
    </View>
  );
}
