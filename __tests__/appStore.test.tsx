import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStoreProvider, useAppStore } from '@/hooks/useAppStore';
import type { BookInput } from '@/types/book';
import { BOOKS_STORAGE_KEY } from '@/services/booksStorage';

let store: ReturnType<typeof useAppStore>;
let tree: renderer.ReactTestRenderer;
const input: BookInput = {
  title: 'Sách kiểm thử',
  author: 'Tác giả',
  category: 'Khoa học',
  year: 2020,
  quantity: 2,
};

function Consumer(): null {
  store = useAppStore();
  return null;
}

async function mount(): Promise<void> {
  await act(async () => {
    tree = renderer.create(
      <AppStoreProvider>
        <Consumer />
      </AppStoreProvider>,
    );
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
afterEach(async () => {
  await act(async () => {
    tree?.unmount();
  });
});

test('add, edit, borrow, return and delete persist across provider remount', async () => {
  await mount();
  expect(store.books).toHaveLength(5);
  await act(async () => {
    await store.addBook(input);
  });
  const id = store.books[0].id;
  expect(store.books[0].borrowed).toBe(0);
  await act(async () => {
    await store.borrowBook(id);
  });
  await act(async () => {
    await store.updateBook(id, { ...input, title: 'Tên mới' });
  });
  expect(store.books[0]).toMatchObject({ id, title: 'Tên mới', borrowed: 1 });
  await act(async () => {
    tree.unmount();
  });
  await mount();
  expect(store.books[0]).toMatchObject({ id, title: 'Tên mới', borrowed: 1 });
  await act(async () => {
    await store.returnBook(id);
  });
  await act(async () => {
    await store.deleteBook(id);
  });
  expect(store.books).toHaveLength(5);
  expect(
    JSON.parse((await AsyncStorage.getItem(BOOKS_STORAGE_KEY))!).books.some(
      (book: { id: string }) => book.id === id,
    ),
  ).toBe(false);
});

test('failed saves leave in-memory and persisted books unchanged', async () => {
  await mount();
  const previous = store.books;
  const persisted = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await expect(store.addBook(input)).rejects.toThrow('Không thể lưu');
  });
  expect(store.books).toBe(previous);
  expect(await AsyncStorage.getItem(BOOKS_STORAGE_KEY)).toBe(persisted);
  expect(store.busy).toBe(false);
});

test('blocks duplicate overlapping writes to avoid stale state', async () => {
  await mount();
  await act(async () => {
    const first = store.borrowBook('seed-1');
    await expect(store.borrowBook('seed-1')).rejects.toThrow('chờ');
    await first;
  });
  expect(store.books.find(book => book.id === 'seed-1')?.borrowed).toBe(3);
});

test('store guards deletion and quantity rules even outside a screen', async () => {
  await mount();
  await act(async () => {
    await expect(store.deleteBook('seed-1')).rejects.toThrow('Không thể xoá');
  });
  await act(async () => {
    await expect(
      store.updateBook('seed-1', { ...input, quantity: 1 }),
    ).rejects.toThrow('nhỏ hơn');
  });
  expect(store.books).toHaveLength(5);
});

test('load failures expose a retry and never overwrite the saved library', async () => {
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, 'invalid data');
  await mount();
  expect(store.error).toBeTruthy();
  expect(store.loading).toBe(false);
  expect(await AsyncStorage.getItem(BOOKS_STORAGE_KEY)).toBe('invalid data');
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, '[]');
  await act(async () => {
    await store.reload();
  });
  expect(store.error).toBeNull();
  expect(store.books).toEqual([]);
});

test('book updates normalize text and cannot overwrite id or borrowed through extra properties', async () => {
  await mount();
  const payload = {
    ...input,
    title: '  Sách sạch  ',
    author: '  Tác giả  ',
    quantity: 5,
    id: 'unexpected-id',
    borrowed: 0,
  };
  await act(async () => {
    await store.updateBook('seed-1', payload);
  });
  expect(store.books.find(book => book.id === 'seed-1')).toMatchObject({
    title: 'Sách sạch',
    author: 'Tác giả',
    borrowed: 2,
  });
  expect(store.books.some(book => book.id === 'unexpected-id')).toBe(false);
});

test('newer schema data cannot be reset through the store recovery action', async () => {
  const future = JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    books: [],
  });
  await AsyncStorage.setItem(BOOKS_STORAGE_KEY, future);
  await mount();
  expect(store.canRestoreSamples).toBe(false);
  await act(async () => {
    await store.restoreSamples();
  });
  expect(await AsyncStorage.getItem(BOOKS_STORAGE_KEY)).toBe(future);
});
