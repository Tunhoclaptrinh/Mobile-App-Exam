import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { AppToast } from './AppToast';
import type { ToastContextType, ToastOptions, ToastType } from './types';

const Context = createContext<ToastContextType | null>(null);
const types: ToastType[] = ['success', 'error', 'warning', 'info'];

// Preserve the base public API; replacing a toast unmounts and cancels its timer.
export function ToastProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [current, setCurrent] = useState<{
    id: number;
    options: ToastOptions;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const sequence = useRef(0);
  const activeId = useRef<number | null>(null);
  const show = useCallback<ToastContextType['show']>(
    (typeOrOptions, message, title) => {
      const options: ToastOptions =
        typeof typeOrOptions === 'object'
          ? typeOrOptions
          : types.includes(typeOrOptions as ToastType)
          ? { type: typeOrOptions as ToastType, message: message ?? '', title }
          : { type: 'info', message: typeOrOptions, title };
      const id = ++sequence.current;
      activeId.current = id;
      setCurrent({ id, options });
      setVisible(true);
    },
    [],
  );
  const hide = useCallback(() => setVisible(false), []);
  const dismiss = useCallback(() => {
    if (!current || activeId.current !== current.id) {
      return;
    }
    activeId.current = null;
    setCurrent(previous => (previous?.id === current.id ? null : previous));
    current.options.onClose?.();
  }, [current]);
  const value = useMemo<ToastContextType>(
    () => ({
      show,
      hide,
      success: (message, title) => show('success', message, title),
      error: (message, title) => show('error', message, title),
      warning: (message, title) => show('warning', message, title),
      info: (message, title) => show('info', message, title),
    }),
    [show, hide],
  );
  return (
    <Context.Provider value={value}>
      {children}
      {current && (
        <AppToast
          key={current.id}
          {...current.options}
          visible={visible}
          onDismiss={dismiss}
        />
      )}
    </Context.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useToast phải nằm trong ToastProvider.');
  }
  return context;
}
