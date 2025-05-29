# Hướng dẫn đóng góp (Contributing Guide)

## Cách đóng góp vào dự án Traffic Coach

### Yêu cầu hệ thống
- Node.js >= 18
- npm >= 8

### Cài đặt môi trường phát triển

1. **Fork repository và clone về máy:**
```bash
git clone https://github.com/your-username/traffic-coach.git
cd traffic-coach
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Chạy development server:**
```bash
npm run dev
```

### Quy trình phát triển

1. **Tạo branch mới cho feature/bugfix:**
```bash
git checkout -b feature/ten-feature
# hoặc
git checkout -b fix/ten-bug
```

2. **Phát triển và test:**
```bash
npm run lint      # Kiểm tra code style
npm run format    # Format code
npm run build     # Test build
```

3. **Commit và push:**
```bash
git add .
git commit -m "feat: mô tả ngắn gọn về thay đổi"
git push origin feature/ten-feature
```

4. **Tạo Pull Request trên GitHub**

### Coding Standards

- Sử dụng TypeScript cho tất cả code mới
- Tuân thủ ESLint và Prettier configuration
- Viết comment bằng tiếng Việt cho logic phức tạp
- Tên biến/function sử dụng tiếng Anh, comment tiếng Việt

### Commit Message Convention

- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật documentation
- `style:` - Thay đổi format, không ảnh hưởng logic
- `refactor:` - Refactor code
- `test:` - Thêm/sửa test
- `chore:` - Cập nhật build tools, dependencies

### Báo cáo lỗi

Khi báo cáo lỗi, hãy bao gồm:
- Mô tả chi tiết lỗi
- Các bước tái tạo lỗi
- Environment (browser, OS)
- Screenshots nếu có

### Đề xuất tính năng

- Tạo issue với label "enhancement"
- Mô tả rõ tính năng và lý do cần thiết
- Thảo luận với maintainers trước khi implement 