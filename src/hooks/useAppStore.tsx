import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import type { Book, BookInput } from '@/types/book';
import {
  LibraryDataError,
  loadLibrary,
  restoreSampleBooks,
  saveBooks,
} from '@/services/booksStorage';
import {
  normalizeBookInput,
  assertCanDelete,
  changeBorrowed,
} from '@/utils/books';

interface AppStore {
  books: Book[];
  loading: boolean;
  busy: boolean;
  error: string | null;
  recovered: boolean;
  canRestoreSamples: boolean;
  reload: () => Promise<void>;
  restoreSamples: () => Promise<void>;
  addBook: (input: BookInput) => Promise<void>;
  updateBook: (id: string, input: BookInput) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (id: string) => Promise<void>;
  returnBook: (id: string) => Promise<void>;
}

const StoreContext = createContext<AppStore | null>(null);

function findBook(books: Book[], id: string): Book {
  const book = books.find(item => item.id === id);
  if (!book) {
    throw new Error('Không tìm thấy sách.');
  }
  return book;
}

export function AppStoreProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recovered, setRecovered] = useState(false);
  const [canRestoreSamples, setCanRestoreSamples] = useState(false);
  const booksRef = useRef<Book[]>([]);
  const locked = useRef(false);
  const ready = useRef(false);
  const mounted = useRef(true);

  const reload = useCallback(async () => {
    if (locked.current) {
      return;
    }
    locked.current = true;
    ready.current = false;
    setLoading(true);
    setError(null);
    setCanRestoreSamples(false);
    try {
      const snapshot = await loadLibrary();
      if (!mounted.current) {
        return;
      }
      const stored = snapshot.books;
      booksRef.current = stored;
      setBooks(stored);
      setRecovered(snapshot.recovered);
      ready.current = true;
    } catch (cause) {
      if (!mounted.current) {
        return;
      }
      setError(
        cause instanceof LibraryDataError
          ? cause.message
          : 'Không thể đọc dữ liệu thư viện. Vui lòng thử lại.',
      );
      setCanRestoreSamples(
        cause instanceof LibraryDataError && cause.kind === 'corrupt',
      );
    } finally {
      locked.current = false;
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const restoreSamples = useCallback(async () => {
    if (locked.current || ready.current || !canRestoreSamples) {
      return;
    }
    locked.current = true;
    setLoading(true);
    try {
      const stored = await restoreSampleBooks();
      if (!mounted.current) {
        return;
      }
      booksRef.current = stored;
      setBooks(stored);
      setError(null);
      setRecovered(false);
      setCanRestoreSamples(false);
      ready.current = true;
    } catch {
      if (!mounted.current) {
        return;
      }
      setError('Không thể khôi phục dữ liệu mẫu. Vui lòng thử lại.');
    } finally {
      locked.current = false;
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [canRestoreSamples]);

  useEffect(() => {
    mounted.current = true;
    reload();
    return () => {
      mounted.current = false;
      ready.current = false;
    };
  }, [reload]);

  const commit = useCallback(async (mutate: (current: Book[]) => Book[]) => {
    if (!ready.current) {
      throw new Error('Dữ liệu thư viện chưa sẵn sàng.');
    }
    if (locked.current) {
      throw new Error('Vui lòng chờ thao tác trước hoàn tất.');
    }
    locked.current = true;
    setBusy(true);
    try {
      const next = mutate(booksRef.current);
      try {
        await saveBooks(next);
      } catch {
        throw new Error('Không thể lưu thay đổi. Vui lòng thử lại.');
      }
      // Publish only after storage succeeds; failed writes keep the previous state.
      booksRef.current = next;
      if (mounted.current) {
        setBooks(next);
      }
    } finally {
      locked.current = false;
      if (mounted.current) {
        setBusy(false);
      }
    }
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      books,
      loading,
      busy,
      error,
      recovered,
      canRestoreSamples,
      reload,
      restoreSamples,
      addBook: input =>
        commit(current => {
          const safeInput = normalizeBookInput(input);
          let id: string;
          do {
            id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
          } while (current.some(book => book.id === id));
          return [{ ...safeInput, id, borrowed: 0 }, ...current];
        }),
      updateBook: (id, input) =>
        commit(current => {
          const book = findBook(current, id);
          const safeInput = normalizeBookInput(input, book.borrowed);
          return current.map(item =>
            item.id === id ? { ...book, ...safeInput } : item,
          );
        }),
      deleteBook: id =>
        commit(current => {
          assertCanDelete(findBook(current, id));
          return current.filter(book => book.id !== id);
        }),
      borrowBook: id =>
        commit(current => {
          const updated = changeBorrowed(findBook(current, id), 1);
          return current.map(book => (book.id === id ? updated : book));
        }),
      returnBook: id =>
        commit(current => {
          const updated = changeBorrowed(findBook(current, id), -1);
          return current.map(book => (book.id === id ? updated : book));
        }),
    }),
    [
      books,
      loading,
      busy,
      error,
      recovered,
      canRestoreSamples,
      reload,
      restoreSamples,
      commit,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useAppStore(): AppStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useAppStore phải nằm trong AppStoreProvider.');
  }
  return store;
}
