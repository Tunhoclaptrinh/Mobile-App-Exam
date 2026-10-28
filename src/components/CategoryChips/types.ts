import type { BookCategory } from '@/types/book';

export type CategoryValue = BookCategory | 'Tất cả';
export interface CategoryChipsProps {
  value: CategoryValue;
  onChange: (value: CategoryValue) => void;
  showAll?: boolean;
  disabled?: boolean;
  scrollable?: boolean;
}
