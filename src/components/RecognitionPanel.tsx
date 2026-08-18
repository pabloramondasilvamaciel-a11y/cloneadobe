import React, { useState } from 'react';
import '../components/RecognitionPanel.css';

interface RecognitionPanelProps {
  onClose?: () => void;
}

export const RecognitionPanel: React.FC<RecognitionPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'text' | 'metadata' | 'stats'>('tables');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleDetectTables = async () => {
    setProcessing(true);
    try {
      const result = await (window as any).electronApi.recognition?.detectTables('current.pdf');
      setResults(result);
    } catch (error) {
      console.error('Erro ao detectar tabelas:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleExtractText = async () => {
    setProcessing(true);
    try {
      const result = await (window as any).electronApi.recognition?.extractText('current.pdf');
      setResults(result);
    } catch (error) {
      console.error('Erro ao extrair texto:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleGetMetadata = async () => {
    setProcessing(true);
    try {
      const result = await (window as any).electronApi.recognition?.getMetadata('current.pdf');
      setResults(result);
    } catch (error) {
      console.error('Erro ao obter metadados:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleGetStats = async () => {
    setProcessing(true);
    try {
      const result = await (window as any).electronApi.recognition?.getStats('current.pdf');
      setResults(result);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="recognition-panel">
      <div className="panel-header">
        <h2>🧠 Reconhecimento e Análise</h2>
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          Tabelas
        </button>
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Texto
        </button>
        <button
          className={`tab-btn ${activeTab === 'metadata' ? 'active' : ''}`}
          onClick={() => setActiveTab('metadata')}
        >
          Metadados
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Estatísticas
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'tables' && (
          <div className="operation-container">
            <h3>📊 Detecção de Tabelas</h3>
            <p>Identifique automaticamente tabelas no PDF.</p>
            <button className="action-btn primary" onClick={handleDetectTables} disabled={processing}>
              {processing ? 'Detectando...' : 'Detectar Tabelas'}
            </button>
            {results?.tables && (
              <div className="results-container">
                <h4>Tabelas Encontradas: {results.totalTablesFound}</h4>
                {results.tables.map((table: any, idx: number) => (
                  <div key={idx} className="result-item">
                    <span>📍 Página {table.pageNumber}, Tabela {table.tableIndex}</span>
                    <span>{table.rows} × {table.columns} (confiança: {(table.confidence * 100).toFixed(1)}%)</span>
                  </div>
                ))}
                <button className="action-btn secondary">Exportar Tabelas</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="operation-container">
            <h3>📝 Extração de Texto</h3>
            <p>Extraia todo o texto do PDF de forma estruturada.</p>
            <button className="action-btn primary" onClick={handleExtractText} disabled={processing}>
              {processing ? 'Extraindo...' : 'Extrair Texto'}
            </button>
            {results?.results && (
              <div className="results-container">
                <div className="stats-row">
                  <span>📄 Páginas processadas: {results.totalPages}</span>
                  <span>📊 Total de palavras: {results.totalWords}</span>
                  <span>🔤 Total de caracteres: {results.totalCharacters}</span>
                </div>
                <button className="action-btn secondary">Exportar como TXT</button>
                <button className="action-btn secondary">Copiar Texto</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="operation-container">
            <h3>🏷️ Explorador de Metadados</h3>
            <p>Visualize todas as informações e metadados do documento.</p>
            <button className="action-btn primary" onClick={handleGetMetadata} disabled={processing}>
              {processing ? 'Carregando...' : 'Obter Metadados'}
            </button>
            {results?.metadata && (
              <div className="metadata-container">
                {Object.entries(results.metadata).map(([key, value]: [string, any]) => (
                  <div key={key} className="metadata-item">
                    <strong>{key}:</strong>
                    <span>{String(value)}</span>
                  </div>
                ))}
                <button className="action-btn secondary">Editar Metadados</button>
                <button className="action-btn secondary">Exportar Metadados</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="operation-container">
            <h3>📈 Estatísticas do Documento</h3>
            <p>Visualize estatísticas detalhadas sobre o PDF.</p>
            <button className="action-btn primary" onClick={handleGetStats} disabled={processing}>
              {processing ? 'Analisando...' : 'Gerar Estatísticas'}
            </button>
            {results?.stats && (
              <div className="stats-container">
                <div className="stat-card">
                  <span className="stat-label">📄 Páginas</span>
                  <span className="stat-value">{results.stats.totalPages}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">💾 Tamanho</span>
                  <span className="stat-value">{(results.stats.totalSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">🔤 Caracteres</span>
                  <span className="stat-value">{results.stats.totalCharacters.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">📝 Palavras</span>
                  <span className="stat-value">{results.stats.totalWords.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span>🌐 Idiomas: {results.stats.languages.join(', ')}</span>
                  <span>🖼️ Contém imagens: {results.stats.hasImages ? 'Sim' : 'Não'}</span>
                  <span>📋 Formulários: {results.stats.hasFormFields ? 'Sim' : 'Não'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <p className="info-text">💡 Use estes dados para análise, exportação e organização de documentos.</p>
      </div>
    </div>
  );
};
