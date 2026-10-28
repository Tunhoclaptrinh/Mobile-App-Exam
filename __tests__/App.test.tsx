import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, TextInput } from 'react-native';
import App from '../App';
import {
  AppBottomNav,
  AppButton,
  AppInput,
  AppListItem,
  AppToast,
} from '@/components/common';
import { BookCard } from '@/components/BookCard';
import { CategoryChips } from '@/components/CategoryChips';
import { BookDetailScreen } from '@/screens/BookDetail';
import { BookFormScreen } from '@/screens/BookForm';
import { BookListScreen } from '@/screens/BookList';

let tree: renderer.ReactTestRenderer;
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
afterEach(async () => {
  await act(async () => {
    tree?.unmount();
  });
  jest.restoreAllMocks();
});

test('discard protection keeps an edited form until the user confirms leaving', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount();
  await act(async () => {
    button('+ Thêm sách').props.onPress();
  });
  const form = tree.root.findByType(BookFormScreen);
  await act(async () => {
    form.findAllByType(AppInput)[0].props.onChangeText('Chưa lưu');
  });
  await act(async () => {
    form.props.navigation.goBack();
  });
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(1);
  expect(alert).toHaveBeenLastCalledWith(
    'Bỏ thay đổi?',
    expect.any(String),
    expect.any(Array),
  );
  const actions = alert.mock.calls.at(-1)![2]!;
  expect(actions.find(item => item.text === 'Tiếp tục nhập')?.style).toBe(
    'cancel',
  );
  await act(async () => {
    actions.find(item => item.text === 'Bỏ thay đổi')!.onPress!();
  });
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(0);
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
});

test('corrupt data can only be replaced with samples after confirmation', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await AsyncStorage.setItem('@LibraryApp/books:v1', 'corrupt');
  await mount();
  await act(async () => {
    button('Khôi phục dữ liệu mẫu').props.onPress();
  });
  expect(await AsyncStorage.getItem('@LibraryApp/books:v1')).toBe('corrupt');
  const actions = alert.mock.calls.at(-1)![2]!;
  await act(async () => {
    actions.find(item => item.text === 'Khôi phục')!.onPress!();
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
  expect(await AsyncStorage.getItem('@LibraryApp/books:recovery:v1')).toBe(
    'corrupt',
  );
});

test('failed saves retain the form contents and can be retried', async () => {
  await mount();
  await act(async () => {
    button('+ Thêm sách').props.onPress();
  });
  const form = tree.root.findByType(BookFormScreen);
  const fields: Record<string, string> = {
    'Tên sách': 'Giữ nội dung',
    'Tác giả': 'Tác giả',
    'Năm xuất bản': '2024',
    'Tổng số cuốn': '2',
  };
  await act(async () => {
    form
      .findAllByType(AppInput)
      .forEach(item => item.props.onChangeText(fields[item.props.label]));
  });
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await button('Lưu sách').props.onPress();
  });
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(1);
  expect(form.findAllByType(AppInput)[0].props.value).toBe('Giữ nội dung');
  expect(tree.root.findByType(AppToast).props.type).toBe('error');
  await act(async () => {
    await button('Lưu sách').props.onPress();
  });
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(0);
  expect(tree.root.findAllByType(BookCard)).toHaveLength(6);
});

test('navigation stays on the form while a save is pending', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount();
  await act(async () => {
    button('+ Thêm sách').props.onPress();
  });
  const form = tree.root.findByType(BookFormScreen);
  const fields: Record<string, string> = {
    'Tên sách': 'Đang lưu',
    'Tác giả': 'Tác giả',
    'Năm xuất bản': '2024',
    'Tổng số cuốn': '1',
  };
  await act(async () => {
    form
      .findAllByType(AppInput)
      .forEach(item => item.props.onChangeText(fields[item.props.label]));
  });
  let release!: () => void;
  let saving!: Promise<void>;
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(
    () =>
      new Promise<void>(resolve => {
        release = resolve;
      }),
  );
  await act(async () => {
    saving = button('Lưu sách').props.onPress();
  });
  try {
    await act(async () => {
      form.props.navigation.goBack();
    });
    expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(1);
    expect(alert).not.toHaveBeenCalled();
  } finally {
    await act(async () => {
      release();
      await saving;
    });
  }
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(0);
});

async function mount(): Promise<void> {
  await act(async () => {
    tree = renderer.create(<App />);
  });
}

function button(title: string): renderer.ReactTestInstance {
  return (
    tree.root
      .findAllByType(AppButton)
      .find(item => item.props.title === title) ??
    tree.root
      .findAllByType(AppListItem)
      .find(item => item.props.title === title)!
  );
}

test('renders five book cards and combines search with the selected category', async () => {
  await mount();
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
  const search = tree.root.findByType(AppInput).findByType(TextInput);
  await act(async () => {
    search.props.onChangeText('TÔ HOÀI');
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(1);
  await act(async () => {
    tree.root.findByType(CategoryChips).props.onChange('Khoa học');
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(0);
});

test('shared form validates, adds and edits; details enforce borrowing boundaries', async () => {
  await mount();
  await act(async () => {
    button('+ Thêm sách').props.onPress();
  });
  expect(tree.root.findAllByType(BookFormScreen)).toHaveLength(1);
  await act(async () => {
    await button('Lưu sách').props.onPress();
  });
  expect(
    tree.root.findAllByType(AppInput).filter(item => item.props.error),
  ).toHaveLength(4);
  const form = tree.root.findByType(BookFormScreen);
  const fields: Record<string, string> = {
    'Tên sách': 'Sách giao diện',
    'Tác giả': 'Người viết',
    'Năm xuất bản': '2024',
    'Tổng số cuốn': '1',
  };
  await act(async () => {
    form.findAllByType(AppInput).forEach(item => {
      item.props.onChangeText(fields[item.props.label]);
    });
  });
  await act(async () => {
    await button('Lưu sách').props.onPress();
  });
  const added = tree.root
    .findAllByType(BookCard)
    .find(item => item.props.book.title === 'Sách giao diện')!;
  expect(tree.root.findByType(AppToast).props.message).toBe(
    'Đã thêm sách vào thư viện.',
  );
  await act(async () => {
    added.props.onPress();
  });
  expect(tree.root.findAllByType(BookDetailScreen)).toHaveLength(1);
  expect(button('Nhận trả').props.disabled).toBe(true);
  await act(async () => {
    button('Cho mượn').props.onPress();
  });
  expect(button('Cho mượn').props.disabled).toBe(true);
  expect(button('Nhận trả').props.disabled).toBe(false);
  await act(async () => {
    button('Sửa sách').props.onPress();
  });
  const editForm = tree.root.findByType(BookFormScreen);
  const title = editForm
    .findAllByType(AppInput)
    .find(item => item.props.label === 'Tên sách')!;
  expect(title.props.value).toBe('Sách giao diện');
  await act(async () => {
    title.props.onChangeText('Tên đã sửa');
  });
  await act(async () => {
    await button('Lưu sách').props.onPress();
  });
  await act(async () => {
    button('Nhận trả').props.onPress();
  });
  expect(button('Nhận trả').props.disabled).toBe(true);
});

test('bottom dock filters borrowed books and keeps selection after opening details', async () => {
  await mount();
  await act(async () => {
    tree.root.findByType(AppBottomNav).props.onChange('borrowed');
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(3);
  expect(tree.root.findByType(AppBottomNav).props.activeKey).toBe('borrowed');
  await act(async () => {
    tree.root.findAllByType(BookCard)[0].props.onPress();
  });
  await act(async () => {
    tree.root.findByType(BookDetailScreen).props.navigation.goBack();
  });
  expect(tree.root.findByType(AppBottomNav).props.activeKey).toBe('borrowed');
  await act(async () => {
    tree.root.findByType(AppBottomNav).props.onChange('all');
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
});

test('long press asks for confirmation, cancel preserves data and borrowed books cannot be deleted', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount();
  const borrowed = tree.root
    .findAllByType(BookCard)
    .find(item => item.props.book.id === 'seed-1')!;
  await act(async () => {
    borrowed.props.onLongPress();
  });
  expect(alert).toHaveBeenLastCalledWith(
    'Không thể thực hiện',
    expect.stringContaining('đang có người mượn'),
  );
  const available = tree.root
    .findAllByType(BookCard)
    .find(item => item.props.book.id === 'seed-2')!;
  await act(async () => {
    available.props.onLongPress();
  });
  const buttons = alert.mock.calls.at(-1)![2]!;
  expect(buttons.find(item => item.text === 'Huỷ')?.style).toBe('cancel');
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
  await act(async () => {
    buttons.find(item => item.text === 'Xoá')!.onPress!();
  });
  expect(tree.root.findAllByType(BookCard)).toHaveLength(4);
  expect(tree.root.findByType(BookListScreen)).toBeTruthy();
  alert.mockRestore();
});

test('swipe menus open one row at a time, edit uses the shared form and delete still confirms', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount();
  let cards = tree.root.findAllByType(BookCard);
  await act(async () => {
    cards[0].props.onSwipeOpenChange(true);
  });
  cards = tree.root.findAllByType(BookCard);
  expect(cards.filter(card => card.props.swipeOpen)).toHaveLength(1);
  await act(async () => {
    cards[1].props.onSwipeOpenChange(true);
  });
  cards = tree.root.findAllByType(BookCard);
  expect(cards[0].props.swipeOpen).toBe(false);
  expect(cards[1].props.swipeOpen).toBe(true);
  await act(async () => {
    cards[1].props.onEdit();
  });
  const form = tree.root.findByType(BookFormScreen);
  expect(form.findAllByType(AppInput)[0].props.value).toBe(
    cards[1].props.book.title,
  );
  await act(async () => {
    form.props.navigation.goBack();
  });
  cards = tree.root.findAllByType(BookCard);
  expect(cards.every(card => !card.props.swipeOpen)).toBe(true);
  await act(async () => {
    cards[1].props.onSwipeOpenChange(true);
  });
  const { AppSwipeableRow } = require('@/components/common/AppSwipeableRow');
  const row = tree.root.findAllByType(AppSwipeableRow)[1];
  const remove = row.findAll(
    node =>
      node.props.accessibilityLabel === `Xoá ${cards[1].props.book.title}` &&
      typeof node.props.style === 'function',
  )[0];
  await act(async () => {
    remove.props.onPress();
  });
  expect(alert).toHaveBeenLastCalledWith(
    'Xoá sách?',
    expect.any(String),
    expect.any(Array),
  );
  expect(tree.root.findAllByType(BookCard)).toHaveLength(5);
});
