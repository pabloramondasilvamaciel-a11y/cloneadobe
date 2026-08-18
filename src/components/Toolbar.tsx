import React, { useState } from 'react';
import { usePDFStore } from '@store/pdfStore';
import './Toolbar.css';

interface ToolbarProps {
  onSidebarToggle: () => void;
  onAnnotationsClick: () => void;
  onSearchClick: () => void;
  onBookmarksClick: () => void;
  filePath: string | null;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSidebarToggle,
  onAnnotationsClick,
  onSearchClick,
  onBookmarksClick,
  filePath
}) => {
  const { viewState, setCurrentPage, setZoom, document: pdfDocument } = usePDFStore();
  const [pageInput, setPageInput] = useState('');

  const handleGoToPage = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page > 0 && pdfDocument && page <= pdfDocument.numPages) {
      setCurrentPage(page);
      setPageInput('');
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseInt(e.target.value, 10));
  };

  const handlePrint = async () => {
    if (window.electronApi) {
      await window.electronApi.print.execute({ filePath });
    }
  };

  const handleProtect = async () => {
    if (window.electronApi) {
      const password = prompt('Enter password to protect the PDF:');
      if (password) {
        await window.electronApi.security.protect(filePath, password, {
          canPrint: true,
          canCopy: true,
          canModify: false
        });
      }
    }
  };

  const getFileName = (path: string | null) => {
    if (!path) return '';
    return path.split(/[\\/]/).pop() || '';
  };

  return (
    <div className="toolbar">
      {/* Left: Logo and Title */}
      <div className="toolbar-left">
        <button
          title="Toggle Sidebar"
          onClick={onSidebarToggle}
          className="menu-button"
        >
          ☰
        </button>

        <div className="toolbar-logo">
          <img src="logo-header.png" alt="Escaneando" />
        </div>

        {pdfDocument && (
          <h1 className="toolbar-title">{getFileName(filePath)}</h1>
        )}
      </div>

      {/* Center: Navigation and Controls */}
      {pdfDocument && (
        <div className="toolbar-center">
          {/* Search */}
          <button
            onClick={onSearchClick}
            title="Search"
            className="icon-button"
          >
            🔍
          </button>

          {/* Page Navigation */}
          <div className="page-input-group">
            <button
              onClick={() => setCurrentPage(Math.max(1, viewState.currentPage - 1))}
              disabled={viewState.currentPage <= 1}
              title="Previous Page"
              className="nav-button"
            >
              ◀
            </button>

            <input
              type="number"
              min="1"
              max={pdfDocument.numPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
              placeholder={`${viewState.currentPage}`}
              title="Go to page"
              className="page-input"
            />
            <span className="page-divider">/</span>
            <span className="page-total">{pdfDocument.numPages}</span>

            <button
              onClick={() => setCurrentPage(Math.min(pdfDocument.numPages, viewState.currentPage + 1))}
              disabled={viewState.currentPage >= pdfDocument.numPages}
              title="Next Page"
              className="nav-button"
            >
              ▶
            </button>
          </div>

          {/* Zoom */}
          <div className="zoom-group">
            <button
              onClick={() => setZoom(Math.max(50, viewState.zoom - 10))}
              title="Zoom Out"
              className="icon-button"
            >
              🔍−
            </button>

            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={viewState.zoom}
              onChange={handleZoomChange}
              title="Zoom Level"
              className="zoom-slider"
            />

            <button
              onClick={() => setZoom(Math.min(400, viewState.zoom + 10))}
              title="Zoom In"
              className="icon-button"
            >
              🔍+
            </button>

            <span className="zoom-label">{viewState.zoom}%</span>
          </div>

          {/* Mode buttons */}
          <button
            onClick={() => document.documentElement.style.colorScheme = viewState.isDark ? 'light' : 'dark'}
            title="Toggle theme"
            className="icon-button"
          >
            {viewState.isDark ? '☀️' : '🌙'}
          </button>
        </div>
      )}

      {/* Right: Tools */}
      <div className="toolbar-right">
        {pdfDocument && (
          <>
            <button
              onClick={onAnnotationsClick}
              title="Annotations"
              className="tool-button"
            >
              ✏️ Notas
            </button>

            <button
              onClick={onBookmarksClick}
              title="Bookmarks"
              className="tool-button"
            >
              🔖 Destaques
            </button>

            <button
              onClick={handlePrint}
              title="Print"
              className="tool-button"
            >
              🖨️
            </button>

            <button
              onClick={handleProtect}
              title="Protect Document"
              className="tool-button"
            >
              🔒
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
