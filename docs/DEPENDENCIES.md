# Dependency và pnpm

Dự án dùng pnpm 12.14.0, được pin bằng packageManager. Chỉ có pnpm-lock.yaml; preinstall từ chối npm/yarn. Node.js tối thiểu 22.13.0.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm android:demo
```

## Cấu trúc node_modules

`pnpm-workspace.yaml` chọn nodeLinker: isolated. Các package trực tiếp là symlink tới node_modules/.pnpm; nội dung package được hard-link từ content-addressable store của pnpm. Không copy node_modules từ base, không chỉnh mã trong package và không tạo thêm package-lock.json. File lock do chính một dependency đóng gói bên trong package là nội dung vendor; không tự xoá các file đó.

Đã cài lại sạch node_modules từ lockfile/cache, kiểm tra metadata pnpm, symlink của toàn bộ dependency trực tiếp và loại bỏ dấu vết npm cũ. Giữ nguyên shared store để các dự án khác tiếp tục dùng; không chạy store prune như một bước dọn project.

## Phạm vi dependency

- Runtime giữ 7 package theo đề: React, React Native, AsyncStorage, Navigation Native/Native Stack, Screens và Safe Area.
- Bộ Babel/Metro/CLI/Gradle plugin/Codegen, TypeScript, ESLint, Prettier và Jest thuộc devDependencies phục vụ build/kiểm tra React Native.
- @resvg/resvg-js là dev tool duy nhất thêm cho app icon: render SVG gốc thành PNG Android/iOS, không được import vào mã ứng dụng.

## Native sau khi cài mới

Gradle app yêu cầu codegen của các module native hoàn thành trước configureCMake/buildCMake. Quy tắc này nằm trong android/app/build.gradle, áp dụng cho debug và demo, tránh task compile chạy trước khi CMakeLists.txt của JNI được sinh sau một lần cài sạch. Không cần sửa node_modules hoặc chạy một lệnh codegen thủ công trước mỗi lần build.

Hermes compiler được resolve qua require.resolve từ chính React Native, giữ đúng phiên bản compiler/VM thay vì giả định compiler nằm ở root node_modules. iOS podspec của React Native đã dùng Node resolution tương tự. Metro/CLI/Gradle dùng dependency qua symlink trực tiếp của dự án. Android demo phải build được sau cài sạch; iOS dùng CocoaPods trên macOS và resolve React Native từ cùng node_modules. Không đưa cache Gradle, Pods, output build hoặc node_modules vào bài nộp.

Sau build, Gradle có thể tạo thư mục build/codegen/.cxx bên trong package native. Đây là output build được bỏ qua bởi Git, không phải dependency npm dư.
