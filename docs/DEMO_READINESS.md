# Bản demo ổn định cho bài thi

Phạm vi đã thống nhất: app quản lý thư viện offline để làm bài thi/demo. Giữ 7 dependency runtime theo đề, component Apple và bộ token của base; không thêm backend hoặc dịch vụ bên ngoài.

## Kiểm tra trước khi nộp

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm android:demo
```

`pnpm check` kiểm tra asset icon, format, ESLint không cảnh báo, TypeScript và toàn bộ Jest tests. Build demo mặc định gồm ARM64 cho điện thoại và x86_64 cho emulator. Có thể chọn riêng bằng `pnpm android:demo x86_64` hoặc `pnpm android:demo arm64-v8a`.

APK: `android/app/build/outputs/apk/demo/app-demo.apk`. Demo chứa JS/Hermes bundle, bật minify/shrink và chạy không cần Metro. Package `com.libraryapp.demo` cài song song với bản phát triển `com.libraryapp`, có dữ liệu riêng; tên trên launcher là **Thư viện Demo**. Demo ký bằng chứng chỉ debug dành cho kiểm tra nội bộ. Build `release` được để unsigned cho tới khi có cấu hình ký phát hành riêng.

Khi đã kết nối thiết bị bằng ADB, cài đè và mở demo:

```bash
adb install -r android/app/build/outputs/apk/demo/app-demo.apk
adb shell am start -n com.libraryapp.demo/com.libraryapp.MainActivity
```

## Dữ liệu và phục hồi

- Lần đầu tạo 5 sách mẫu; thư viện đã lưu rỗng vẫn được giữ rỗng.
- Dữ liệu cũ dạng mảng được đọc và chuyển sang snapshot `{ schemaVersion, savedAt, books }` trong cùng storage key. Mỗi lần ghi đều kiểm tra dữ liệu và giữ snapshot trước đó làm backup trước khi thay primary.
- Lỗi ghi không công bố state mới, form giữ nội dung để thử lại. Các thao tác đọc/ghi được xếp hàng kể cả khi provider remount; thao tác trùng bị chặn ở store.
- Nếu primary lỗi hoặc mất, dùng backup hợp lệ và hiển thị thông báo khôi phục. Backup có thể là lần lưu trước: cần kiểm tra lại các thay đổi gần đây. Dữ liệu lỗi được giữ trong recovery key trước khi thay primary.
- Nếu không có backup hợp lệ, app hiển thị lỗi/thử lại; chỉ tạo lại mẫu sau Alert xác nhận. Không xoá các storage key không thuộc thư viện.
- Snapshot thuộc phiên bản mới hơn không bị ghi đè hoặc tự khôi phục về bản cũ.
- Backup nằm trong vùng dữ liệu của chính ứng dụng, không thay thế bản sao ngoài thiết bị. Gỡ app hoặc xoá dữ liệu hệ thống sẽ xoá cả thư viện và backup. Cập nhật APK bằng cài đè giữ dữ liệu.

## Thao tác

- Form có thay đổi chưa lưu: Back, Huỷ và thao tác quay lại của hệ thống hỏi xác nhận trước khi bỏ nội dung. Khi đang lưu, giữ nguyên màn hình; lưu thành công mới quay lại.
- Chặn bấm lưu lặp ngay cả trong cùng một frame. Store kiểm tra lại quantity/borrowed và chỉ chấp nhận các trường cho phép khi thêm/sửa; id và borrowed không bị thay qua payload sửa sách.
- Xoá luôn qua Alert; sách đang mượn không được xoá. Toast chỉ xuất hiện thành công sau khi dữ liệu được lưu.
- Toast thay liên tiếp hoặc callback đóng trùng không đóng nhầm thông báo mới.
- Vuốt trái thẻ để Sửa/Xoá; chỉ mở một tray, đóng khi cuộn dọc, tìm/lọc, chuyển màn hình hoặc đang ghi dữ liệu. Vuốt không tự thực hiện thao tác; Xoá vẫn hỏi Alert và không cho xoá sách đang mượn. Nhấn giữ xoá được giữ nguyên theo đề, có thêm accessible actions tương đương.
- Header/dock nổi và các control dạng pill dùng preset smooth cùng màu Nordic Cyan của base; card giữ bo 16. Dock có khoảng cuộn bù để không che nội dung cuối.

## Giới hạn kiểm chứng

Kiểm thử tự động bao gồm nghiệp vụ, migration/backup/recovery/lỗi ghi, luồng form/navigation, toast và kích thước control. Bản Android demo được kiểm tra trên emulator x86_64. iOS cần macOS/Xcode để build và kiểm chứng native; chưa có kiểm tra trên iPhone hoặc điện thoại Android ARM64 thật trong môi trường này.

## Dependency và icon

Dùng pnpm isolated, preinstall chặn package manager khác; runtime vẫn 7 package. Launcher sách mở/cyan có đủ Android legacy/adaptive/monochrome và iOS iPhone/iPad/App Store. Chỉnh artwork qua SVG master, chạy pnpm icons:generate rồi pnpm check. Xem APP_ICON.md và DEPENDENCIES.md.
