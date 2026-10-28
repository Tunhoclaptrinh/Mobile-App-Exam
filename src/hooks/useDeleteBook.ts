import { Alert } from 'react-native';
import type { Book } from '@/types/book';
import { assertCanDelete } from '@/utils/books';
import { showOperationError } from '@/utils/alerts';
import { useAppStore } from './useAppStore';
import { useToast } from '@/components/common/AppToast';

export function useDeleteBook(): (book: Book, onDeleted?: () => void) => void {
  const { deleteBook } = useAppStore();
  const toast = useToast();
  return (book, onDeleted) => {
    try {
      assertCanDelete(book);
    } catch (error) {
      showOperationError(error);
      return;
    }

    Alert.alert('Xoá sách?', `Bạn có chắc muốn xoá “${book.title}”?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          deleteBook(book.id)
            .then(() => {
              toast.success('Đã xoá sách khỏi thư viện.');
              onDeleted?.();
            })
            .catch(showOperationError);
        },
      },
    ]);
  };
}
