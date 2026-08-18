# 🚀 Quick Start - PDF Reader Pro Premium

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Descompactar (30 segundos)
```bash
tar -xzf acrobat-clone-premium.tar.gz
cd acrobat-clone
```

### 2️⃣ Instalar (2 minutos)
```bash
npm install
```

### 3️⃣ Rodar (30 segundos)
```bash
npm run dev
```

### 4️⃣ Usar (1 minuto)
- Abra um PDF
- Explore as features premium
- Clique em cada ícone para testar

---

## 📋 Checklist de Features

### Base Features (Já Inclusos)
- [x] Renderizar PDF
- [x] Navegar páginas
- [x] Zoom in/out
- [x] Anotações (highlight, underline, desenho)
- [x] Busca de texto
- [x] Bookmarks
- [x] Proteção por senha
- [x] Impressão

### Premium Features (10 Novas)
- [x] 🔤 OCR - Extrair texto de imagens
- [x] ✏️ Editor - Editar, mesclar, rotar PDFs
- [x] 📋 Forms - Preencher formulários
- [x] 🔐 Redaction - Ocultar dados sensíveis
- [x] ☁️ Cloud - Google Drive, OneDrive, S3
- [x] 🔀 Compare - Comparar dois PDFs
- [x] 🎥 Present - Modo apresentação
- [x] 🔄 Convert - Converter para DOCX, XLSX, etc
- [x] 📊 Analysis - Analisar documentos
- [x] 🤖 AI - Chat com IA sobre PDF

---

## 🎯 Exemplos Rápidos

### Usar OCR
```typescript
const text = await window.electronApi.ocr.batchOCR('arquivo.pdf');
console.log(text);
```

### Mesclar PDFs
```typescript
await window.electronApi.editor.mergePDFs(
  ['pdf1.pdf', 'pdf2.pdf'],
  'merged.pdf'
);
```

### Converter para Word
```typescript
await window.electronApi.conversion.convertToFormat(
  'documento.pdf',
  'docx',
  'documento.docx'
);
```

### Fazer Pergunta com IA
```typescript
const answer = await window.electronApi.ai.askAI(
  'documento.pdf',
  'Qual é o tema principal?'
);
console.log(answer.answer);
```

### Comparar PDFs
```typescript
const result = await window.electronApi.compare.comparePDFs(
  'v1.pdf',
  'v2.pdf'
);
console.log(`${result.similarities}% similar`);
```

---

## 📁 Estrutura Importante

```
acrobat-clone/
├── electron/handlers/          # Backend logic
│   ├── ocrHandler.ts
│   ├── editorHandler.ts
│   ├── formsHandler.ts
│   ├── redactionHandler.ts
│   ├── cloudHandler.ts
│   ├── compareHandler.ts
│   └── premiumHandlers.ts      # 4 handlers em 1
│
├── src/components/
│   ├── PremiumFeatures.tsx     # Interface premium
│   └── (10 componentes mais)
│
├── PREMIUM_FEATURES.md         # Docs completas (1000+ linhas)
├── ARCHITECTURE.md             # Diagrama e fluxos
└── README.md                   # Guia principal
```

---

## 🔧 Comandos Principais

```bash
# Desenvolvimento
npm run dev                # Rodar com hot-reload

# Build
npm run build             # Build React + Electron
npm run dist              # Criar instaladores

# Desenvolvimento específico
npm run react-dev         # Apenas React
npm run electron-dev      # Apenas Electron (requer React rodando)
```

---

## 🎨 Customizações Rápidas

### Mudar Cores
Editar `src/App.css`:
```css
:root {
  --color-accent: #0066cc;      /* Mudar cor primária */
  --color-danger: #cc0000;       /* Mudar cor de perigo */
  --color-success: #00aa00;      /* Mudar cor de sucesso */
}
```

### Ativar Dark Mode
O tema dark/light é automático, mas você pode forçar:
```typescript
usePDFStore.getState().setDarkMode(true);
```

### Adicionar Seu Logo
1. Coloque a imagem em `public/logo.png`
2. Importe no `src/components/Toolbar.tsx`
3. Exiba no toolbar

---

## 🚨 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| PDF não carrega | Verificar caminho, usar caminho absoluto |
| Premium features não aparecem | Abrir um PDF primeiro |
| Build falha | Rodar `npm install` novamente |
| Styles não aplicam | Limpar cache com Ctrl+Shift+R |
| IPC não responde | Verificar console (F12) para erros |

---

## 📚 Documentação Recomendada

1. **PRIMEIRO**: Ler `README.md` (guia principal)
2. **DEPOIS**: Ler `PREMIUM_SUMMARY.md` (visão geral premium)
3. **TÉCNICO**: Ler `DEVELOPMENT.md` (como estender)
4. **REFERÊNCIA**: Ler `PREMIUM_FEATURES.md` (API detalhada)
5. **ARQUITETURA**: Ler `ARCHITECTURE.md` (como funciona)

---

## 🔑 Arquivo de Configuração Importante

`package.json`:
```json
{
  "main": "dist/main.js",
  "homepage": "./",
  "scripts": {
    "dev": "concurrently \"npm run electron-dev\" \"npm run react-dev\"",
    "build": "npm run react-build && npm run electron-build && electron-builder"
  }
}
```

---

## 🎯 Próximos Passos Técnicos

### Para Estender
1. Criar novo handler em `electron/handlers/`
2. Registrar IPC em `electron/main.ts`
3. Expor no `electron/preload.ts`
4. Usar em componente React

### Para Publicar
```bash
npm run dist
# Gera: .exe, .dmg, .AppImage
```

### Para Deploy
1. Committar para Git
2. Criar release
3. Upload para GitHub / Servidor

---

## 💾 Estrutura de Dados

### PDFStore (Zustand)
```typescript
{
  document: {
    id: string;
    path: string;
    filename: string;
    numPages: number;
  };
  viewState: {
    currentPage: number;
    zoom: number;
    fit: 'page' | 'width' | 'height';
  };
}
```

### AnnotationStore (Zustand)
```typescript
{
  annotations: Annotation[];
  currentTool: 'highlight' | 'underline' | 'drawing' | ...;
  toolOptions: {
    color: string;
    lineWidth: number;
    opacity: number;
  };
}
```

---

## 🔐 Segurança

Tudo está configurado para segurança:
- ✅ Context isolation ativado
- ✅ Node integration desativado
- ✅ Sandbox mode ativado
- ✅ Preload script seguro
- ✅ Validação de entrada

---

## 📱 Responsividade

O projeto é responsivo para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

Teste redimensionando a janela!

---

## 🎓 Dicas Pro

1. **Use DevTools**: Pressione `F12` para abrir
2. **Console log**: Use `console.log()` livremente
3. **Hot reload**: Mudanças no React carregam automaticamente
4. **Extensões**: Instale React DevTools no Chrome

---

## 🆘 Suporte Rápido

### Erro? Procure em:
1. `DEVELOPMENT.md` - Seção Troubleshooting
2. Console (F12)
3. `PREMIUM_FEATURES.md` - Limitações de cada feature

### Dúvida técnica?
1. Ler `EXAMPLES.md` - 8 exemplos práticos
2. Ler `ARCHITECTURE.md` - Entender fluxos
3. Ler código comentado nos handlers

---

## ⏱️ Timeline de Setup

```
5 min  → Descompactar + npm install
10 min → npm run dev (pronto!)
15 min → Abrir PDF + testar features
20 min → Ler PREMIUM_SUMMARY.md
30 min → Revisar ARCHITECTURE.md
1h     → Explore o código
2h     → Customizar para suas necessidades
```

---

## 🎉 Você Está Pronto!

Seu PDF Reader Pro Premium está 100% configurado e pronto para:
- ✅ Rodar em desenvolvimento
- ✅ Estender com suas features
- ✅ Fazer build e distribuir
- ✅ Usar em produção

**Divirta-se!** 🚀

---

**Quick Start versão**: 1.0
**Última atualização**: 2024
**Status**: Pronto para usar ✅
