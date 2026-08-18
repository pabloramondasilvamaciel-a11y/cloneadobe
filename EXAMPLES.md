# Exemplos de Uso - PDF Reader Pro

## Exemplos Práticos

### 1. Abrir e Renderizar um PDF

```typescript
// App.tsx
import { useEffect } from 'react';
import { usePDFStore } from '@store/pdfStore';
import { pdfUtil } from '@utils/pdfUtils';

function PDFApp() {
  const { setDocument, setLoading } = usePDFStore();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        
        // Usar Electron API para carregar arquivo
        const result = await window.electronApi.pdf.load('/path/to/pdf.pdf');
        
        if (result.success) {
          // Converter base64 para ArrayBuffer
          const arrayBuffer = Uint8Array.from(
            atob(result.data),
            c => c.charCodeAt(0)
          ).buffer;
          
          // Carregar com PDF.js
          const pdf = await pdfUtil.loadPDF(arrayBuffer);
          
          // Atualizar store
          setDocument({
            id: Date.now().toString(),
            path: '/path/to/pdf.pdf',
            filename: 'documento.pdf',
            numPages: pdf.numPages,
            currentPage: 1,
            zoom: 100,
            isEncrypted: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, []);

  return <div>Seu componente aqui</div>;
}
```

### 2. Adicionar Anotações

```typescript
// AnnotationExample.tsx
import { useAnnotationStore } from '@store/annotationStore';
import { useAnnotationStore } from '@store/annotationStore';
import { AnnotationUtil } from '@utils/annotationUtils';

function AddAnnotations() {
  const { annotations, addAnnotation, removeAnnotation } = useAnnotationStore();

  // Criar e adicionar highlight
  const handleAddHighlight = () => {
    const highlight = AnnotationUtil.createHighlight(
      1, // página
      50, // x
      100, // y
      200, // width
      30, // height
      '#FFFF00' // cor amarela
    );
    addAnnotation(highlight);
  };

  // Criar e adicionar desenho
  const handleAddDrawing = () => {
    const points = [
      { x: 10, y: 10 },
      { x: 20, y: 30 },
      { x: 40, y: 25 },
      { x: 50, y: 45 }
    ];

    const drawing = AnnotationUtil.createDrawing(
      1,
      points,
      '#FF0000', // vermelho
      3 // espessura
    );
    addAnnotation(drawing);
  };

  // Criar e adicionar caixa de texto
  const handleAddTextBox = () => {
    const textBox = AnnotationUtil.createTextBox(
      1,
      100,
      100,
      150,
      50,
      'Texto importante',
      14,
      '#000000'
    );
    addAnnotation(textBox);
  };

  // Criar e adicionar comentário
  const handleAddComment = () => {
    const comment = AnnotationUtil.createComment(
      1,
      200,
      150,
      'Este é um comentário sobre a página'
    );
    addAnnotation(comment);
  };

  return (
    <div>
      <button onClick={handleAddHighlight}>Adicionar Highlight</button>
      <button onClick={handleAddDrawing}>Adicionar Desenho</button>
      <button onClick={handleAddTextBox}>Adicionar Texto</button>
      <button onClick={handleAddComment}>Adicionar Comentário</button>
      
      <div>
        <h3>Anotações ({annotations.length})</h3>
        {annotations.map(ann => (
          <div key={ann.id}>
            <p>{ann.type}: {ann.content || 'Sem conteúdo'}</p>
            <button onClick={() => removeAnnotation(ann.id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddAnnotations;
```

### 3. Pesquisar Texto

```typescript
// SearchExample.tsx
import { useState } from 'react';
import { pdfUtil } from '@utils/pdfUtils';

function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchResults = await pdfUtil.searchText(searchQuery, {
        matchCase: false
      });
      setResults(searchResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder="Pesquisar no PDF..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Pesquisando...' : 'Pesquisar'}
      </button>

      <div>
        <h3>Resultados ({results.length})</h3>
        {results.map((result, idx) => (
          <div key={idx}>
            <strong>Página {result.page}</strong>
            <p>{result.text}</p>
            <small>{result.matches} ocorrência(s)</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchExample;
```

### 4. Proteger PDF com Senha

```typescript
// ProtectExample.tsx
import { useState } from 'react';

function ProtectExample() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProtect = async () => {
    if (!password.trim()) return;

    setLoading(true);
    try {
      const result = await window.electronApi.security.protect(
        '/path/to/pdf.pdf',
        password,
        {
          canPrint: true,
          canCopy: false,
          canModify: false
        }
      );

      if (result.success) {
        alert(`PDF protegido em: ${result.path}`);
      }
    } catch (error) {
      alert(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Proteger PDF</h2>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Digite uma senha forte..."
      />
      <button onClick={handleProtect} disabled={loading}>
        {loading ? 'Protegendo...' : 'Proteger'}
      </button>
    </div>
  );
}

export default ProtectExample;
```

### 5. Usar Bookmarks

```typescript
// BookmarksExample.tsx
import { useState } from 'react';
import { usePDFStore } from '@store/pdfStore';

interface Bookmark {
  id: string;
  page: number;
  title: string;
  createdAt: Date;
}

function BookmarksExample() {
  const { viewState, setCurrentPage } = usePDFStore();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const handleAddBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      page: viewState.currentPage,
      title: `Página ${viewState.currentPage}`,
      createdAt: new Date()
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const handleGoToBookmark = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <button onClick={handleAddBookmark}>
        Adicionar Bookmark (Página {viewState.currentPage})
      </button>

      <ul>
        {bookmarks.map(bookmark => (
          <li key={bookmark.id}>
            <button onClick={() => handleGoToBookmark(bookmark.page)}>
              {bookmark.title}
            </button>
            <button onClick={() => setBookmarks(bookmarks.filter(b => b.id !== bookmark.id))}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookmarksExample;
```

### 6. Navegar Entre Páginas

```typescript
// NavigationExample.tsx
import { usePDFStore } from '@store/pdfStore';

function NavigationExample() {
  const { viewState, document, setCurrentPage, setZoom } = usePDFStore();

  const handleNextPage = () => {
    if (document && viewState.currentPage < document.numPages) {
      setCurrentPage(viewState.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (viewState.currentPage > 1) {
      setCurrentPage(viewState.currentPage - 1);
    }
  };

  const handleGoToPage = (pageNum: number) => {
    if (document && pageNum > 0 && pageNum <= document.numPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleZoom = (factor: number) => {
    const newZoom = viewState.zoom + factor;
    if (newZoom >= 50 && newZoom <= 400) {
      setZoom(newZoom);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handlePrevPage}>← Anterior</button>
        <span>
          Página {viewState.currentPage} de {document?.numPages}
        </span>
        <button onClick={handleNextPage}>Próxima →</button>
      </div>

      <div>
        <button onClick={() => handleZoom(-10)}>🔍− Zoom Out</button>
        <span>{viewState.zoom}%</span>
        <button onClick={() => handleZoom(10)}>🔍+ Zoom In</button>
      </div>

      <div>
        <input
          type="number"
          min={1}
          max={document?.numPages}
          onChange={e => handleGoToPage(parseInt(e.target.value))}
          placeholder="Ir para página..."
        />
      </div>
    </div>
  );
}

export default NavigationExample;
```

### 7. Salvar e Carregar Anotações

```typescript
// AnnotationPersistenceExample.tsx
import { useAnnotationStore } from '@store/annotationStore';

function AnnotationPersistence() {
  const { annotations } = useAnnotationStore();

  const handleSaveAnnotations = async () => {
    if (window.electronApi) {
      try {
        const result = await window.electronApi.annotation.save(
          '/path/to/pdf.pdf',
          annotations
        );
        alert(`Anotações salvas em: ${result.path}`);
      } catch (error) {
        alert(`Erro ao salvar: ${error}`);
      }
    }
  };

  const handleLoadAnnotations = async () => {
    if (window.electronApi) {
      try {
        const result = await window.electronApi.annotation.load(
          '/path/to/pdf.pdf'
        );
        console.log('Anotações carregadas:', result.annotations);
      } catch (error) {
        alert(`Erro ao carregar: ${error}`);
      }
    }
  };

  return (
    <div>
      <button onClick={handleSaveAnnotations}>💾 Salvar Anotações</button>
      <button onClick={handleLoadAnnotations}>📂 Carregar Anotações</button>
      <p>Total de anotações: {annotations.length}</p>
    </div>
  );
}

export default AnnotationPersistence;
```

### 8. Imprimir PDF

```typescript
// PrintExample.tsx
import { useState } from 'react';

function PrintExample() {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const result = await window.electronApi.print.execute({
        filePath: '/path/to/pdf.pdf',
        silent: false,
        printBackground: true,
        copies: 1,
        pageSize: 'A4'
      });

      alert(result.message);
    } catch (error) {
      alert(`Erro ao imprimir: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePrint} disabled={loading}>
      {loading ? '🖨️ Imprimindo...' : '🖨️ Imprimir'}
    </button>
  );
}

export default PrintExample;
```

## Casos de Uso Comuns

### Integrar com Sistema Externo

```typescript
// IntegrationExample.tsx
import { useEffect } from 'react';

function IntegrationExample() {
  useEffect(() => {
    // Quando arquivo é aberto via menu do Electron
    if (window.electronApi) {
      window.electronApi.pdf.onFileOpen((filePath: string) => {
        console.log('Arquivo aberto:', filePath);
        // Carregar PDF
      });

      // Quando usuário quer imprimir
      window.electronApi.print.onPrintRequest(() => {
        console.log('Print solicitado');
        // Abrir dialog de impressão
      });

      // Quando usuário quer proteger
      window.electronApi.security.onProtectRequest(() => {
        console.log('Proteção solicitada');
        // Abrir dialog de proteção
      });
    }
  }, []);

  return <div>Sistema integrado com Electron</div>;
}

export default IntegrationExample;
```

---

Para mais exemplos e documentação, veja [DEVELOPMENT.md](./DEVELOPMENT.md).
