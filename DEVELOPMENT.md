# Guia de Desenvolvimento - PDF Reader Pro

## Arquitetura da Aplicação

### Padrão de Comunicação

A aplicação usa IPC (Inter-Process Communication) para comunicação entre o processo principal (Electron) e o processo de renderização (React):

```
React Component
    ↓
window.electronApi (Preload bridge)
    ↓
IPC Main Handler
    ↓
Handler Class (pdfHandler, annotationHandler, etc)
```

## API Disponível

### PDF API

```typescript
// Carregar PDF
const result = await window.electronApi.pdf.load(filePath);
// Retorna: { success: boolean, data: string (base64) }

// Obter metadados
const metadata = await window.electronApi.pdf.getMetadata(filePath);

// Descriptografar arquivo protegido
const decrypted = await window.electronApi.pdf.decrypt(filePath, password);

// Listeners para eventos
window.electronApi.pdf.onFileOpen((path: string) => {});
window.electronApi.pdf.onZoomIn(() => {});
window.electronApi.pdf.onZoomOut(() => {});
window.electronApi.pdf.onThemeChange((theme: string) => {});
```

### Annotation API

```typescript
// Salvar anotações
await window.electronApi.annotation.save(pdfPath, annotations);

// Carregar anotações
const annotations = await window.electronApi.annotation.load(pdfPath);
```

### Security API

```typescript
// Proteger arquivo com senha
await window.electronApi.security.protect(filePath, password, options);

// Listener para requisições de proteção
window.electronApi.security.onProtectRequest(() => {});
```

### Print API

```typescript
// Gerar preview de impressão
const preview = await window.electronApi.print.preview(pdfPath);

// Executar impressão
await window.electronApi.print.execute(printOptions);

// Listener para requisições de impressão
window.electronApi.print.onPrintRequest(() => {});
```

## State Management com Zustand

### PDF Store

```typescript
import { usePDFStore } from '@store/pdfStore';

function MyComponent() {
  const { document, viewState, setCurrentPage, setZoom } = usePDFStore();

  return (
    <div>
      <p>Página: {viewState.currentPage}</p>
      <p>Zoom: {viewState.zoom}%</p>
      <button onClick={() => setCurrentPage(2)}>Ir para página 2</button>
    </div>
  );
}
```

### Annotation Store

```typescript
import { useAnnotationStore } from '@store/annotationStore';

function MyComponent() {
  const {
    annotations,
    currentTool,
    setCurrentTool,
    addAnnotation,
    removeAnnotation
  } = useAnnotationStore();

  return (
    <div>
      <button onClick={() => setCurrentTool('highlight')}>
        Destacar
      </button>
    </div>
  );
}
```

## Criando Nova Anotação

### Exemplo: Adicionar Highlight

```typescript
import { useAnnotationStore } from '@store/annotationStore';
import { AnnotationUtil } from '@utils/annotationUtils';

function HighlightButton() {
  const { addAnnotation } = useAnnotationStore();

  const handleHighlight = (pageNum: number, x: number, y: number, width: number, height: number) => {
    const highlight = AnnotationUtil.createHighlight(
      pageNum,
      x,
      y,
      width,
      height,
      '#FFFF00' // cor amarela
    );
    addAnnotation(highlight);
  };

  return <button onClick={() => handleHighlight(1, 10, 20, 100, 30)}>Destacar</button>;
}
```

## Renderização de PDF

### Usando PDFUtil

```typescript
import { pdfUtil } from '@utils/pdfUtils';

async function loadAndRenderPDF() {
  // Carregar PDF
  const pdf = await pdfUtil.loadPDF(arrayBuffer);
  console.log(`Total de páginas: ${pdfUtil.getPageCount()}`);

  // Renderizar página em canvas
  const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
  await pdfUtil.renderPage(1, canvas, 1.5); // página 1, escala 1.5x

  // Extrair texto
  const text = await pdfUtil.extractText(1);
  console.log(text);

  // Pesquisar texto
  const results = await pdfUtil.searchText('keyword', { matchCase: false });
  console.log(results);

  // Limpar recursos
  pdfUtil.destroy();
}
```

## Adicionar Nova Funcionalidade

### Passo 1: Criar Handler no Electron

```typescript
// electron/handlers/newHandler.ts
export class NewHandler {
  async doSomething(param: string): Promise<any> {
    return { success: true, data: param };
  }
}
```

### Passo 2: Registrar IPC Handler

```typescript
// electron/main.ts
import { NewHandler } from './handlers/newHandler';

const newHandler = new NewHandler();

ipcMain.handle('new:doSomething', async (event, param: string) => {
  return newHandler.doSomething(param);
});
```

### Passo 3: Adicionar ao Preload

```typescript
// electron/preload.ts
const newApi = {
  doSomething: (param: string) => ipcRenderer.invoke('new:doSomething', param)
};

const electronApi: ElectronApi = {
  // ... outros
  new: newApi
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
```

### Passo 4: Usar no Componente React

```typescript
// src/components/MyComponent.tsx
async function MyComponent() {
  const result = await window.electronApi.new.doSomething('test');
  console.log(result);
}
```

## Estilo e CSS

### Usando Variáveis CSS

Todas as cores estão definidas em `src/App.css`:

```css
:root {
  --color-bg-primary: #ffffff;
  --color-accent: #0066cc;
  /* ... */
}

.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.app.dark .my-component {
  background-color: var(--color-bg-primary-dark);
  color: var(--color-text-primary-dark);
}
```

## Debugging

### Abrir DevTools

O DevTools abre automaticamente em modo desenvolvimento. Para production:

```typescript
// electron/main.ts
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

### Logging

```typescript
// Console.log aparecerá no console do DevTools
console.log('Debug message');

// Para logs do Electron main process, use:
console.log('Main process log');
```

## Performance

### Otimizações Implementadas

1. **Virtual Scrolling** - Apenas anotações visíveis são renderizadas
2. **Lazy Loading** - PDFs são carregados sob demanda
3. **Memoization** - Componentes React usam React.memo
4. **Worker Thread** - PDF.js usa worker thread para renderização

### Dicas de Performance

1. Usar `useCallback` para handlers de eventos
2. Usar `useMemo` para computações pesadas
3. Avoid inline functions em props
4. Usar virtual lists para grandes listas de anotações

## Testes

### Estrutura de Testes (Futuro)

```bash
npm run test              # Rodar testes
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Build e Distribuição

### Build Local

```bash
npm run build     # Build React
npm run dist      # Criar instaladores
```

### Arquivos Gerados

- Windows: `acrobat-clone Setup 1.0.0.exe`
- macOS: `PDF Reader Pro 1.0.0.dmg`
- Linux: `pdf-reader-pro_1.0.0_amd64.AppImage`

## Troubleshooting

### PDF.js Worker não encontrado

Se receber erro de worker não encontrado:

```typescript
// src/utils/pdfUtils.ts
import * as pdfjsLib from 'pdfjs-dist';

// Ajuste o caminho para o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### IPC chamada não responde

Verificar se:
1. Handler foi registrado em `electron/main.ts`
2. API foi exposta no `electron/preload.ts`
3. `contextIsolation: true` está configurado

### Estilo não aplica em modo dark

Adicionar classe `dark` ao elemento raiz:

```typescript
document.body.classList.toggle('dark', isDark);
```

## Documentação Adicional

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [PDF.js Docs](https://mozilla.github.io/pdf.js)
- [Zustand Docs](https://zustand-demo.vercel.app/)
