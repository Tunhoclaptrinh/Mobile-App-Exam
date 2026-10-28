import type { TextInputProps } from 'react-native';
import type { ReactNode } from 'react';
import type { ControlSizeKey } from '@/constants';

export interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  hideLabel?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ControlSizeKey;
}
