import React, { useState } from 'react';
import { useAnnotationStore } from '@store/annotationStore';
import { usePDFStore } from '@store/pdfStore';
import { AnnotationUtil } from '@utils/annotationUtils';
import './AnnotationPanel.css';

const AnnotationPanel: React.FC = () => {
  const {
    currentTool,
    setCurrentTool,
    toolOptions,
    setToolOptions,
    annotations,
    removeAnnotation,
    clearAnnotations
  } = useAnnotationStore();

  const { viewState } = usePDFStore();

  const handleToolClick = (tool: any) => {
    setCurrentTool(currentTool === tool ? null : tool);
  };

  const handleSaveAnnotations = async () => {
    if (window.electronApi) {
      // This would be connected to file path
      await window.electronApi.annotation.save('/path/to/pdf', annotations);
    }
  };

  const currentPageAnnotations = annotations.filter(
    (a) => a.pageNumber === viewState.currentPage
  );

  return (
    <div className="annotation-panel">
      <div className="panel-section">
        <h4>Ferramentas</h4>
        <div className="tools-grid">
          <button
            className={`tool-btn ${currentTool === 'highlight' ? 'active' : ''}`}
            onClick={() => handleToolClick('highlight')}
            title="Highlight"
          >
            🟨 Destacar
          </button>
          <button
            className={`tool-btn ${currentTool === 'underline' ? 'active' : ''}`}
            onClick={() => handleToolClick('underline')}
            title="Underline"
          >
            <u>Sublinhar</u>
          </button>
          <button
            className={`tool-btn ${currentTool === 'text-box' ? 'active' : ''}`}
            onClick={() => handleToolClick('text-box')}
            title="Text Box"
          >
            📝 Caixa Texto
          </button>
          <button
            className={`tool-btn ${currentTool === 'drawing' ? 'active' : ''}`}
            onClick={() => handleToolClick('drawing')}
            title="Drawing"
          >
            ✏️ Desenho
          </button>
          <button
            className={`tool-btn ${currentTool === 'comment' ? 'active' : ''}`}
            onClick={() => handleToolClick('comment')}
            title="Comment"
          >
            💬 Comentário
          </button>
          <button
            className={`tool-btn ${currentTool === 'signature' ? 'active' : ''}`}
            onClick={() => handleToolClick('signature')}
            title="Signature"
          >
            ✍️ Assinatura
          </button>
        </div>
      </div>

      {currentTool && (
        <div className="panel-section">
          <h4>Opções de {currentTool}</h4>
          <div className="options-group">
            <label>
              Cor:
              <input
                type="color"
                value={toolOptions.color}
                onChange={(e) => setToolOptions({ color: e.target.value })}
              />
            </label>

            {(currentTool === 'drawing' || currentTool === 'underline') && (
              <label>
                Espessura:
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={toolOptions.lineWidth}
                  onChange={(e) => setToolOptions({ lineWidth: parseInt(e.target.value) })}
                />
                <span>{toolOptions.lineWidth}px</span>
              </label>
            )}

            {currentTool === 'highlight' && (
              <label>
                Opacidade:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={toolOptions.opacity}
                  onChange={(e) => setToolOptions({ opacity: parseFloat(e.target.value) })}
                />
                <span>{Math.round(toolOptions.opacity * 100)}%</span>
              </label>
            )}

            {currentTool === 'text-box' && (
              <label>
                Tamanho Fonte:
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={toolOptions.fontSize}
                  onChange={(e) => setToolOptions({ fontSize: parseInt(e.target.value) })}
                />
                <span>{toolOptions.fontSize}pt</span>
              </label>
            )}
          </div>
        </div>
      )}

      <div className="panel-section">
        <h4>Anotações desta Página ({currentPageAnnotations.length})</h4>
        <div className="annotations-list">
          {currentPageAnnotations.length === 0 ? (
            <p className="empty-list">Nenhuma anotação nesta página</p>
          ) : (
            currentPageAnnotations.map((annotation) => (
              <div key={annotation.id} className="annotation-item">
                <div className="annotation-header">
                  <span className="annotation-type">{annotation.type}</span>
                  <button
                    className="delete-btn"
                    onClick={() => removeAnnotation(annotation.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
                {annotation.content && (
                  <p className="annotation-content">{annotation.content}</p>
                )}
                <small>{new Date(annotation.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel-section">
        <button className="save-btn" onClick={handleSaveAnnotations}>
          💾 Salvar Anotações
        </button>
        <button
          className="clear-btn"
          onClick={() => {
            if (window.confirm('Limpar todas as anotações?')) {
              clearAnnotations();
            }
          }}
        >
          🗑️ Limpar Tudo
        </button>
      </div>
    </div>
  );
};

export default AnnotationPanel;
