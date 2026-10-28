import { AppRadii, Colors } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createSwipeableStyles } from './styles';

const styles = createSwipeableStyles(Colors, AppRadii.card, AppRadii.control);
export function useSwipeableAppearance() {
  return { styles, reducedMotion: useReducedMotion() };
}
