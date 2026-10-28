# Quy ước LibraryApp

- Chỉ dùng thư viện runtime được phép trong `De1_QuanLyThuVien.md`. Mọi UI dùng React Native; không đưa các thư viện UI hoặc dịch vụ của base nguồn trở lại.
- State sách dùng chung qua `AppStoreProvider` / `useAppStore`; query, bộ lọc và dữ liệu nhập form là state cục bộ của màn hình.
- Các thao tác thay đổi sách đi qua store. Store kiểm tra nghiệp vụ và lưu AsyncStorage thành công trước khi công bố state mới. Khoá đồng bộ chặn hai thao tác ghi chồng nhau; dùng `busy` để vô hiệu hoá nút.
- Khởi tạo mẫu chỉ khi chưa có cả primary và backup; `[]` là dữ liệu hợp lệ. Dữ liệu không hợp lệ hoặc đọc lỗi phải hiển thị lỗi, không tự reset storage.
- Mọi đường xoá trong UI dùng `useDeleteBook`: chặn `borrowed > 0`, hỏi xác nhận bằng `Alert`; store kiểm tra lại trước khi xoá.
- Model/loại sách nằm trong `src/types/book.ts`. Truyền `bookId` qua route và đọc sách hiện tại từ store; không truyền bản sao Book làm dữ liệu chi tiết.
- Form chung cho thêm/sửa. Giữ ô số dưới dạng string khi nhập, kiểm tra số nguyên an toàn rồi chuyển sang `BookInput`. Không cho số lượng nhỏ hơn số đang mượn.
- Mỗi component có thư mục riêng, `styles.ts`, `types.ts` nếu cần và `index.ts`. Dùng `StyleSheet.create` trong file style; không viết style object trực tiếp trong JSX.
- Tái sử dụng `Colors`, `Spacing`, `BorderRadius`, `Typography`, `Shadows` trong `src/constants`. Dùng bảng màu Apple sáng thống nhất và `AppleGlassTokens`; card bo 16, control pill theo preset smooth, header/dock capsule. Gradient khai báo qua `Gradients` với `backgroundImage` native.
- Mỗi màn hình bọc `ScreenWrapper`. AppHeader sở hữu safe area phía trên; `ScreenWrapper` xử lý hai bên/dưới và bàn phím. Loading/error không có header dùng `topInset`.
- Danh sách dùng FlatList trực tiếp, tránh bọc trong ScrollView dọc. Form/chi tiết dùng `ScreenWrapper scrollable`.
- Nút bấm qua `AppButton`; nhãn thể loại/thẻ sách dùng Pressable. Giữ trạng thái trợ năng selected/disabled, hiệu ứng pressed, thông báo lỗi và empty state.
- Sửa code cần cập nhật README/quy ước nếu thay đổi hành vi hoặc cấu trúc. Chạy lint (0 cảnh báo), typecheck và Jest trước khi hoàn tất.

## Component base dùng chung

- Màn hình sản phẩm dùng `AppScreenLayout`: props header chuyển vào `AppHeader`, `footer` ngoài vùng cuộn. `ScreenWrapper` sở hữu mesh/KAV; `AppHeader` sở hữu top inset. Có dock thì `bottomInset=false` để chỉ dock bù safe area đáy.
- Không tự dựng lại card, badge, separator, search, hàng thông tin hoặc nút bấm trong màn hình. Dùng `AppCard`, `AppBadge`, `AppDivider`, `AppSearchBar`, `AppListItem`, `AppButton` và slot icon.
- `AppBottomNav` là controlled component. Scope của Tủ sách / Đang mượn nằm ở `BookList` route params; form/chi tiết tiếp tục dùng Native Stack. Không thêm bottom-tabs ngoài danh sách thư viện được phép.
- Dùng `useToast()` sau khi store lưu thành công. ToastProvider nằm trên NavigationContainer để thông báo không mất khi chuyển màn hình. Lỗi ghi dùng toast; xác nhận xoá và lỗi xoá đang mượn vẫn dùng Alert.
- Tái sử dụng API base theo `BASE_REUSE.md`, chỉ mang sang prop/thành phần đang dùng. Không import trực tiếp code từ `../ReactNative` tại runtime.
- Animation tôn trọng `useReducedMotion()`. Timer, keyboard listener và animation cần cleanup khi unmount hoặc thay nội dung.
- Chỉ dùng pnpm, phiên bản theo packageManager. Cấu hình pnpm 12 nằm trong `pnpm-workspace.yaml`, không tạo package-lock/yarn.lock. Chạy `pnpm lint`, `pnpm typecheck`, `pnpm test --runInBand`, `pnpm format:check`.

## Kích thước phải khớp base nguồn

`Spacing`, `BorderRadius`, `RadiusPresets`, `ControlSize`, `Typography`, `Shadows` giữ nguyên giá trị từ ReactNative, không định nghĩa lại theo cảm tính. Button và input lấy cùng `ControlSize`: sm 36 (chữ 13/18), md 44 (15/20), lg 52 (17/22). Kích thước phải áp vào control thực, không chỉ wrapper ngoài. Icon-only dùng cùng chiều cao/rộng của size tương ứng.

Header floating-pill dùng chữ md 14.5/20, hàng 48; lg 16/22, hàng 56. Back circle 32 có hitSlop 6 để vùng bấm đạt 44. Dock medium cao 62, inset ngang 16, indicator cách mép 3.5; Android không dùng elevation cho nền dock kính. CupertinoIconTile phải vuông 34/44/56, radius = round(size × 0.28), icon = round(size × 0.52). Số đo đặc thù lấy từ componentMetrics.ts.

## Độ bền dữ liệu và luồng form

- Storage đi qua booksStorage, xếp hàng đọc/ghi. Snapshot có schemaVersion/savedAt/books; đọc tương thích mảng cũ. Phải kiểm tra backup trước khi thay primary, bảo toàn dữ liệu lỗi trong recovery key khi khôi phục. Không tự hạ schema mới hơn.
- Store chỉ nhận các trường BookInput cho phép và trim chuỗi. Thông báo thành công sau khi lưu; lỗi lưu giữ state và nội dung form cũ. Không cập nhật React state sau unmount.
- Form dùng usePreventRemove cho dữ liệu chưa lưu; chặn navigation lúc đang ghi. Sau thành công, tắt guard trước khi goBack. Không tự dispatch bỏ qua xác nhận cho Back/Huỷ.
- Reset dữ liệu mẫu chỉ xuất hiện khi lỗi dữ liệu không phục hồi được, có Alert xác nhận và chỉ tác động key thư viện. Không dùng AsyncStorage.clear trong mã sản phẩm.
- pnpm check là cổng kiểm tra chung. pnpm android:demo tạo bản bundle độc lập với package riêng, ký debug nội bộ; không ký release bằng debug.keystore.

## Pill chrome và swipe

Chọn bán kính một nơi qua `AppRadii = RadiusPresets.smooth`; card giữ 16, control/badge dùng pill. Header/dock dùng chung FloatingChrome, màu Nordic Cyan tập trung trong Colors; không tạo màu/radius riêng ở màn hình. Dock overlay phải có khoảng bù cuối danh sách, vẫn ẩn khi mở bàn phím.

Dùng AppSwipeableRow cho menu vuốt ngang. List giữ một openId, đóng khi cuộn/tìm/lọc/điều hướng/busy. Product cung cấp callbacks, xác nhận xoá và accessible actions tương đương; không đưa nghiệp vụ hoặc storage vào component gesture. Giữ core đồng bộ với base ReactNative; chỉ adapter appearance khác nhau do giới hạn dependency của đề.

## Dependency và launcher icon

Dùng pnpm isolated; không đổi sang npm/yarn hoặc copy node_modules từ source. Preinstall kiểm tra package manager, lockfile được giữ cố định khi cài. Không chỉnh package/vendor files để sửa lỗi build; dependency codegen phải đứng trước CMake trong Gradle.

Launcher artwork chỉ sửa tại assets/branding/library-icon.svg, sinh lại qua pnpm icons:generate rồi chạy icons:check. Android cần legacy/adaptive/monochrome và safe zone; iOS RGB không alpha đủ slots. Không thêm runtime dependency chỉ để render launcher icon.
