export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface ToastOptions {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}
export interface AppToastProps extends ToastOptions {
  visible: boolean;
  onDismiss: () => void;
}
export interface ToastContextType {
  show: (
    typeOrOptions: ToastType | ToastOptions | string,
    message?: string,
    title?: string,
  ) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  hide: () => void;
}
