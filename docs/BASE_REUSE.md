# Thành phần kế thừa từ ReactNative

Nguồn tham chiếu: `/home/tuans-ubuntu/Projects/Study/ReactNative`. Các component được trích gọn vào project này và dùng chung trong màn hình sản phẩm. Không có liên kết runtime đến project nguồn.

| Thành phần base                               | Phần giữ lại / điều chỉnh                                                                                              | Nơi sử dụng                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `constants/appleTheme.ts`                     | Sao chép AppleColors và AppleGlassTokens; giữ bo card 16, các màu và specular highlight                                | Colors, AppCard, header/dock và control         |
| `AppleMeshBackground`                         | Giữ palette minimal; thay SVG radial/linear bằng `backgroundImage` native RN 0.87, có màu nền dự phòng                 | ScreenWrapper của tất cả màn hình               |
| `ScreenWrapper`                               | SafeArea, KAV, vùng cuộn và slot header/footer cố định; bỏ phụ thuộc theme store/showcase                              | Tất cả màn hình, loading/error                  |
| `AppScreenLayout`                             | Composition ScreenWrapper + AppHeader + footer; bottom inset có thể tắt khi dock sở hữu safe area                      | Danh sách, form và chi tiết                     |
| `AppHeader`                                   | Title/subtitle, canh trái/giữa, back capsule, rightAction, size và top safe area                                       | Mọi màn hình sản phẩm                           |
| `AppBottomNav`                                | Controlled items/activeKey/onChange, floating capsule, spring indicator, badge, centerFab, safe area; ẩn theo keyboard | Tủ sách / Đang mượn, nút thêm ở giữa            |
| `AppToast` / `ToastProvider`                  | API show/success/error/warning/info/hide, keyed replacement, pill, safe inset, spring/fade, duration, onClose          | Kết quả thêm/sửa/xoá và mượn/trả                |
| `AppButton`                                   | Variant, size, icon slots, loading/disabled, scale 0.975 bằng spring                                                   | Back, dock FAB, lưu/huỷ, mượn/trả và xoá        |
| `AppInput` / `AppSearchBar`                   | Label/error, focus, left/right slots, clear search và bàn phím                                                         | Form và tìm kiếm                                |
| `AppCard`                                     | Surface/layout tách biệt, padding/gap theo token, glass/elevated/flat, highlight và press/accessibility                | BookCard, tổng quan, thông tin chi tiết và form |
| `AppListItem`                                 | Leading/trailing, title/subtitle/value, action, disabled, chevron                                                      | Thông tin xuất bản, hàng sửa sách               |
| `AppDivider`, `AppBadge`, `CupertinoIconTile` | Separator hairline, nhãn trạng thái, ô icon theo semantic tone                                                         | Danh sách, tổng quan, chi tiết, empty state     |
| `AppText`, `EmptyState`, `ErrorBoundary`      | Typography thống nhất, thông báo rỗng và khôi phục lỗi render                                                          | Toàn ứng dụng                                   |

Các API không phục vụ bài thi (menu mở rộng, theme studio, nhiều mesh variant, dịch vụ phần cứng, auth, SQLite…) được bỏ. Không copy nguyên cả bộ showcase hoặc toàn bộ dependency graph của base.

`AppIcon` bổ sung nét icon bằng View/Text native để lấp slot Lucide của base mà vẫn tuân thủ thư viện được phép. Bề mặt kính là màu bán trong suốt + gradient + viền sáng; không thêm native blur hoặc UI kit. Animation dùng React Native Animated và tôn trọng Reduce Motion.

Lệnh phát triển dùng pnpm. Pin `pnpm@12.14.0`, `pnpm-lock.yaml` là lockfile duy nhất; `pnpm-workspace.yaml` cấu hình `nodeLinker: isolated` với symlink package trực tiếp cho native tooling và kiểm tra engine. State sách và toàn bộ nghiệp vụ vẫn nằm trong useAppStore; phần giao diện không tự lưu dữ liệu.

## Kích thước đối chiếu trực tiếp với base

Bộ token core được sao chép từ `ReactNative/src/constants/theme.ts`. Đã so sánh giá trị của Spacing, BorderRadius, RadiusPresets, ControlSize, Typography và Shadows: cả 6 nhóm đều trùng. Không dùng source project làm dependency lúc chạy hoặc kiểm thử.

| Thành phần        | Giá trị áp dụng                                                                       |
| ----------------- | ------------------------------------------------------------------------------------- |
| Button / input sm | Cao 36, chữ 13, line-height 18, icon 16                                               |
| Button / input md | Cao 44, chữ 15, line-height 20, icon 18                                               |
| Button / input lg | Cao 52, chữ 17, line-height 22, icon 20                                               |
| Radius smooth     | Card 16, control/input/button/badge pill 9999                                         |
| Typography        | Header 26/34, title 20/26, subtitle 16/22, body 14/20, caption 12/16                  |
| AppHeader         | Hàng md 48 / lg 56; title md 14.5/20, lg 16/22; back circle 32 + hitSlop 6            |
| Floating dock md  | Cao 62, inset ngang 16, indicator inset 3.5, icon 22, label 11/14                     |
| CupertinoIconTile | Vuông 34/44/56; radius theo tỉ lệ 0.28; icon theo tỉ lệ 0.52; gradient có glyph trắng |
| Toast md          | Padding 16×12, title 13.5, message 12.5, icon 20, radius 24                           |

Header dùng floating-pill liền khối; dock absolute nổi trên nội dung và FlatList có khoảng bù dưới để không che thẻ cuối. Hai bề mặt dùng chung FloatingChrome, giữ elevation 0 và thêm boxShadow native RN để bóng theo đường pill trên Android/iOS. Background minimal vẫn giữ radial/linear gradient native. Vùng bấm nhỏ hơn 44 được bù hitSlop ở back và đóng toast.

## Pill, cyan và thao tác vuốt

- `AppRadii = RadiusPresets.smooth`: chọn đúng preset có sẵn, không đổi 6 nhóm token gốc. Nút, ô nhập, badge và chip dùng pill; card giữ 16.
- Màu primary `#0891B2`, primarySoft `#CFFAFE`, primaryText `#0E7490` lấy từ Nordic Cyan của base. Gradient primary của tile đổi theo cyan; nền minimal được giữ.
- `AppSwipeableRow` đã được bổ sung vào base gốc và dùng cùng core PanResponder/Animated, types, gesture và style factory tại đây. Adapter `useSwipeableAppearance` của base đọc theme/accent/radius/reduceMotion trung tâm; bản bài thi dùng token đã chọn và Reduce Motion của hệ thống.
- API controlled `open` / `onOpenChange`, `actions: SwipeAction[]` nhận key, label, accessibilityLabel, icon slot, destructive/disabled và callback. Có thể dùng cho lưu trữ, sửa, xoá tuỳ sản phẩm; component không biết nghiệp vụ và không tự lưu dữ liệu.
- App thư viện dùng Sửa/Xoá, không thêm trạng thái lưu trữ ngoài đề. Mỗi lần mở một thẻ; cuộn dọc, tìm/lọc, bận lưu hoặc điều hướng sẽ đóng menu. Vuốt phải hoặc chạm thẻ đang mở cũng đóng. Vuốt hết chỉ lộ action, không tự xoá; nút Xoá và nhấn giữ vẫn qua cùng Alert và kiểm tra sách đang mượn.
- Có accessible actions Sửa/Xoá trên thẻ cho trình đọc màn hình. Action ẩn không nhận touch/focus. Bấm action liên tiếp không gọi callback lặp; lớp foreground đặc ngăn action phía sau lộ xuyên khi nhấn card.
- Base gốc có ví dụ Storybook song ngữ Archive/Delete/Reset, dùng theme tối/sáng, accent, radius và Reduce Motion hiện hành. Không đưa state/nghiệp vụ thư viện vào base.

Launcher icon burger của source không thuộc nhận diện sản phẩm nên đã được thay bằng artwork sách mở/cyan riêng. SVG master, generator dev-only và asset Android/iOS được mô tả trong [APP_ICON](APP_ICON.md). Dependency hiện được cài sạch bằng pnpm isolated; không mang node_modules của source sang.
