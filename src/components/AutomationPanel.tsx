import React, { useState, useEffect } from 'react';
import '../components/AutomationPanel.css';

interface AutomationPanelProps {
  onClose?: () => void;
}

export const AutomationPanel: React.FC<AutomationPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'batch' | 'templates' | 'organize' | 'scheduled'>('batch');
  const [processing, setProcessing] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTemplates();
    loadScheduledTasks();
  }, []);

  const loadTemplates = async () => {
    try {
      const result = await (window as any).electronApi.automation?.getTemplates();
      setTemplates(result?.templates || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const loadScheduledTasks = async () => {
    try {
      const result = await (window as any).electronApi.automation?.getScheduledTasks();
      setTasks(result?.tasks || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas agendadas:', error);
    }
  };

  const handleBatchProcess = async () => {
    setProcessing(true);
    try {
      const result = await (window as any).electronApi.automation?.batchProcess('task-1', './input', 'merge');
      console.log('Resultado do batch:', result);
    } catch (error) {
      console.error('Erro no batch processing:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const template = {
        id: Date.now().toString(),
        name: 'Novo Template',
        description: 'Template customizado',
        operations: ['merge', 'compress'],
        settings: {},
      };
      await (window as any).electronApi.automation?.saveTemplate(template);
      loadTemplates();
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    }
  };

  const handleAutoOrganize = async () => {
    setProcessing(true);
    try {
      await (window as any).electronApi.automation?.autoOrganize('./documents', 'byDate');
    } catch (error) {
      console.error('Erro ao organizar:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleScheduleTask = async () => {
    try {
      const task = {
        id: Date.now().toString(),
        name: 'Tarefa Agendada',
        taskTemplate: templates[0]?.id || '',
        schedule: '0 0 * * *', // Meia-noite diariamente
        enabled: true,
      };
      await (window as any).electronApi.automation?.scheduleTask(task);
      loadScheduledTasks();
    } catch (error) {
      console.error('Erro ao agendar tarefa:', error);
    }
  };

  return (
    <div className="automation-panel">
      <div className="panel-header">
        <h2>⚙️ Automação e Batch</h2>
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          Batch
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`tab-btn ${activeTab === 'organize' ? 'active' : ''}`}
          onClick={() => setActiveTab('organize')}
        >
          Auto-org
        </button>
        <button
          className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Agendadas
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'batch' && (
          <div className="operation-container">
            <h3>🔄 Processamento em Lote</h3>
            <p>Processe múltiplos PDFs automaticamente.</p>
            <div className="form-group">
              <label>Pasta de entrada</label>
              <input type="text" placeholder="/caminho/para/entrada" />
              <button className="browse-btn">Procurar...</button>
            </div>
            <div className="form-group">
              <label>Operação</label>
              <select>
                <option>Mesclar</option>
                <option>Dividir</option>
                <option>Comprimir</option>
                <option>Converter</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pasta de saída</label>
              <input type="text" placeholder="/caminho/para/saída" />
              <button className="browse-btn">Procurar...</button>
            </div>
            <button className="action-btn primary" onClick={handleBatchProcess} disabled={processing}>
              {processing ? 'Processando...' : 'Iniciar Batch'}
            </button>
            <div className="progress-info">
              <div className="progress-bar"></div>
              <p>0 / 10 arquivos processados</p>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="operation-container">
            <h3>📋 Salvar Templates</h3>
            <p>Crie templates para reutilizar operações frequentes.</p>
            <button className="action-btn primary" onClick={handleSaveTemplate}>
              Salvar Como Template
            </button>
            <div className="templates-list">
              {templates.length === 0 ? (
                <p className="empty-state">Nenhum template salvo. Crie um novo!</p>
              ) : (
                templates.map(template => (
                  <div key={template.id} className="template-item">
                    <div className="template-info">
                      <strong>{template.name}</strong>
                      <p>{template.description}</p>
                      <small>Operações: {template.operations.join(', ')}</small>
                    </div>
                    <div className="template-actions">
                      <button className="action-btn secondary">Usar</button>
                      <button className="action-btn secondary">Editar</button>
                      <button className="action-btn danger">Deletar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'organize' && (
          <div className="operation-container">
            <h3>🔔 Auto-Organização</h3>
            <p>Organize automaticamente PDFs por data, tamanho ou idioma.</p>
            <div className="form-group">
              <label>Pasta de origem</label>
              <input type="text" placeholder="/caminho/para/documentos" />
              <button className="browse-btn">Procurar...</button>
            </div>
            <div className="form-group">
              <label>Estratégia de organização</label>
              <div className="strategy-buttons">
                <button className="strategy-btn">📅 Por Data</button>
                <button className="strategy-btn">📊 Por Tamanho</button>
                <button className="strategy-btn">🔍 Por Palavra-chave</button>
                <button className="strategy-btn">🌐 Por Idioma</button>
              </div>
            </div>
            <button className="action-btn primary" onClick={handleAutoOrganize} disabled={processing}>
              {processing ? 'Organizando...' : 'Organizar Documentos'}
            </button>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="operation-container">
            <h3>📅 Tarefas Agendadas</h3>
            <p>Agende tarefas para serem executadas automaticamente.</p>
            <button className="action-btn primary" onClick={handleScheduleTask}>
              Agendar Nova Tarefa
            </button>
            <div className="scheduled-tasks-list">
              {tasks.length === 0 ? (
                <p className="empty-state">Nenhuma tarefa agendada.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="scheduled-item">
                    <div className="task-info">
                      <strong>{task.name}</strong>
                      <small>Schedule: {task.schedule}</small>
                      <small>Próxima execução: {task.nextRun}</small>
                    </div>
                    <div className="task-status">
                      <label>
                        <input type="checkbox" defaultChecked={task.enabled} />
                        Ativo
                      </label>
                    </div>
                    <div className="task-actions">
                      <button className="action-btn secondary">Editar</button>
                      <button className="action-btn danger">Remover</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <p className="info-text">💡 Automatize tarefas repetitivas e economize tempo.</p>
      </div>
    </div>
  );
};
