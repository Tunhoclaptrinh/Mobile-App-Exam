export type BadgeTone = 'primary' | 'success' | 'error' | 'purple' | 'teal';
export interface AppBadgeProps {
  label: string;
  tone?: BadgeTone;
}
