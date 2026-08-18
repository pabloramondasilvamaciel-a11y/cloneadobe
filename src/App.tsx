import React, { useEffect, useState } from 'react';
import { usePDFStore } from '@store/pdfStore';
import { useAnnotationStore } from '@store/annotationStore';
import PDFViewer from '@components/PDFViewer';
import Toolbar from '@components/Toolbar';
import Sidebar from '@components/Sidebar';
import AnnotationPanel from '@components/AnnotationPanel';
import SearchPanel from '@components/SearchPanel';
import BookmarksPanel from '@components/BookmarksPanel';
import PasswordDialog from '@components/PasswordDialog';
import './App.css';

interface Window {
  electronApi?: any;
}

const App: React.FC = () => {
  const { document: pdfDocument, viewState } = usePDFStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<'annotations' | 'search' | 'bookmarks' | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (window.electronApi) {
      // Listen for file open events from Electron menu
      window.electronApi.pdf.onFileOpen((path: string) => {
        setFilePath(path);
      });

      // Listen for zoom events
      window.electronApi.pdf.onZoomIn(() => {
        // Handle zoom in
      });

      window.electronApi.pdf.onZoomOut(() => {
        // Handle zoom out
      });

      window.electronApi.pdf.onThemeChange((theme: string) => {
        // Handle theme change
      });

      // Listen for print requests
      window.electronApi.print.onPrintRequest(() => {
        // Handle print request
      });

      // Listen for security requests
      window.electronApi.security.onProtectRequest(() => {
        // Handle protect request
      });
    }

    // Handle drag and drop
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files[0].name.endsWith('.pdf')) {
        setFilePath(files[0].path);
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  const isDark = viewState.isDark;

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <Toolbar
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onAnnotationsClick={() => setActivePanel(activePanel === 'annotations' ? null : 'annotations')}
        onSearchClick={() => setActivePanel(activePanel === 'search' ? null : 'search')}
        onBookmarksClick={() => setActivePanel(activePanel === 'bookmarks' ? null : 'bookmarks')}
        filePath={filePath}
      />

      <div className="app-container">
        {sidebarOpen && (
          <aside className="sidebar">
            {activePanel === 'annotations' && <AnnotationPanel />}
            {activePanel === 'search' && <SearchPanel />}
            {activePanel === 'bookmarks' && <BookmarksPanel />}
            {!activePanel && <DefaultSidebar />}
          </aside>
        )}

        <main className="main-content">
          {filePath ? (
            <PDFViewer filePath={filePath} />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {passwordRequired && (
        <PasswordDialog
          onSubmit={(password) => {
            setPasswordRequired(false);
            // Handle password verification
          }}
          onCancel={() => setPasswordRequired(false)}
        />
      )}
    </div>
  );
};

const DefaultSidebar: React.FC = () => (
  <div className="default-sidebar">
    <div className="sidebar-header">Biblioteca</div>
    <div className="sidebar-content">
      <div className="sidebar-nav">
        <div className="sidebar-nav-item active">
          <span className="sidebar-nav-icon">📚</span>
          <span>Biblioteca</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">⏱️</span>
          <span>Recentes</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">⭐</span>
          <span>Favoritos</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">📁</span>
          <span>Coleções</span>
        </div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px' }} className="app.dark" style={{ borderTopColor: 'var(--color-border-dark)' }}>
      <div className="sidebar-header" style={{ padding: '0 0 12px 0', textTransform: 'uppercase' }}>Ecossistema</div>
      <div className="sidebar-nav">
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">🔖</span>
          <span>Marcadores</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">📝</span>
          <span>Notas</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">🔍</span>
          <span>Busca</span>
        </div>
        <div className="sidebar-nav-item">
          <span className="sidebar-nav-icon">🎨</span>
          <span>Modo Foco</span>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="empty-state">
    <div className="empty-state-content">
      <div style={{ marginBottom: '20px' }}>
        <img src="logo-header.png" alt="Escaneando" style={{ height: '60px', width: 'auto' }} />
      </div>
      <h2>Escaneando Reader</h2>
      <p>Leitor de PDF com biblioteca, leitura, estudo e privacidade local</p>
      <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
        Arraste um arquivo PDF aqui ou clique em Abrir para começar
      </p>
      <div className="features">
        <div className="feature">
          <span className="feature-icon">📚</span>
          <span className="feature-text">Biblioteca</span>
        </div>
        <div className="feature">
          <span className="feature-icon">📖</span>
          <span className="feature-text">Leitura</span>
        </div>
        <div className="feature">
          <span className="feature-icon">✏️</span>
          <span className="feature-text">Estudo</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <span className="feature-text">Privacidade</span>
        </div>
      </div>
    </div>
  </div>
);

export default App;
