import React, { useState } from 'react';
import '../components/DocProcessingPanel.css';

interface DocProcessingPanelProps {
  onClose?: () => void;
}

export const DocProcessingPanel: React.FC<DocProcessingPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'merge' | 'split' | 'reorder' | 'rotate' | 'extract'>('merge');
  const [processing, setProcessing] = useState(false);

  const handleMergePDFs = async () => {
    setProcessing(true);
    try {
      await (window as any).electronApi.docProcessing?.mergePDFs(['file1.pdf', 'file2.pdf'], 'output.pdf');
    } catch (error) {
      console.error('Erro ao mesclar PDFs:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSplitPDF = async () => {
    setProcessing(true);
    try {
      await (window as any).electronApi.docProcessing?.splitPDF('file.pdf', [
        { start: 1, end: 5 },
        { start: 6, end: 10 },
      ], './split-output');
    } catch (error) {
      console.error('Erro ao dividir PDF:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="doc-processing-panel">
      <div className="panel-header">
        <h2>📄 Processamento de Documentos</h2>
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'merge' ? 'active' : ''}`}
          onClick={() => setActiveTab('merge')}
        >
          Mesclar
        </button>
        <button
          className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`}
          onClick={() => setActiveTab('split')}
        >
          Dividir
        </button>
        <button
          className={`tab-btn ${activeTab === 'reorder' ? 'active' : ''}`}
          onClick={() => setActiveTab('reorder')}
        >
          Reordenar
        </button>
        <button
          className={`tab-btn ${activeTab === 'rotate' ? 'active' : ''}`}
          onClick={() => setActiveTab('rotate')}
        >
          Girar
        </button>
        <button
          className={`tab-btn ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}
        >
          Extrair
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'merge' && (
          <div className="operation-container">
            <h3>✂️ Mesclar Múltiplos PDFs</h3>
            <p>Combine dois ou mais PDFs em um único arquivo.</p>
            <div className="file-input-group">
              <input type="file" multiple accept=".pdf" placeholder="Selecione PDFs para mesclar" />
            </div>
            <button className="action-btn primary" onClick={handleMergePDFs} disabled={processing}>
              {processing ? 'Processando...' : 'Mesclar PDFs'}
            </button>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="operation-container">
            <h3>🔪 Dividir PDF</h3>
            <p>Divida um PDF em múltiplos arquivos por intervalo de páginas.</p>
            <div className="form-group">
              <label>Arquivo PDF</label>
              <input type="file" accept=".pdf" />
            </div>
            <div className="form-group">
              <label>Intervalo 1 (ex: páginas 1-5)</label>
              <input type="text" placeholder="1-5" />
            </div>
            <div className="form-group">
              <label>Intervalo 2 (ex: páginas 6-10)</label>
              <input type="text" placeholder="6-10" />
            </div>
            <button className="action-btn primary" onClick={handleSplitPDF} disabled={processing}>
              {processing ? 'Dividindo...' : 'Dividir PDF'}
            </button>
          </div>
        )}

        {activeTab === 'reorder' && (
          <div className="operation-container">
            <h3>🔄 Reordenar Páginas</h3>
            <p>Arraste e solte para reorganizar páginas.</p>
            <div className="page-list">
              <div className="page-item draggable">
                <span>📄 Página 1</span>
                <button>⋮</button>
              </div>
              <div className="page-item draggable">
                <span>📄 Página 2</span>
                <button>⋮</button>
              </div>
              <div className="page-item draggable">
                <span>📄 Página 3</span>
                <button>⋮</button>
              </div>
            </div>
            <button className="action-btn primary">Salvar Ordem</button>
          </div>
        )}

        {activeTab === 'rotate' && (
          <div className="operation-container">
            <h3>🔃 Girar Páginas</h3>
            <p>Selecione páginas e o ângulo de rotação.</p>
            <div className="form-group">
              <label>Páginas para girar</label>
              <input type="text" placeholder="Ex: 1,3,5 ou 1-5" />
            </div>
            <div className="form-group">
              <label>Ângulo de Rotação</label>
              <div className="rotation-buttons">
                <button className="angle-btn">90°</button>
                <button className="angle-btn">180°</button>
                <button className="angle-btn">270°</button>
              </div>
            </div>
            <button className="action-btn primary">Girar Páginas</button>
          </div>
        )}

        {activeTab === 'extract' && (
          <div className="operation-container">
            <h3>📤 Extrair Páginas</h3>
            <p>Extraia um intervalo de páginas como um novo PDF.</p>
            <div className="form-group">
              <label>Páginas para extrair</label>
              <input type="text" placeholder="Ex: 1-5" />
            </div>
            <div className="form-group">
              <label>Nome do arquivo de saída</label>
              <input type="text" placeholder="documento_extraido.pdf" />
            </div>
            <button className="action-btn primary">Extrair Páginas</button>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <p className="info-text">💡 Todas as operações criam novos arquivos sem modificar o original.</p>
      </div>
    </div>
  );
};
