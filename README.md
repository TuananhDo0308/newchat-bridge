# NewChat Bridge (Starter Setup)

Desktop Chat Bridge project initialized with modern **Best Practices** for **macOS & Windows**.

---

## 🛠 Tech Stack (Latest Versions)

| Layer | Library & Technology | Version |
| :--- | :--- | :--- |
| **Desktop Host** | **Electron** | `^45.3.2` |
| **Engine Architecture** | **`utilityProcess`** (Headless Node.js process) | Built-in |
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
| **Packaging** | **electron-builder** (DMG for Mac, NSIS for Win) | `^26.18.0` |
| **Icons** | **Lucide React** | `^1.72.0` |

---

## 📁 Directory Structure

```text
newchat_bridge/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.json
├── scripts/
│   ├── build.mjs            # Build script for Main, Preload & Engine using esbuild
│   └── dev.mjs              # Concurrent dev runner for Vite and Electron
└── src/
    ├── shared/              # Shared types and interfaces
    │   └── types.ts
    ├── main/                # Main Electron process (Window, Keystore, Tray)
    │   ├── index.ts
    │   ├── keystore.ts      # safeStorage Keychain / DPAPI
    │   └── engine-host.ts   # Lifecycle management for utilityProcess
    ├── preload/             # Secure contextBridge preload script
    │   ├── index.ts
    │   └── index.d.ts
    ├── engine/              # Headless background Node.js Engine (utilityProcess)
    │   ├── index.ts
    │   ├── server.ts        # Fastify loopback server
    │   └── db/              # Encrypted SQLite + Kysely ORM
    │       ├── index.ts
    │       └── schema.ts
    └── renderer/            # React 19 + HeroUI v3 + Tailwind v4 UI
        ├── index.html
        └── src/
            ├── index.css    # Tailwind v4 & HeroUI styles
            ├── main.tsx
            ├── App.tsx      # Main application UI entry
            └── store/       # Zustand store
                └── useAppStore.ts
```

---

## 🚀 Development Commands

```bash
# 1. Typecheck TypeScript
npm run typecheck

# 2. Build full project (UI + Main/Engine)
npm run build

# 3. Preview UI in standard web browser
npm run dev:ui

# 4. Run desktop application (Vite + Electron)
npm run dev

# 5. Package desktop installer (.dmg for macOS / .exe for Windows)
npm run package
```
