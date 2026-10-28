# App icon LibraryApp

Biểu tượng sách mở với bookmark, trang trắng/ngà và nền Nordic Cyan khớp giao diện. Không có chữ nhỏ; nét và khoảng trống vẫn rõ ở kích thước launcher. Đây là artwork vector riêng của app, thay toàn bộ icon burger của base.

## Một nguồn cho hai nền tảng

Nguồn chỉnh sửa: `assets/branding/library-icon.svg`. Giữ ba group `background`, `mark-shadow`, `mark` và mask `bookmark-cut`; generator dùng các group để tách lớp adaptive và monochrome.

```bash
pnpm icons:generate
pnpm icons:check
```

`@resvg/resvg-js` được pin trong devDependencies, chỉ chạy khi sinh/kiểm tra asset. Không thêm SVG renderer hoặc thư viện ảnh vào runtime app. `pnpm check` đã bao gồm icons:check; khi SVG đổi, phải sinh lại asset trước khi build.

## Android

- Legacy launcher: PNG 48/72/96/144/192 px cho mdpi → xxxhdpi; có bản bo góc và bản tròn.
- Adaptive launcher: các lớp background, foreground và monochrome riêng, canvas 108 dp theo từng density. Hệ thống tự mask adaptive icon; không bo góc sẵn trên lớp background.
- Foreground giữ trong đường tròn an toàn 66 dp; generator kiểm tra alpha theo từng pixel để tránh mất góc sách/bookmark khi launcher đổi mask.
- Monochrome chỉ có silhouette trắng/alpha và khoảng cắt bookmark, dùng khi launcher hỗ trợ themed icons. Không dùng ảnh màu làm lớp monochrome.
- XML adaptive cho cả icon thường và tròn tham chiếu cùng bộ layer. Các WebP burger và color resource cũ đã được bỏ.

## iOS

- AppIcon asset catalog có đủ 18 slots iPhone/iPad/App Store, dùng chung 13 ảnh PNG theo kích thước pixel.
- Ảnh 1024 dùng cho App Store; tất cả PNG là RGB không có kênh alpha, không bo góc sẵn. Hệ thống iOS tự áp dụng mask.
- Project đã trỏ tới AppIcon; không cần thêm ảnh vào file project Xcode thủ công.

Generator kiểm tra kích thước, vùng an toàn, độ opaque của iOS và độ khớp các file đã commit. Artwork được xuất raster một lần, không dựng bằng mã khi app chạy. Build/launcher Android được kiểm tra trên emulator; iOS asset đã được kiểm tra kích thước/định dạng, build native vẫn cần macOS/Xcode.
