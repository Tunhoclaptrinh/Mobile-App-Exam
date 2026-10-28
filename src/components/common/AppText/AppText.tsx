import React from 'react';
import { Text } from 'react-native';
import type { AppTextProps } from './types';
import { styles } from './styles';

export function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...props
}: AppTextProps): React.JSX.Element {
  return <Text style={[styles[variant], styles[tone], style]} {...props} />;
}
