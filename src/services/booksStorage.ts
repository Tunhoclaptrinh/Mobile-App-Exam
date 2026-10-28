import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_BOOKS } from '@/data/seedBooks';
import type { Book } from '@/types/book';
import { isBook } from '@/utils/books';

// Keep the original key so existing installations migrate without losing data.
export const BOOKS_STORAGE_KEY = '@LibraryApp/books:v1';
export const BOOKS_BACKUP_KEY = '@LibraryApp/books:backup:v1';
export const BOOKS_RECOVERY_KEY = '@LibraryApp/books:recovery:v1';
const SCHEMA_VERSION = 1;

export class LibraryDataError extends Error {
  constructor(
    public readonly kind: 'corrupt' | 'unsupported',
    message: string,
  ) {
    super(message);
    this.name = 'LibraryDataError';
  }
}

interface Snapshot {
  schemaVersion: number;
  savedAt: string;
  books: Book[];
}
export interface LibrarySnapshot {
  books: Book[];
  recovered: boolean;
}

function assertBooks(value: unknown): asserts value is Book[] {
  if (
    !Array.isArray(value) ||
    !value.every(isBook) ||
    new Set(value.map(book => book.id)).size !== value.length
  ) {
    throw new LibraryDataError('corrupt', 'Dữ liệu sách đã lưu không hợp lệ.');
  }
}

function decode(raw: string): { books: Book[]; legacy: boolean } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new LibraryDataError(
      'corrupt',
      'Không thể đọc định dạng dữ liệu sách.',
    );
  }
  if (Array.isArray(parsed)) {
    assertBooks(parsed);
    return { books: parsed, legacy: true };
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new LibraryDataError('corrupt', 'Dữ liệu thư viện không hợp lệ.');
  }
  const snapshot = parsed as Partial<Snapshot>;
  if (
    typeof snapshot.schemaVersion === 'number' &&
    snapshot.schemaVersion > SCHEMA_VERSION
  ) {
    throw new LibraryDataError(
      'unsupported',
      'Dữ liệu thuộc phiên bản mới hơn. Vui lòng cập nhật ứng dụng để mở.',
    );
  }
  if (
    snapshot.schemaVersion !== SCHEMA_VERSION ||
    typeof snapshot.savedAt !== 'string' ||
    !Number.isFinite(Date.parse(snapshot.savedAt))
  ) {
    throw new LibraryDataError('corrupt', 'Dữ liệu thư viện không hợp lệ.');
  }
  assertBooks(snapshot.books);
  return { books: snapshot.books, legacy: false };
}

function encode(books: Book[]): string {
  assertBooks(books);
  const snapshot: Snapshot = {
    schemaVersion: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    books,
  };
  return JSON.stringify(snapshot);
}

// Serialize reads/writes across provider remounts as well as within one store.
let pending: Promise<unknown> = Promise.resolve();
function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation, operation);
  pending = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function writeBooks(
  books: Book[],
  previous: string | null,
): Promise<void> {
  const next = encode(books);
  if (previous !== null) {
    decode(previous);
  }
  // Preserve a validated snapshot before replacing the primary key.
  await AsyncStorage.setItem(BOOKS_BACKUP_KEY, previous ?? next);
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, next);
}

export function saveBooks(books: Book[]): Promise<void> {
  return exclusive(async () => {
    const previous = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    await writeBooks(books, previous);
  });
}

export function loadLibrary(): Promise<LibrarySnapshot> {
  return exclusive(async () => {
    const raw = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    if (raw !== null) {
      try {
        const snapshot = decode(raw);
        if (snapshot.legacy) {
          await writeBooks(snapshot.books, raw);
        }
        return { books: snapshot.books, recovered: false };
      } catch (error) {
        if (
          !(error instanceof LibraryDataError) ||
          error.kind === 'unsupported'
        ) {
          throw error;
        }
      }
    }
    const backup = await AsyncStorage.getItem(BOOKS_BACKUP_KEY);
    if (backup !== null) {
      const snapshot = decode(backup);
      if (raw !== null) {
        await AsyncStorage.setItem(BOOKS_RECOVERY_KEY, raw);
      }
      await AsyncStorage.setItem(BOOKS_STORAGE_KEY, encode(snapshot.books));
      return { books: snapshot.books, recovered: true };
    }
    if (raw !== null) {
      throw new LibraryDataError(
        'corrupt',
        'Dữ liệu thư viện bị lỗi và chưa có bản sao để khôi phục.',
      );
    }
    const books = SEED_BOOKS.map(book => ({ ...book }));
    await writeBooks(books, null);
    return { books, recovered: false };
  });
}

export async function loadBooks(): Promise<Book[]> {
  return (await loadLibrary()).books;
}

// Only call after an explicit destructive confirmation in the recovery UI.
export function restoreSampleBooks(): Promise<Book[]> {
  return exclusive(async () => {
    const raw = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    if (raw !== null) {
      await AsyncStorage.setItem(BOOKS_RECOVERY_KEY, raw);
    }
    const books = SEED_BOOKS.map(book => ({ ...book }));
    await writeBooks(books, null);
    return books;
  });
}
