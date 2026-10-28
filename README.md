# LibraryApp — Quản lý thư viện

Ứng dụng React Native CLI + TypeScript cho [Đề 1](De1_QuanLyThuVien.md), phát triển từ bộ khung tại `../ReactNative`. Đã triển khai đủ luồng danh sách, thêm/sửa, xoá, chi tiết, mượn/trả, tìm kiếm/lọc và lưu dữ liệu.

## Component base và giao diện Apple

- Giữ bộ khung native CLI, cấu hình `LibraryApp` và Android package `com.libraryapp`.
- Kế thừa token `AppleColors` / `AppleGlassTokens` từ `../ReactNative`; card bo 16, control pill theo preset smooth, header/dock capsule, typography và khoảng cách thống nhất.
- Mọi màn hình dùng `AppScreenLayout` → `ScreenWrapper` + `AppHeader`, với header/footer cố định ngoài nội dung cuộn. Form có nút lưu cố định, xử lý safe area và bàn phím.
- Dùng chung `AppCard`, `AppListItem`, `AppDivider`, `AppBadge`, `CupertinoIconTile`, `AppSearchBar`, `AppButton`, `AppInput`, `AppText`, `EmptyState` và `ErrorBoundary`.
- `AppBottomNav` kế thừa dock nổi, indicator lò xo, badge và nút thêm trung tâm. Chuyển Tủ sách / Đang mượn bằng route params Native Stack; giữ lựa chọn khi quay lại từ chi tiết, tự ẩn khi mở bàn phím.
- `ToastProvider` / `useToast` / `AppToast` giữ API base, thông báo khi thêm/sửa/xoá/mượn/trả, animation vào/ra, nút đóng, tự tắt và thông báo trợ năng. Xoá và lỗi xoá sách đang mượn vẫn dùng Alert đúng đề.
- Nền `AppleMeshBackground` giữ bảng màu minimal, dùng gradient radial/linear native của RN 0.87. Card và nút có gradient nhẹ, phản sáng mép và hiệu ứng nhấn; animation tôn trọng Reduce Motion của hệ thống.
- Vẫn chỉ 7 dependency runtime được phép trong đề. Các phần phụ thuộc Lucide/SVG/blur/UI kit của base đã được rút gọn; icon nét được vẽ bằng View native. State sách tiếp tục dùng React Context + AsyncStorage.
- Xem [bản đồ tái sử dụng base](docs/BASE_REUSE.md) để biết nguồn, API giữ lại và phần được điều chỉnh.

Các thang `Spacing`, `BorderRadius`, `RadiusPresets`, `ControlSize`, `Typography`, `Shadows` được sao chép nguyên giá trị từ base và đã đối chiếu tự động. Button/input dùng chung cỡ 36/44/52, không tự đặt chiều cao khác nhau. Xem [bảng kích thước chuẩn](docs/BASE_REUSE.md#kích-thước-đối-chiếu-trực-tiếp-với-base).

## App icon

Biểu tượng sách mở có bookmark trên nền cyan được sinh từ [SVG gốc](assets/branding/library-icon.svg), dùng thống nhất cho Android/iOS. Android có adaptive + monochrome; iOS có đủ asset iPhone/iPad/App Store không alpha. Tái tạo bằng `pnpm icons:generate`, kiểm tra bằng `pnpm icons:check`. Xem [quy chuẩn icon](docs/APP_ICON.md) và [dependency/pnpm](docs/DEPENDENCIES.md).

## Chạy ứng dụng

Node.js **>= 22.13.0**, **pnpm 12.14.0**, JDK và Android SDK theo cấu hình `android/build.gradle` (compile SDK 37, build tools 37.0.0, NDK 27.1.12297006). Khai báo `ANDROID_HOME`, hoặc tạo `android/local.properties` với `sdk.dir` của máy bạn.

```bash
pnpm install --frozen-lockfile
pnpm start
```

pnpm là package manager duy nhất của dự án: `packageManager` được pin trong `package.json`, dependency được khoá bằng `pnpm-lock.yaml`, cấu hình isolated với symlink cho dependency nằm trong `pnpm-workspace.yaml`.

Mở terminal khác, bật emulator hoặc kết nối điện thoại:

```bash
pnpm android
```

Lệnh CLI trực tiếp cũng được hỗ trợ:

```bash
pnpm exec react-native run-android
```

Trên macOS, cài CocoaPods trước khi chạy iOS:

```bash
bundle install
cd ios
bundle exec pod install
cd ..
pnpm ios
```

## Sử dụng

- Lần đầu mở app có 5 đầu sách mẫu, đủ 4 thể loại; có sách hết và sách đang được mượn.
- Tìm theo tên hoặc tác giả, không phân biệt hoa/thường; chọn thể loại để lọc đồng thời.
- Nhấn thẻ sách để xem thông tin và cho mượn/nhận trả từng cuốn. Các nút không hợp lệ bị vô hiệu hoá và chuyển xám.
- Nhấn nút **+** ở giữa dock; dùng **Sửa sách** trong chi tiết để mở cùng một form đã điền sẵn. Lỗi nằm dưới từng ô và được cập nhật khi sửa dữ liệu sau lần bấm lưu.
- Nhấn giữ thẻ hoặc chọn **Xoá sách** ở chi tiết. Mọi thao tác xoá đều qua `Alert`; sách đang mượn được báo lỗi và giữ nguyên.
- Dữ liệu tự lưu bằng AsyncStorage sau mỗi thay đổi. Xoá hết sách rồi mở lại vẫn giữ thư viện rỗng. Lỗi đọc/ghi được báo để thử lại; không tự ghi đè dữ liệu hỏng bằng mẫu.

## Cấu trúc

```text
App.tsx                          # Store + Toast providers, loading/error, navigation
src/
  components/common/             # Header, dock, toast, layout, card, control và mesh
  components/BookCard/            # Thẻ sách, nhấn/nhấn giữ
  components/CategoryChips/       # Chọn thể loại, bộ lọc
  constants/                     # Apple tokens, Colors, Typography, Gradients, Motion
  data/seedBooks.ts               # 5 sách mẫu
  hooks/useAppStore.tsx           # State chung và các thao tác có lưu dữ liệu
  hooks/useDeleteBook.ts          # Alert xác nhận xoá, kiểm tra sách đang mượn
  navigation/                    # Native Stack, route params có kiểu
  screens/BookList/               # FlatList, thống kê, tìm kiếm, lọc
  screens/BookForm/               # Form dùng chung cho thêm và sửa
  screens/BookDetail/             # Thông tin, mượn/trả, sửa/xoá
  services/booksStorage.ts       # AsyncStorage, khởi tạo mẫu lần đầu
  types/book.ts                  # Book, BookInput, thể loại và kiểu form
  utils/books.ts                 # Validation, tìm kiếm và ràng buộc nghiệp vụ
__tests__/                       # Nghiệp vụ, storage, store và luồng giao diện
android/, ios/                   # Native CLI projects
De1_QuanLyThuVien.docx            # Đề gốc
De1_QuanLyThuVien.md              # Đề đã chuyển sang Markdown
```

## Đối chiếu đề

| Câu | Triển khai                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | FlatList, thẻ sách, số còn lại, nhãn đỏ “Hết sách”, tổng đầu sách và tổng cuốn đang mượn                                              |
| 2   | Stack Navigation, form thêm/sửa chung, trim tên/tác giả, năm 1900–năm hiện tại, số nguyên dương, tổng cuốn ≥ số đang mượn, lỗi dưới ô |
| 3   | `onLongPress`, xác nhận Alert, chặn xoá sách đang mượn                                                                                |
| 4   | Đầy đủ trường Book, tăng/giảm borrowed, disabled và màu xám khi không hợp lệ                                                          |
| 5   | Tìm tên/tác giả không phân biệt hoa/thường, 5 bộ lọc gồm Tất cả, phối hợp tìm kiếm và lọc                                             |
| 6   | AsyncStorage, mẫu chỉ tạo khi chưa có storage key, giữ dữ liệu sau khi mở lại                                                         |
| 7   | Design tokens, StyleSheet riêng, card bo góc/đổ bóng, pressed/disabled/error/empty, SafeArea và keyboard avoidance                    |

## Bản demo chạy độc lập

Đã bổ sung snapshot có phiên bản, migration dữ liệu cũ, backup và khôi phục dữ liệu lỗi; chặn mất nội dung form, ghi chồng và thao tác trùng. Dùng `pnpm check` để chạy kiểm tra chung. Build APK bằng `pnpm android:demo`; APK có JS bundle, chạy không cần Metro và cài riêng với tên **Thư viện Demo**.

Xem [hướng dẫn demo, khôi phục và phạm vi kiểm chứng](docs/DEMO_READINESS.md). Bản demo phục vụ bài thi/kiểm tra nội bộ; release để unsigned cho tới khi có cấu hình ký riêng.

## Kiểm tra

```bash
pnpm lint
pnpm typecheck
pnpm test --runInBand
pnpm check
```

Kiểm thử bao gồm các ràng buộc biên, tìm kiếm + lọc, persistence sau khi remount, lỗi lưu không làm thay đổi state, chặn ghi đồng thời, form thêm/sửa, trạng thái mượn/trả và xác nhận xoá.

Đọc thêm [quy ước](docs/CONVENTIONS.md) và [checklist kiểm tra thiết bị](docs/TESTING.md). Khi nộp bài, bỏ `node_modules`, `android/build`, `android/app/build`, `android/.gradle`, `android/app/.cxx`, `ios/Pods`, `ios/build`, `.git` và các thư mục metadata của công cụ; đặt tên file nén `HoTen_MSSV_De1.zip`.

### Giao diện pill và vuốt thẻ

Header/dock nổi, màu Nordic Cyan và preset smooth của base được dùng xuyên suốt button/input/badge; card giữ bo 16. Vuốt trái thẻ để Sửa/Xoá, vuốt phải hoặc chạm lại để đóng; nhấn giữ xoá vẫn được giữ theo đề. Xoá luôn hỏi xác nhận và không cho xoá sách đang mượn. Component AppSwipeableRow cũng đã được bổ sung vào base gốc cùng Storybook minh hoạ lưu trữ/xoá. Chi tiết tại [BASE_REUSE](docs/BASE_REUSE.md).
