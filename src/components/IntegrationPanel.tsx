import React, { useState, useEffect } from 'react';
import '../components/IntegrationPanel.css';

interface IntegrationPanelProps {
  onClose?: () => void;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'history' | 'validation'>('cloud');
  const [processing, setProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    loadSyncStatus();
    loadVersionHistory();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const result = await (window as any).electronApi.integration?.getSyncStatus();
      setSyncStatus(result);
    } catch (error) {
      console.error('Erro ao carregar status de sincronização:', error);
    }
  };

  const loadVersionHistory = async () => {
    try {
      const result = await (window as any).electronApi.integration?.getVersionHistory('current.pdf');
      setVersions(result?.versions || []);
    } catch (error) {
      console.error('Erro ao carregar histórico de versões:', error);
    }
  };

  const handleAutoSaveCloud = async () => {
    setProcessing(true);
    try {
      const config = {
        provider: 'google-drive' as const,
        accessToken: 'token-aqui',
      };
      await (window as any).electronApi.integration?.autoSaveCloud('current.pdf', config);
      loadSyncStatus();
    } catch (error) {
      console.error('Erro ao salvar na nuvem:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleValidatePDF = async () => {
    setProcessing(true);
    try {
      await (window as any).electronApi.integration?.validatePDF('current.pdf', 'PDF/A-1b');
    } catch (error) {
      console.error('Erro ao validar PDF:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await (window as any).electronApi.integration?.restoreVersion(versionId, 'restored.pdf');
      loadVersionHistory();
    } catch (error) {
      console.error('Erro ao restaurar versão:', error);
    }
  };

  return (
    <div className="integration-panel">
      <div className="panel-header">
        <h2>☁️ Integração e Compliance</h2>
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'cloud' ? 'active' : ''}`}
          onClick={() => setActiveTab('cloud')}
        >
          Cloud
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
        <button
          className={`tab-btn ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          Validação
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'cloud' && (
          <div className="operation-container">
            <h3>💾 Auto-Save na Nuvem</h3>
            <p>Sincronize seus documentos automaticamente com serviços de nuvem.</p>

            {syncStatus && (
              <div className="sync-status-card">
                <div className="status-indicator">
                  <span className={`status-dot ${syncStatus.syncStatus}`}></span>
                  <div>
                    <strong>Status: {syncStatus.syncStatus === 'synced' ? 'Sincronizado' : 'Fora de sincronização'}</strong>
                    <p>Último sincronismo: {new Date(syncStatus.lastSync).toLocaleString('pt-BR')}</p>
                    <p>Provedor: {syncStatus.provider}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Provedor de Nuvem</label>
              <select>
                <option>Google Drive</option>
                <option>OneDrive</option>
                <option>AWS S3</option>
                <option>Dropbox</option>
              </select>
            </div>

            <div className="form-group">
              <label>Intervalo de Sincronização</label>
              <div className="sync-interval-buttons">
                <button className="interval-btn">A cada 1h</button>
                <button className="interval-btn">A cada 4h</button>
                <button className="interval-btn">Diária</button>
                <button className="interval-btn">Manual</button>
              </div>
            </div>

            <div className="form-group">
              <label>
                <input type="checkbox" defaultChecked />
                Sincronizar todas as anotações
              </label>
            </div>

            <button className="action-btn primary" onClick={handleAutoSaveCloud} disabled={processing}>
              {processing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>

            <div className="cloud-info">
              <h4>📁 Arquivos na Nuvem</h4>
              <div className="file-list">
                <div className="cloud-file">
                  <span>📄 documento.pdf</span>
                  <span className="sync-badge">✓ Sincronizado</span>
                </div>
                <div className="cloud-file">
                  <span>📄 contrato.pdf</span>
                  <span className="sync-badge">✓ Sincronizado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="operation-container">
            <h3>📜 Histórico de Versões</h3>
            <p>Veja todas as versões anteriores do documento.</p>

            <div className="versions-list">
              {versions.length === 0 ? (
                <p className="empty-state">Nenhuma versão anterior encontrada.</p>
              ) : (
                versions.map((version, idx) => (
                  <div key={version.versionId} className={`version-item ${idx === 0 ? 'current' : ''}`}>
                    <div className="version-info">
                      <div className="version-meta">
                        <strong>{version.filename}</strong>
                        {idx === 0 && <span className="current-badge">ATUAL</span>}
                      </div>
                      <div className="version-details">
                        <small>Criado: {new Date(version.createdAt).toLocaleString('pt-BR')}</small>
                        <small>Tamanho: {(version.size / 1024).toFixed(2)} KB</small>
                        <small>Autor: {version.author}</small>
                      </div>
                      {version.changesSummary && (
                        <p className="changes-summary">Mudanças: {version.changesSummary}</p>
                      )}
                    </div>
                    {idx !== 0 && (
                      <div className="version-actions">
                        <button
                          className="action-btn secondary"
                          onClick={() => handleRestoreVersion(version.versionId)}
                        >
                          Restaurar
                        </button>
                        <button className="action-btn secondary">Comparar</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="operation-container">
            <h3>✅ Validação de PDF</h3>
            <p>Valide a conformidade do PDF com padrões internacionais.</p>

            <div className="validation-standards">
              <h4>Padrões Disponíveis</h4>
              <div className="standard-buttons">
                <button className="standard-btn">PDF/A-1b (Arquivo)</button>
                <button className="standard-btn">PDF/X (Impressão)</button>
                <button className="standard-btn">PDF/E (Engenharia)</button>
                <button className="standard-btn">PDF/UA (Acessibilidade)</button>
              </div>
            </div>

            <button className="action-btn primary" onClick={handleValidatePDF} disabled={processing}>
              {processing ? 'Validando...' : 'Validar PDF'}
            </button>

            <div className="validation-result">
              <div className="result-header">
                <span className="result-icon">✓</span>
                <div>
                  <strong>Resultado da Validação</strong>
                  <p>Conformidade PDF/A-1b: 85%</p>
                </div>
              </div>

              <div className="issues-list">
                <h5>⚠️ Avisos</h5>
                <ul>
                  <li>Metadados incompletos</li>
                  <li>Algumas anotações podem não ser compatíveis</li>
                </ul>
              </div>

              <button className="action-btn secondary">Ver Relatório Completo</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <p className="info-text">💡 Mantenha seus documentos seguros, versionados e em conformidade.</p>
      </div>
    </div>
  );
};
