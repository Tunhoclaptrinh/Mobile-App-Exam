# Kiểm tra LibraryApp

## Kết quả ngày 28/10/2026

- `pnpm lint`: đạt, 0 lỗi và 0 cảnh báo.
- `pnpm typecheck`: đạt.
- `pnpm check`: đạt toàn bộ format, lint, typecheck và tests.
- `pnpm test --runInBand`: 8 suites, 61 tests đạt, bao gồm dock, vòng đời toast và android runner.
- Android debug `x86_64`: build thành công, cài và mở trên `emulator-5554`.
- Android demo: `pnpm android:demo` build thành công APK ARM64 + x86_64, có JS/Hermes bundle, minify/shrink, không debuggable và tắt cleartext traffic. Đã cài package riêng `com.libraryapp.demo` trên emulator x86_64.
- APK demo: thêm `Demo Offline` (1 cuốn), cho mượn hết và kiểm tra nút mượn bị khoá; force-stop rồi mở lại vẫn giữ sách và lượt mượn; nhận trả, xác nhận xoá và đưa thư viện về 5 sách mẫu. Form đã hiện Alert khi rời nội dung chưa lưu. Không thấy lỗi JS/fatal trong log tiến trình ở lần chạy được kiểm tra.
- Đã nhập và lưu sách trên emulator, mở chi tiết, cho mượn hết sách, đóng hẳn tiến trình rồi mở lại: sách và số đang mượn vẫn đúng. Đã nhận trả và xoá sách thử qua Alert, đưa dữ liệu về 5 sách mẫu.
- iOS đã có project/target `LibraryApp`; chưa build do môi trường hiện tại là Linux.
- Phiên kiểm tra emulator dùng Metro riêng cổng **8082**; cấu hình mặc định trong project vẫn là **8081**. Nếu muốn tiếp tục dùng cổng 8082: `pnpm start --port 8082` và `pnpm android --port 8082`.

## Tự động

```bash
pnpm lint
pnpm typecheck
pnpm test --runInBand
```

- `books.test.ts`: dữ liệu bắt buộc, biên năm, số nguyên, số lượng đang mượn, tìm kiếm đồng thời với lọc và giới hạn mượn/trả/xoá.
- `booksStorage.test.ts`: seed lần đầu, lưu/đọc lại, thư viện rỗng, dữ liệu sai, lỗi I/O.
- `appStore.test.tsx`: chuỗi thêm/sửa/mượn/trả/xoá, remount, ghi thất bại, ghi chồng nhau, kiểm tra nghiệp vụ và retry.
- `App.test.tsx`: render app với Native Stack thật trong môi trường Jest; tìm/lọc, form trống, thêm/sửa, nút disabled và xác nhận xoá. AsyncStorage và Safe Area dùng mock trong Jest; native rendering được kiểm tra riêng trên thiết bị.
- `toast.test.tsx`: thay thông báo liên tiếp, timer độc lập, đóng thủ công, thông báo trợ năng và cleanup.
- `android-runner.test.js`: quản lý tiến trình Metro và vòng đời phiên chạy android.

## Trên Android/iOS

1. Mở app lần đầu: có 5 đầu sách, đủ 4 thể loại. “Nhà giả kim” có nhãn “Hết sách” đỏ.
2. Nhập `TÔ HOÀI`: còn 1 kết quả. Chọn Khoa học: danh sách rỗng; chọn Tất cả: có lại kết quả. Xoá query để xem toàn bộ.
3. Thêm sách với tên/tác giả trống, năm `1899` và số lượng `0`: mỗi ô hiện lỗi/viền đỏ. Thử năm hiện tại + 1, số thập phân hoặc chuỗi không phải số khi dán.
4. Thêm sách hợp lệ, số lượng 1. Mở chi tiết: số mượn 0, Nhận trả bị xám. Cho mượn: còn 0, Cho mượn bị xám. Nhận trả: còn 1.
5. Mở Sửa sách: dữ liệu được điền sẵn. Thay tên/số lượng, lưu và kiểm tra ở danh sách/chi tiết. Với sách đang mượn, thử giảm tổng cuốn xuống thấp hơn borrowed: phải báo lỗi.
6. Nhấn giữ sách đang mượn: Alert báo không thể xoá. Nhấn giữ sách không ai mượn: Alert hỏi xác nhận; Huỷ giữ sách, Xoá mới loại sách khỏi danh sách. Kiểm tra cả nút Xoá ở chi tiết.
7. Đóng hẳn app, mở lại: các thay đổi vẫn còn. Thử trả hết và xoá hết sách rồi mở lại: vẫn rỗng, không tạo lại mẫu.
8. Trên thiết bị màn hình nhỏ: bàn phím số cho năm/số cuốn; cuộn form để xem/lưu ô cuối; safe area không bị tai thỏ/thanh hệ thống che. Nút và thẻ phản hồi khi nhấn.

## Build Android debug

Tại thư mục `android/`, với SDK đã cấu hình:

```bash
./gradlew :app:assembleDebug -PreactNativeArchitectures=x86_64
```

APK nằm ở `android/app/build/outputs/apk/debug/app-debug.apk`. Dùng `arm64-v8a` thay cho `x86_64` nếu kiểm tra trên điện thoại ARM. Debug cần Metro khi chạy. Build iOS cần macOS/Xcode.

## Kiểm tra giao diện Apple sau cập nhật

- Dock: Tủ sách có 5 đầu sách; Đang mượn có 3 đầu sách trong dữ liệu mẫu. Badge đếm đầu sách đang mượn, tổng quan đếm số cuốn. Quay lại từ chi tiết vẫn giữ tab đã chọn.
- Toast: xuất hiện sau khi lưu thành công; thay liên tiếp không bị timer cũ đóng nhầm thông báo mới; nút đóng hoạt động; đọc được bằng trình đọc màn hình; tự tắt và dọn timer khi unmount.
- Layout: header, dock và footer lưu cố định; nội dung cuối cuộn lên xem được; bàn phím không che ô năm/số lượng hoặc nút lưu; dock ẩn khi tìm kiếm.
- Giao diện: nền minimal gradient nhẹ, card không đổ bóng nặng, icon nét native, chữ tương phản rõ, bo góc theo token; pressed/disabled/error/empty giữ đầy đủ.

- `controlSizing.test.tsx`: kiểm tra chiều cao của button và input được render ở cả 3 cỡ 36/44/52, bán kính pill của preset smooth và font/line-height tương ứng. Đã đối chiếu 6 nhóm token với base nguồn và xác nhận trùng toàn bộ giá trị.

## Kiểm tra độ ổn định của demo

- Storage: migration từ mảng cũ, backup trước khi ghi, primary lỗi/thiếu, backup rỗng, lỗi ghi, giữ raw lỗi và không ghi đè schema mới hơn.
- Form: xác nhận bỏ thay đổi, lỗi ghi giữ nội dung và retry, ngăn Back trong lúc đang lưu, không bị chặn sau khi lưu thành công.
- Store: payload thừa không đổi id/borrowed, trim tên/tác giả; không reset schema mới hơn.
- Toast: callback đóng lặp và onClose tạo thông báo mới không làm mất thông báo tiếp theo.
- Chạy bản demo minified có bundle, kiểm tra không có dev menu/Metro; đóng mở lại phải còn dữ liệu. APK ARM64 được build để dùng trên điện thoại, smoke test trong phiên này dùng emulator x86_64.

## Pill / floating chrome / swipe

- `swipeableRow.test.tsx`: phân biệt ngang/dọc và tap; clamp khoảng kéo; vuốt hết không tự chạy action; cancel; disabled; action ẩn; đóng trước khi chạy callback; bấm lặp không gọi action hai lần.
- `App.test.tsx`: chỉ mở một thẻ; Sửa mở đúng form điền sẵn; Xoá từ tray vẫn hỏi Alert và chưa đổi dữ liệu khi chưa xác nhận.
- Header và dock dùng capsule nổi/cyan; nút, input, badge cùng preset smooth. Dock không che nội dung cuối và ẩn theo bàn phím.
- Base ReactNative gốc: đã thêm component, adapter theme và ví dụ Storybook song ngữ; lint 0 cảnh báo, TypeScript và 61 tests đạt.
- Smoke test APK demo trên emulator x86_64: vuốt trái → Sửa mở đúng form điền sẵn; vuốt → Xoá sách đang mượn báo lỗi; sách không mượn hiện Alert, Huỷ giữ nguyên sách; cuộn dọc đóng tray. Kiểm tra ảnh thực tế header/dock nổi, input/nút/badge pill và cyan. Log tiến trình demo trong phiên kiểm tra không có lỗi JS/fatal phù hợp mẫu tìm kiếm.

## pnpm isolated và launcher icon

- Xoá node_modules cũ, pnpm install --frozen-lockfile --offline thành công từ cache; không đổi 7 dependency runtime. Cài lại frozen sau khi thêm dev tool render icon cũng đạt.
- Metadata xác nhận pnpm 12.14.0 / nodeLinker isolated; 30 dependency trực tiếp đều là symlink hợp lệ vào .pnpm; không còn .package-lock.json của npm. Preinstall nhận pnpm, từ chối npm/yarn.
- pnpm icons:check xác minh 41 asset khớp SVG master và kiểm tra foreground adaptive nằm trong safe circle. Kiểm tra độc lập bằng bộ đọc PNG: 18 slots iPhone/iPad/App Store đủ file, đúng kích thước và RGB không alpha.
- pnpm check đạt lint 0 cảnh báo, TypeScript và 61 tests với cấu trúc pnpm isolated.
- Android demo ARM64 + x86_64 build thành công sau khi bỏ generated JNI của cả ba module native. Codegen đã hoàn thành trước app CMake, Hermes được resolve từ dependency của RN. Không sửa vendor package.
- iOS kiểm tra asset catalog/PNG trong Linux; chưa chạy Xcode hoặc iPhone.
