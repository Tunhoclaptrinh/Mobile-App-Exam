export type IconName =
  | 'book'
  | 'grid'
  | 'clock'
  | 'plus'
  | 'chevron'
  | 'back'
  | 'search'
  | 'close'
  | 'check'
  | 'info'
  | 'edit'
  | 'trash'
  | 'borrow'
  | 'return';
export type IconTone =
  | 'primary'
  | 'secondary'
  | 'white'
  | 'success'
  | 'error'
  | 'purple'
  | 'teal';
export interface AppIconProps {
  name: IconName;
  tone?: IconTone;
  size?: 'sm' | 'md' | 'lg' | number;
}
