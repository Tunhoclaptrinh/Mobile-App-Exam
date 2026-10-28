import type { ScreenWrapperProps } from '../ScreenWrapper/types';
import type { AppHeaderProps } from '../AppHeader';

export interface AppScreenLayoutProps
  extends Omit<ScreenWrapperProps, 'header'> {
  header: AppHeaderProps;
}
