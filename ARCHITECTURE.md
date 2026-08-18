# 🏗️ Arquitetura - PDF Reader Pro Premium

## Diagrama de Arquitetura Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                     APLICAÇÃO ELECTRON                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   MAIN PROCESS (Node.js)                 │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │          IPC Main Handlers                         │  │  │
│  │  │  ├─ pdf:* (PDF operations)                        │  │  │
│  │  │  ├─ annotation:* (Anotações)                      │  │  │
│  │  │  ├─ security:* (Segurança)                        │  │  │
│  │  │  ├─ print:* (Impressão)                           │  │  │
│  │  │  ├─ ocr:* (OCR - NEW)                             │  │  │
│  │  │  ├─ editor:* (Editor - NEW)                       │  │  │
│  │  │  ├─ forms:* (Formulários - NEW)                   │  │  │
│  │  │  ├─ redaction:* (Redação - NEW)                   │  │  │
│  │  │  ├─ cloud:* (Cloud - NEW)                         │  │  │
│  │  │  ├─ compare:* (Comparação - NEW)                  │  │  │
│  │  │  ├─ presentation:* (Apresentação - NEW)           │  │  │
│  │  │  ├─ conversion:* (Conversão - NEW)                │  │  │
│  │  │  ├─ analysis:* (Análise - NEW)                    │  │  │
│  │  │  └─ ai:* (IA - NEW)                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │            Handlers (11 no total)                 │  │  │
│  │  │  ├─ PDFHandler                                     │  │  │
│  │  │  ├─ AnnotationHandler                              │  │  │
│  │  │  ├─ SecurityHandler                                │  │  │
│  │  │  ├─ PrintHandler                                   │  │  │
│  │  │  ├─ OCRHandler (NEW)                               │  │  │
│  │  │  ├─ EditorHandler (NEW)                            │  │  │
│  │  │  ├─ FormsHandler (NEW)                             │  │  │
│  │  │  ├─ RedactionHandler (NEW)                         │  │  │
│  │  │  ├─ CloudHandler (NEW)                             │  │  │
│  │  │  ├─ CompareHandler (NEW)                           │  │  │
│  │  │  └─ PremiumHandlers (NEW) - 4 handlers em 1:       │  │  │
│  │  │     ├─ PresentationHandler                          │  │  │
│  │  │     ├─ ConversionHandler                            │  │  │
│  │  │     ├─ AnalysisHandler                              │  │  │
│  │  │     └─ AIAssistantHandler                           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │          File System & Crypto                     │  │  │
│  │  │  ├─ fs module                                     │  │  │
│  │  │  ├─ crypto module (AES-256)                       │  │  │
│  │  │  └─ path utilities                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕️ IPC                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RENDERER PROCESS (React)                   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │        Preload Script (Context Bridge)         │   │  │
│  │  │  ├─ pdf API                                    │   │  │
│  │  │  ├─ annotation API                             │   │  │
│  │  │  ├─ security API                               │   │  │
│  │  │  ├─ print API                                  │   │  │
│  │  │  ├─ ocr API (NEW)                              │   │  │
│  │  │  ├─ editor API (NEW)                           │   │  │
│  │  │  ├─ forms API (NEW)                            │   │  │
│  │  │  ├─ redaction API (NEW)                        │   │  │
│  │  │  ├─ cloud API (NEW)                            │   │  │
│  │  │  ├─ compare API (NEW)                          │   │  │
│  │  │  ├─ presentation API (NEW)                     │   │  │
│  │  │  ├─ conversion API (NEW)                       │   │  │
│  │  │  ├─ analysis API (NEW)                         │   │  │
│  │  │  └─ ai API (NEW)                               │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │          Components React (11 total)           │   │  │
│  │  │  ├─ PDFViewer                                  │   │  │
│  │  │  ├─ Toolbar                                    │   │  │
│  │  │  ├─ AnnotationPanel                            │   │  │
│  │  │  ├─ SearchPanel                                │   │  │
│  │  │  ├─ BookmarksPanel                             │   │  │
│  │  │  ├─ AnnotationLayer                            │   │  │
│  │  │  ├─ PasswordDialog                             │   │  │
│  │  │  ├─ Sidebar                                    │   │  │
│  │  │  └─ PremiumFeatures (NEW)                      │   │  │
│  │  │     └─ 10 feature cards com interface            │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │      State Management (Zustand - 2 stores)    │   │  │
│  │  │  ├─ PDFStore                                   │   │  │
│  │  │  │  ├─ document                                │   │  │
│  │  │  │  ├─ viewState                               │   │  │
│  │  │  │  └─ actions                                 │   │  │
│  │  │  │                                              │   │  │
│  │  │  └─ AnnotationStore                            │   │  │
│  │  │     ├─ annotations[]                           │   │  │
│  │  │     ├─ currentTool                             │   │  │
│  │  │     └─ actions                                 │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │        Utilities & Services                    │   │  │
│  │  │  ├─ pdfUtils (PDF.js wrapper)                  │   │  │
│  │  │  ├─ annotationUtils (Anotações)                │   │  │
│  │  │  ├─ Types (TypeScript interfaces)              │   │  │
│  │  │  └─ Constants                                  │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │           Styling & Theming                    │   │  │
│  │  │  ├─ App.css (Global)                           │   │  │
│  │  │  ├─ Component CSS files (8 files)              │   │  │
│  │  │  ├─ PremiumFeatures.css (NEW)                  │   │  │
│  │  │  ├─ Light theme variables                      │   │  │
│  │  │  └─ Dark theme variables                       │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │              App Root                          │   │  │
│  │  │  └─ App.tsx (Master component)                 │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          ↕️ External APIs & Services (Optional)
    ├─ PDF.js (Rendering)
    ├─ Google Drive API
    ├─ OneDrive API
    ├─ AWS S3 API
    ├─ OpenAI / Claude API
    ├─ Tesseract.js (OCR)
    └─ Crypto.js (Encryption)
```

---

## Fluxo de Dados

### Cenário 1: Carregar e Visualizar PDF

```
User clica "Abrir PDF"
         ↓
   File Dialog (Electron)
         ↓
   PDFStore.setDocument()
         ↓
   PDFViewer renderiza canvas
         ↓
   PDF.js renderiza página
         ↓
   Exibe PDF na tela
```

### Cenário 2: Usar Funcionalidade Premium (OCR)

```
User clica "Premium Features" → OCR
         ↓
  PremiumFeatures componente
         ↓
  Chama window.electronApi.ocr.batchOCR()
         ↓
  IPC Main recebe evento
         ↓
  OCRHandler.batchOCR() executa
         ↓
  Processa PDF com Tesseract
         ↓
  Retorna texto extraído
         ↓
  Exibe resultado no UI
```

### Cenário 3: Sincronizar com Cloud

```
User seleciona "Cloud Sync"
         ↓
  CloudHandler.connectGoogleDrive()
         ↓
  OAuth flow
         ↓
  User autoriza
         ↓
  CloudHandler.uploadToCloud()
         ↓
  Arquivo enviado para Google Drive
         ↓
  Compartilhar link retornado
```

---

## Estrutura de Diretórios Detalhada

```
acrobat-clone/
│
├── 📂 electron/                        # Electron Main Process
│   ├── main.ts                         # Arquivo principal
│   ├── preload.ts                      # Context Bridge
│   │
│   └── 📂 handlers/                    # 11 Handlers (1340 linhas)
│       ├── pdfHandler.ts              # PDF operations
│       ├── annotationHandler.ts        # Anotações
│       ├── securityHandler.ts          # Segurança (Crypto)
│       ├── printHandler.ts             # Impressão
│       ├── ocrHandler.ts               # OCR (NEW)
│       ├── editorHandler.ts            # Edição PDF (NEW)
│       ├── formsHandler.ts             # Formulários (NEW)
│       ├── redactionHandler.ts         # Redação (NEW)
│       ├── cloudHandler.ts             # Cloud Sync (NEW)
│       ├── compareHandler.ts           # Comparação (NEW)
│       └── premiumHandlers.ts          # 4 handlers premium (NEW)
│           ├── PresentationHandler
│           ├── ConversionHandler
│           ├── AnalysisHandler
│           └── AIAssistantHandler
│
├── 📂 src/                             # React App
│   ├── index.tsx
│   ├── index.css
│   ├── App.tsx                         # App principal
│   ├── App.css
│   │
│   ├── 📂 components/                  # 11 Componentes (1375 linhas)
│   │   ├── PDFViewer.tsx              # Renderização PDF
│   │   ├── PDFViewer.css
│   │   ├── Toolbar.tsx                 # Barra de ferramentas
│   │   ├── Toolbar.css
│   │   ├── AnnotationPanel.tsx         # Painel de anotações
│   │   ├── AnnotationPanel.css
│   │   ├── AnnotationLayer.tsx         # Canvas de anotações
│   │   ├── AnnotationLayer.css
│   │   ├── SearchPanel.tsx             # Busca
│   │   ├── SearchPanel.css
│   │   ├── BookmarksPanel.tsx          # Marcadores
│   │   ├── BookmarksPanel.css
│   │   ├── PasswordDialog.tsx          # Dialog de senha
│   │   ├── PasswordDialog.css
│   │   ├── Sidebar.tsx                 # Sidebar
│   │   ├── Sidebar.css
│   │   ├── PremiumFeatures.tsx         # Premium (NEW)
│   │   └── PremiumFeatures.css
│   │
│   ├── 📂 store/                      # Zustand Stores (State Mgmt)
│   │   ├── pdfStore.ts                # PDF state
│   │   └── annotationStore.ts         # Annotation state
│   │
│   ├── 📂 types/                      # TypeScript Interfaces
│   │   ├── pdf.ts
│   │   └── annotations.ts
│   │
│   └── 📂 utils/                      # Utilitários
│       ├── pdfUtils.ts                # PDF.js wrapper
│       └── annotationUtils.ts         # Anotações utils
│
├── 📂 public/
│   └── index.html
│
├── 📚 Documentação (2703 linhas)
│   ├── README.md                       # Guia principal
│   ├── DEVELOPMENT.md                  # Guia técnico
│   ├── EXAMPLES.md                     # Exemplos de uso
│   ├── ARCHITECTURE.md                 # Este arquivo
│   ├── PREMIUM_SUMMARY.md              # Resumo premium
│   └── PREMIUM_FEATURES.md             # Docs premium (1000+ linhas)
│
├── 📋 Configuração
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.electron.json
│   ├── webpack.config.js
│   └── .gitignore
│
└── 📦 Build & Deploy
    └── (gerado por npm run build)
```

---

## Stack Tecnológico

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **CSS3** - Styling com variables

### Backend (Electron)
- **Electron 27** - Desktop framework
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Crypto** - Encryption (AES-256)

### Integração de PDFs
- **PDF.js** - Renderização
- **pdf-lib** - Edição (opcional)

### Premium Features (Externas)
- **Tesseract.js** - OCR
- **Google Drive API** - Cloud
- **OneDrive API** - Cloud
- **AWS SDK** - S3
- **OpenAI / Claude** - IA

### Build & Deploy
- **Webpack** - Bundler
- **TypeScript Compiler** - TS → JS
- **Electron Builder** - Criação de instaladores

---

## Fluxo de IPC (Inter-Process Communication)

```
Renderer Process                Main Process
(React)                         (Node.js)
    │                               │
    │  window.electronApi.pdf  
    │      .load(path)              │
    ├──────────────────────────────→ ipcMain.handle('pdf:load')
    │                               ↓
    │                         PDFHandler.load()
    │                               ↓
    │                         fs.readFileSync()
    │                               ↓
    │                         Retorna base64
    │ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
    │
    ├─→ Atualiza PDFStore
    │
    ├─→ PDFViewer re-renderiza
    │
    ├─→ Canvas exibe PDF
```

---

## Padrões de Design Utilizados

### 1. **Separation of Concerns**
- Handlers para lógica
- Components para UI
- Stores para estado
- Utils para funções reutilizáveis

### 2. **IPC Secure Bridge**
- Context isolation ativado
- Preload script como bridge
- Node integration desativado
- Sandbox mode ativado

### 3. **State Management**
- Zustand para simplicidade
- Actions para mutações
- Single source of truth

### 4. **Component Composition**
- Componentes pequenos e reutilizáveis
- Props bem tipadas
- Hooks para estado local

### 5. **Type Safety**
- TypeScript 100%
- Interfaces para tudo
- Generics quando necessário

---

## Performance Considerations

### Otimizações Implementadas

1. **Lazy Loading**
   - Handlers carregados sob demanda
   - Componentes code-split (futuro)

2. **Memoization**
   - React.memo para componentes
   - useMemo para computações

3. **Virtual Scrolling**
   - Anotações renderizam virtualmente
   - Bookmarks otimizados

4. **Async Processing**
   - OCR, conversão, IA em background
   - IPC async/await

5. **Caching**
   - PDF cache em memória
   - Annotation cache persistente

---

## Escalabilidade

### Adicionar Nova Feature Premium

1. **Criar Handler**
   ```typescript
   // electron/handlers/newHandler.ts
   export class NewHandler {
     async doSomething(): Promise<any> { }
   }
   ```

2. **Registrar IPC**
   ```typescript
   // electron/main.ts
   ipcMain.handle('new:doSomething', async () => {
     return newHandler.doSomething();
   });
   ```

3. **Expor no Preload**
   ```typescript
   // electron/preload.ts
   const newApi = {
     doSomething: () => ipcRenderer.invoke('new:doSomething')
   };
   ```

4. **Usar no Componente**
   ```typescript
   await window.electronApi.new.doSomething();
   ```

---

## Security Model

```
User Input
   ↓
React Component (Client-side validation)
   ↓
IPC Bridge (Context isolated)
   ↓
Electron Main (Trust boundary)
   ↓
Handler (Server-side validation)
   ↓
File System / External APIs
```

---

## Deployment Architecture

```
Development:
npm run dev → Webpack dev server + Electron dev

Production:
npm run build → React build
            → Webpack compile Electron
            → Electron builder → Installers
            → .exe / .dmg / .AppImage
```

---

## Monitoramento & Logging

Pontos de logging sugeridos:

- ✅ IPC calls
- ✅ File operations
- ✅ Error handling
- ✅ Performance metrics
- ✅ User actions

---

**Arquitetura versão**: 2.0 Premium
**Última atualização**: 2024
