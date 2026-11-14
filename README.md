# NewChat Bridge (Starter Setup)

Dự án Desktop Chat Bridge được khởi tạo với kiến trúc **Best Practice** hiện đại nhất cho **macOS & Windows**.

---

## 🛠 Tech Stack (Phiên bản mới nhất)

| Tầng | Thư viện & Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| **Desktop Host** | **Electron** | `^45.3.2` |
| **Kiến trúc Engine** | **`utilityProcess`** (Headless Node.js process) | Built-in |
| **UI Framework** | **React** & **React DOM** | `^19.3.1` |
| **UI Component Kit** | **HeroUI** (`@heroui/react` & `@heroui/styles`) | `^3.2.7` |
| **Styling** | **Tailwind CSS v4** + `@tailwindcss/vite` | `^4.3.5` |
| **State Management**| **Zustand** | `^5.1.0` |
| **Build Tooling** | **Vite** | `^8.3.8` |
| **Compiler** | **TypeScript** | `^7.0.2` |
| **Bundler (Backend)**| **esbuild** | `^0.28.2` |
| **Local API** | **Fastify v5** (Loopback REST/SSE) | `^5.12.8` |
| **Database** | **better-sqlite3-multiple-ciphers** + **Kysely** | `^13.1.1` / `^0.29.9` |
| **Security** | **Electron safeStorage** (Apple Keychain & Windows DPAPI) | Built-in |
| **Packaging** | **electron-builder** (DMG cho Mac, NSIS cho Win) | `^26.18.0` |
| **Icons** | **Lucide React** | `^1.72.0` |

---

## 📁 Cấu trúc thư mục

```text
newchat_bridge/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.json
├── scripts/
│   ├── build.mjs            # Script build Main, Preload & Engine bằng esbuild
│   └── dev.mjs              # Script khởi động đồng thời Vite và Electron
└── src/
    ├── shared/              # Types và interface dùng chung
    │   └── types.ts
    ├── main/                # Tiến trình Electron chính (Window, Keystore, Tray)
    │   ├── index.ts
    │   ├── keystore.ts      # safeStorage Keychain / DPAPI
    │   └── engine-host.ts   # Quản lý vòng đời utilityProcess
    ├── preload/             # Preload script bảo mật với contextBridge
    │   ├── index.ts
    │   └── index.d.ts
    ├── engine/              # Tiến trình Engine Node.js chạy ngầm (utilityProcess)
    │   ├── index.ts
    │   ├── server.ts        # Fastify loopback server
    │   └── db/              # SQLite mã hóa + Kysely ORM
    │       ├── index.ts
    │       └── schema.ts
    └── renderer/            # Giao diện React 19 + HeroUI v3 + Tailwind v4
        ├── index.html
        └── src/
            ├── index.css    # Import Tailwind v4 & HeroUI styles
            ├── main.tsx
            ├── App.tsx      # Giao diện khởi tạo HeroUI
            └── store/       # Zustand store
                └── useAppStore.ts
```

---

## 🚀 Các lệnh phát triển

```bash
# 1. Kiểm tra Type TypeScript
npm run typecheck

# 2. Build toàn bộ dự án (UI + Main/Engine)
npm run build

# 3. Chạy thử nghiệm giao diện trên trình duyệt web
npm run dev:ui

# 4. Chạy toàn bộ ứng dụng Desktop (Vite + Electron)
npm run dev

# 5. Đóng gói bộ cài đặt Desktop (.dmg cho macOS / .exe cho Windows)
npm run package
```

