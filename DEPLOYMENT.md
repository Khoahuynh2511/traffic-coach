# Hướng dẫn Deployment

## Deployment lên Vercel

### Cách 1: Tự động qua GitHub (Khuyến nghị)

1. **Push code lên GitHub:**
```bash
git add .
git commit -m "feat: chuẩn bị deploy"
git push origin main
```

2. **Kết nối Vercel với GitHub:**
   - Đăng nhập vào [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository từ GitHub
   - Vercel sẽ tự động detect và build dự án

3. **Cấu hình Environment Variables (nếu cần):**
   - Vào Project Settings > Environment Variables
   - Thêm các biến môi trường cần thiết

### Cách 2: Deploy thủ công qua Vercel CLI

1. **Cài đặt Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login và deploy:**
```bash
vercel login
vercel --prod
```

### Cấu hình GitHub Actions (Tự động)

File `.github/workflows/deploy.yml` đã được tạo để tự động:
- Chạy lint và build khi có PR
- Deploy lên Vercel khi merge vào main/master

**Cần setup secrets trên GitHub:**
1. Vào repository > Settings > Secrets and variables > Actions
2. Thêm các secrets:
   - `VERCEL_TOKEN`: Lấy từ Vercel > Settings > Tokens
   - `VERCEL_ORG_ID`: Lấy từ file `.vercel/project.json`
   - `VERCEL_PROJECT_ID`: Lấy từ file `.vercel/project.json`

## Build Commands

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`
- **Format:** `npm run format`

## Troubleshooting

### Lỗi Build trên Vercel
1. Kiểm tra Node.js version (cần >= 18)
2. Đảm bảo `package-lock.json` đã được commit
3. Check build logs trên Vercel dashboard

### Lỗi Routing
- File `vercel.json` đã cấu hình SPA routing
- Tất cả routes sẽ redirect về `index.html`

### Performance Optimization
- Static assets được cache 1 năm
- HTML được cache với revalidation
- Sử dụng Vite bundling optimization

## Environment Variables

Tạo file `.env.local` cho development:
```env
# API endpoints (nếu có)
VITE_API_URL=https://api.example.com

# Feature flags
VITE_ENABLE_ANALYTICS=true
```

**Lưu ý:** File `.env.local` không được commit lên Git. 