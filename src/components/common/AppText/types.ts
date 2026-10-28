import type { TextProps } from 'react-native';
import type { Typography } from '@/constants';

export interface AppTextProps extends TextProps {
  variant?: keyof typeof Typography;
  tone?: 'default' | 'secondary' | 'error' | 'success' | 'primary';
}
