import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_BOOKS } from '@/data/seedBooks';
import {
  BOOKS_STORAGE_KEY,
  BOOKS_BACKUP_KEY,
  BOOKS_RECOVERY_KEY,
  loadLibrary,
  loadBooks,
  restoreSampleBooks,
  saveBooks,
} from '@/services/booksStorage';

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

test('first launch creates and persists at least five sample books', async () => {
  const books = await loadBooks();
  expect(books.length).toBeGreaterThanOrEqual(5);
  expect(
    JSON.parse((await AsyncStorage.getItem(BOOKS_STORAGE_KEY))!).books,
  ).toEqual(books);
});

test('migrates the previous array format without changing books', async () => {
  const books = [{ ...SEED_BOOKS[0], title: 'Dữ liệu cũ', borrowed: 1 }];
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  expect(await loadBooks()).toEqual(books);
  expect(
    JSON.parse((await AsyncStorage.getItem(BOOKS_STORAGE_KEY))!),
  ).toMatchObject({ schemaVersion: 1, books });
});

test('recovers the previous valid snapshot and preserves the corrupt primary', async () => {
  await saveBooks(SEED_BOOKS);
  await saveBooks([{ ...SEED_BOOKS[0], title: 'Lần sửa gần nhất' }]);
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, '{broken');
  const recovered = await loadLibrary();
  expect(recovered).toEqual({ books: SEED_BOOKS, recovered: true });
  expect(await AsyncStorage.getItem(BOOKS_RECOVERY_KEY)).toBe('{broken');
  expect(await loadLibrary()).toEqual({ books: SEED_BOOKS, recovered: false });
});

test('missing primary recovers an empty backup instead of seeding samples', async () => {
  await AsyncStorage.setItem(BOOKS_BACKUP_KEY, '[]');
  expect(await loadLibrary()).toEqual({ books: [], recovered: true });
});

test('never rolls back or overwrites a schema from a newer app', async () => {
  await saveBooks(SEED_BOOKS);
  const future = JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    books: [],
  });
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, future);
  await expect(loadLibrary()).rejects.toMatchObject({ kind: 'unsupported' });
  expect(await AsyncStorage.getItem(BOOKS_STORAGE_KEY)).toBe(future);
});

test('a failed primary write leaves the old data and backup usable', async () => {
  await saveBooks(SEED_BOOKS);
  const write = jest.mocked(AsyncStorage.setItem).getMockImplementation()!;
  jest
    .mocked(AsyncStorage.setItem)
    .mockImplementationOnce(write)
    .mockRejectedValueOnce(new Error('disk full'));
  await expect(saveBooks([])).rejects.toThrow('disk full');
  expect(await loadBooks()).toEqual(SEED_BOOKS);
  expect(await AsyncStorage.getItem(BOOKS_BACKUP_KEY)).toBeTruthy();
});

test('explicit sample recovery archives bad data and preserves unrelated storage', async () => {
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, 'corrupt');
  await AsyncStorage.setItem('unrelated-setting', 'keep');
  expect(await restoreSampleBooks()).toEqual(SEED_BOOKS);
  expect(await AsyncStorage.getItem(BOOKS_RECOVERY_KEY)).toBe('corrupt');
  expect(await AsyncStorage.getItem('unrelated-setting')).toBe('keep');
  expect(await loadBooks()).toEqual(SEED_BOOKS);
});

test('existing data survives reload and is not replaced by samples', async () => {
  const books = [{ ...SEED_BOOKS[0], title: 'Đã cập nhật', borrowed: 3 }];
  await saveBooks(books);
  expect(await loadBooks()).toEqual(books);
});

test('an intentionally empty library stays empty after restart', async () => {
  await saveBooks([]);
  expect(await loadBooks()).toEqual([]);
});

test.each([
  '{bad json',
  '[{}]',
  JSON.stringify([{ ...SEED_BOOKS[0], borrowed: 100 }]),
  JSON.stringify([SEED_BOOKS[0], SEED_BOOKS[0]]),
])('rejects corrupted data without overwriting it', async raw => {
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, raw);
  await expect(loadBooks()).rejects.toThrow();
  expect(await AsyncStorage.getItem(BOOKS_STORAGE_KEY)).toBe(raw);
});

test('storage read and write errors propagate to the app', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockRejectedValueOnce(new Error('read error'));
  await expect(loadBooks()).rejects.toThrow('read error');
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('write error'));
  await expect(saveBooks([])).rejects.toThrow('write error');
});
