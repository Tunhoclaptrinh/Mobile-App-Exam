import type { Book } from '@/types/book';

export interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
  onEdit: () => void;
  swipeOpen: boolean;
  onSwipeOpenChange: (open: boolean) => void;
  disabled?: boolean;
}
