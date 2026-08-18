import React, { useEffect, useRef, useState } from 'react';
import { usePDFStore } from '@store/pdfStore';
import { useAnnotationStore } from '@store/annotationStore';
import { pdfUtil } from '@utils/pdfUtils';
import AnnotationLayer from './AnnotationLayer';
import './PDFViewer.css';

interface PDFViewerProps {
  filePath: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { document: pdfDocument, viewState, setDocument, setLoading: setStoreLoading, setError: setStoreError } = usePDFStore();
  const { annotations } = useAnnotationStore();

  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load PDF file from Electron
        if (window.electronApi) {
          const result = await window.electronApi.pdf.load(filePath);
          if (result.success) {
            const arrayBuffer = Uint8Array.from(atob(result.data), c => c.charCodeAt(0)).buffer;
            const pdf = await pdfUtil.loadPDF(arrayBuffer);

            if (isMounted) {
              setDocument({
                id: Date.now().toString(),
                path: filePath,
                filename: filePath.split('/').pop() || 'unknown',
                numPages: pdf.numPages,
                currentPage: 1,
                zoom: viewState.zoom,
                isEncrypted: false
              });

              // Render first page
              await renderPage(1, viewState.zoom);
            }
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF';
        if (isMounted) {
          setError(errorMessage);
          setStoreError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setStoreLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [filePath]);

  const renderPage = async (pageNumber: number, scale: number) => {
    if (!canvasRef.current) return;

    try {
      setLoading(true);
      const scalePercent = scale / 100;
      await pdfUtil.renderPage(pageNumber, canvasRef.current, scalePercent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render page';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfDocument && viewState.currentPage) {
      renderPage(viewState.currentPage, viewState.zoom);
    }
  }, [viewState.currentPage, viewState.zoom]);

  if (error) {
    return (
      <div className="pdf-viewer error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <div>
            <h3>Erro ao carregar PDF</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer" ref={containerRef}>
      <div className="pdf-canvas-container">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Carregando...</p>
          </div>
        )}
        <div className="pdf-page-wrapper">
          <canvas
            ref={canvasRef}
            className="pdf-canvas"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: loading ? 'none' : 'block'
            }}
          />
          {pdfDocument && (
            <AnnotationLayer
              pageNumber={viewState.currentPage}
              annotations={annotations.filter(a => a.pageNumber === viewState.currentPage)}
              canvasWidth={canvasRef.current?.width || 0}
              canvasHeight={canvasRef.current?.height || 0}
            />
          )}
        </div>
      </div>

      <div className="pdf-info">
        {pdfDocument && (
          <div className="pdf-stats">
            <span>Página {viewState.currentPage} de {pdfDocument.numPages}</span>
            <span>Zoom: {viewState.zoom}%</span>
            <span>{pdfDocument.filename}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
