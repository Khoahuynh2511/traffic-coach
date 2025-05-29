# 🚗 Traffic Coach

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Khoahuynh2511/traffic-coach)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

> Ứng dụng tra cứu và so sánh luật giao thông Việt Nam giữa Nghị định 100/2019 và Nghị định 168/2024

Một Progressive Web App (PWA) hiện đại giúp người dân Việt Nam tra cứu, so sánh mức phạt vi phạm giao thông với giao diện thân thiện và khả năng hoạt động offline.

## ✨ Tính năng nổi bật

- 🔍 **Tìm kiếm thông minh**: Fuzzy search với Fuse.js, hỗ trợ tìm kiếm gần đúng
- 📊 **So sánh mức phạt**: Hiển thị chi tiết thay đổi giữa ND100/2019 và ND168/2024  
- 🤖 **Chatbot AI**: Tích hợp OpenAI API và AI local backup
- 📱 **PWA Ready**: Cài đặt như app native, hoạt động offline hoàn toàn
- 🎨 **UI/UX hiện đại**: Responsive design với Tailwind CSS
- ⚡ **Hiệu năng cao**: Vite build tool, TypeScript, Service Worker caching
- 🚀 **Auto Deploy**: GitHub Actions + Vercel integration

## 📸 Demo

[🔗 Live Demo](https://traffic-coach.vercel.app) | [📱 PWA Install Guide](docs/pwa-install.md)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 8

### Installation

```bash
# Clone repository
git clone https://github.com/Khoahuynh2511/traffic-coach.git
cd traffic-coach

# Install dependencies
npm install

# Start development server
npm run dev
```

Mở http://localhost:3000 để xem ứng dụng.

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | Chạy ESLint |
| `npm run format` | Format code với Prettier |
| `npm run parse-docx` | Parse file DOCX thành JSON |

### Project Structure

```
traffic-coach/
├── .github/workflows/     # GitHub Actions
├── public/
│   ├── manifest.json      # PWA manifest  
│   └── law.json          # Dữ liệu luật (auto-generated)
├── scripts/
│   └── simple_parser.js   # Script parse DOCX
├── src/
│   ├── main.ts           # Entry point
│   └── sw.js             # Service Worker
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel deployment config
└── workbox-config.js     # PWA caching config
```

## 🚀 Deployment

### Vercel (Recommended)

**Tự động deployment:**
1. Fork repository này
2. Import vào [Vercel](https://vercel.com)
3. Deploy tự động mỗi khi push code

**Manual deployment:**
```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Drag & drop thư mục dist/ vào Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist/ contents to gh-pages branch
```

Chi tiết: [📖 Deployment Guide](DEPLOYMENT.md)

## ⚙️ Configuration

### OpenAI API (Optional)

1. Click nút ⚙️ Settings trong app
2. Nhập OpenAI API key
3. Lưu để sử dụng chatbot AI

> **Note**: Không có API key vẫn sử dụng được với AI local backup

### Environment Variables

Tạo `.env.local` cho development:

```env
# OpenAI API (optional)
VITE_OPENAI_API_KEY=your_api_key_here

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

## 📊 Data Structure

Dữ liệu được cấu trúc theo chuẩn JSON:

```typescript
interface LawItem {
  id: string;              // "ND100-6-3-a"  
  law: 100 | 168;         // Nghị định
  article: number;         // Điều
  clause?: number;         // Khoản
  point?: string;          // Điểm (a, b, c...)
  vehicle: string[];       // ["Ô-tô", "Xe máy"]
  violation: string;       // Mô tả vi phạm
  fine: number;           // Mức phạt (VND)
  pointsDeducted: number;  // Điểm trừ GPLX
  delta?: number;         // Chênh lệch ND168 - ND100
}
```

## 🧪 Tech Stack

### Frontend
- **Vite** - Lightning fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Fuse.js** - Fuzzy search library

### PWA & Performance  
- **Workbox** - Service Worker management
- **Lighthouse** - 90+ performance score
- **Tree shaking** - Optimized bundles

### AI Integration
- **OpenAI API** - GPT-powered chatbot
- **Local AI** - Offline fallback
- **@xenova/transformers** - Planned embeddings

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Hosting & deployment
- **ESLint + Prettier** - Code quality

## 🎯 Roadmap

### v1.1 - AI Enhancement
- [ ] Vector embeddings với @xenova/transformers
- [ ] Semantic search
- [ ] Voice search support

### v1.2 - Advanced Features  
- [ ] Export PDF reports
- [ ] Violation statistics
- [ ] Multi-language support

### v1.3 - Community
- [ ] User contributions
- [ ] Crowdsourced updates
- [ ] Discussion forum

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Đọc [Contributing Guide](CONTRIBUTING.md) để bắt đầu.

### Quick Contribution

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`  
5. Tạo Pull Request

## 📄 License

Dự án được phân phối dưới [MIT License](LICENSE).

## ⚠️ Disclaimer

- Dữ liệu luật chỉ mang tính tham khảo
- Luôn tham khảo văn bản chính thức khi cần độ chính xác cao
- Không chịu trách nhiệm về sai sót thông tin

## 🙏 Acknowledgments

- [Nghị định 100/2019/NĐ-CP](https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Nghi-dinh-100-2019-ND-CP-xu-phat-vi-pham-hanh-chinh-giao-thong-duong-bo-434833.aspx)
- [Nghị định 168/2024/NĐ-CP](https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Nghi-dinh-168-2024-ND-CP-xu-phat-vi-pham-hanh-chinh-giao-thong-duong-bo-606016.aspx)

---

**Made with ❤️ by Vietnamese developers for Vietnamese drivers**

[⭐ Star this repo](https://github.com/Khoahuynh2511/traffic-coach) | [🐛 Report Issues](https://github.com/Khoahuynh2511/traffic-coach/issues) | [💬 Discussions](https://github.com/Khoahuynh2511/traffic-coach/discussions) 