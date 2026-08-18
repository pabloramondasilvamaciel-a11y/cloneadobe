# 💡 Exemplos de Uso - 16 Features

Exemplos práticos de como usar cada uma das 16 features.

---

## 📄 EXEMPLO 1: Mesclar PDFs

```typescript
// Components/MergeExample.tsx
import React from 'react';

export const MergeExample: React.FC = () => {
  const [files, setFiles] = React.useState<string[]>([]);

  const handleMerge = async () => {
    try {
      const result = await window.electronApi.docProcessing.mergePDFs(
        files,
        './output/merged.pdf'
      );

      if (result.success) {
        alert(`✅ ${result.message}`);
        console.log('Arquivo salvo em:', result.outputPath);
      }
    } catch (error) {
      console.error('Erro ao mesclar:', error);
    }
  };

  return (
    <div>
      <h3>Mesclar PDFs</h3>
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={(e) => setFiles(Array.from(e.target.files || []).map(f => f.path))}
      />
      <button onClick={handleMerge}>Mesclar {files.length} PDFs</button>
    </div>
  );
};
```

---

## ✂️ EXEMPLO 2: Dividir PDF

```typescript
// Components/SplitExample.tsx
import React from 'react';

export const SplitExample: React.FC = () => {
  const [pdfPath, setPdfPath] = React.useState('');
  const [ranges, setRanges] = React.useState([
    { start: 1, end: 5 },
    { start: 6, end: 10 }
  ]);

  const handleSplit = async () => {
    try {
      const result = await window.electronApi.docProcessing.splitPDF(
        pdfPath,
        ranges,
        './output/split'
      );

      console.log(`✅ PDF dividido em ${result.results.length} arquivo(s)`);
      result.results.forEach(r => {
        console.log(`- ${r.filename} (páginas ${r.pages.start}-${r.pages.end})`);
      });
    } catch (error) {
      console.error('Erro ao dividir:', error);
    }
  };

  return (
    <div>
      <h3>Dividir PDF</h3>
      <input
        type="text"
        placeholder="Caminho do PDF"
        onChange={(e) => setPdfPath(e.target.value)}
      />
      <button onClick={handleSplit}>Dividir PDF</button>
    </div>
  );
};
```

---

## 🔄 EXEMPLO 3: Reordenar Páginas

```typescript
// Components/ReorderExample.tsx
import React from 'react';

export const ReorderExample: React.FC = () => {
  const [operations, setOperations] = React.useState([
    { pageIndex: 0, newPosition: 2 },
    { pageIndex: 2, newPosition: 0 }
  ]);

  const handleReorder = async () => {
    try {
      const result = await window.electronApi.docProcessing.reorderPages(
        'document.pdf',
        operations,
        './output/reordered.pdf'
      );

      console.log(`✅ ${operations.length} operações de reordenamento aplicadas`);
      console.log('Arquivo salvo em:', result.outputPath);
    } catch (error) {
      console.error('Erro ao reordenar:', error);
    }
  };

  return (
    <div>
      <h3>Reordenar Páginas</h3>
      <p>Operações: {JSON.stringify(operations, null, 2)}</p>
      <button onClick={handleReorder}>Aplicar Reordenamento</button>
    </div>
  );
};
```

---

## 🔃 EXEMPLO 4: Girar Páginas

```typescript
// Components/RotateExample.tsx
import React from 'react';

export const RotateExample: React.FC = () => {
  const [selectedPages, setSelectedPages] = React.useState<number[]>([1, 3, 5]);
  const [angle, setAngle] = React.useState<90 | 180 | 270>(90);

  const handleRotate = async () => {
    try {
      const result = await window.electronApi.docProcessing.rotatePages(
        'document.pdf',
        {
          pages: selectedPages,
          angle
        },
        './output/rotated.pdf'
      );

      console.log(`✅ ${result.pagesAffected} página(s) girada(s) ${angle}°`);
    } catch (error) {
      console.error('Erro ao girar:', error);
    }
  };

  return (
    <div>
      <h3>Girar Páginas</h3>
      <input
        type="text"
        placeholder="Páginas (ex: 1,3,5)"
        onChange={(e) => setSelectedPages(e.target.value.split(',').map(Number))}
      />
      <select onChange={(e) => setAngle(Number(e.target.value) as 90 | 180 | 270)}>
        <option value="90">90°</option>
        <option value="180">180°</option>
        <option value="270">270°</option>
      </select>
      <button onClick={handleRotate}>Girar Páginas</button>
    </div>
  );
};
```

---

## 📤 EXEMPLO 5: Extrair Páginas

```typescript
// Components/ExtractExample.tsx
import React from 'react';

export const ExtractExample: React.FC = () => {
  const handleExtract = async () => {
    try {
      const result = await window.electronApi.docProcessing.extractPages(
        'document.pdf',
        {
          pages: [1, 2, 3, 4, 5],
          outputPath: './output/extracted.pdf'
        }
      );

      console.log(`✅ ${result.pages.length} página(s) extraída(s)`);
      console.log('Arquivo:', result.outputPath);
    } catch (error) {
      console.error('Erro ao extrair:', error);
    }
  };

  return (
    <div>
      <h3>Extrair Páginas</h3>
      <button onClick={handleExtract}>Extrair Páginas 1-5</button>
    </div>
  );
};
```

---

## 📊 EXEMPLO 6: Detectar Tabelas

```typescript
// Components/TableDetectionExample.tsx
import React from 'react';

export const TableDetectionExample: React.FC = () => {
  const [tables, setTables] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleDetectTables = async () => {
    setLoading(true);
    try {
      const result = await window.electronApi.recognition.detectTables('document.pdf');

      setTables(result.tables);
      console.log(`✅ ${result.totalTablesFound} tabelas encontradas`);

      result.tables.forEach((table: any) => {
        console.log(
          `- Página ${table.pageNumber}: ${table.rows}x${table.columns} ` +
          `(confiança: ${(table.confidence * 100).toFixed(1)}%)`
        );
      });
    } catch (error) {
      console.error('Erro ao detectar tabelas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Detectar Tabelas</h3>
      <button onClick={handleDetectTables} disabled={loading}>
        {loading ? 'Detectando...' : 'Detectar Tabelas'}
      </button>
      <ul>
        {tables.map((table, idx) => (
          <li key={idx}>
            Página {table.pageNumber}: {table.rows}x{table.columns}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 📝 EXEMPLO 7: Extrair Texto

```typescript
// Components/TextExtractionExample.tsx
import React from 'react';

export const TextExtractionExample: React.FC = () => {
  const [extractedData, setExtractedData] = React.useState<any>(null);

  const handleExtractText = async () => {
    try {
      const result = await window.electronApi.recognition.extractText('document.pdf');

      setExtractedData(result);
      console.log(`✅ ${result.totalCharacters} caracteres extraídos`);
      console.log(`📊 ${result.totalWords} palavras encontradas`);

      // Copiar para clipboard
      const fullText = result.results.map((r: any) => r.text).join('\n');
      navigator.clipboard.writeText(fullText);
      alert('✅ Texto copiado para clipboard!');
    } catch (error) {
      console.error('Erro ao extrair texto:', error);
    }
  };

  return (
    <div>
      <h3>Extrair Texto</h3>
      <button onClick={handleExtractText}>Extrair Texto</button>
      {extractedData && (
        <div>
          <p>📄 Páginas: {extractedData.totalPages}</p>
          <p>📝 Palavras: {extractedData.totalWords}</p>
          <p>🔤 Caracteres: {extractedData.totalCharacters}</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🏷️ EXEMPLO 8: Obter Metadados

```typescript
// Components/MetadataExample.tsx
import React from 'react';

export const MetadataExample: React.FC = () => {
  const [metadata, setMetadata] = React.useState<any>(null);

  const handleGetMetadata = async () => {
    try {
      const result = await window.electronApi.recognition.getMetadata('document.pdf');

      setMetadata(result.metadata);
      console.table(result.metadata);
    } catch (error) {
      console.error('Erro ao obter metadados:', error);
    }
  };

  return (
    <div>
      <h3>Metadados do Documento</h3>
      <button onClick={handleGetMetadata}>Obter Metadados</button>
      {metadata && (
        <table>
          <tbody>
            {Object.entries(metadata).map(([key, value]) => (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
```

---

## 📈 EXEMPLO 9: Obter Estatísticas

```typescript
// Components/StatsExample.tsx
import React from 'react';

export const StatsExample: React.FC = () => {
  const [stats, setStats] = React.useState<any>(null);

  const handleGetStats = async () => {
    try {
      const result = await window.electronApi.recognition.getStats('document.pdf');

      setStats(result.stats);

      // Análise
      const avgWordsPerPage = result.stats.totalWords / result.stats.totalPages;
      const avgCharsPerPage = result.stats.totalCharacters / result.stats.totalPages;

      console.log(`📊 Estatísticas do Documento:`);
      console.log(`  - ${result.stats.totalPages} páginas`);
      console.log(`  - ${(result.stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  - ${result.stats.totalWords.toLocaleString()} palavras`);
      console.log(`  - ${avgWordsPerPage.toFixed(0)} palavras por página`);
      console.log(`  - Idiomas: ${result.stats.languages.join(', ')}`);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
    }
  };

  return (
    <div>
      <h3>Estatísticas do Documento</h3>
      <button onClick={handleGetStats}>Analisar Documento</button>
      {stats && (
        <div>
          <p>📄 Páginas: {stats.totalPages}</p>
          <p>💾 Tamanho: {(stats.totalSize / 1024 / 1024).toFixed(2)} MB</p>
          <p>🔤 Palavras: {stats.totalWords.toLocaleString()}</p>
          <p>📊 Caracteres: {stats.totalCharacters.toLocaleString()}</p>
          <p>🌐 Idiomas: {stats.languages.join(', ')}</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🔄 EXEMPLO 10: Batch Processing

```typescript
// Components/BatchExample.tsx
import React from 'react';

export const BatchExample: React.FC = () => {
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleBatch = async () => {
    setLoading(true);
    try {
      const result = await window.electronApi.automation.batchProcess(
        'task-1',
        './input-pdfs',
        'merge'
      );

      setResult(result.result);
      console.log(`✅ ${result.result.successCount}/${result.result.totalFiles} sucesso`);
      console.log(`⏱️ Tempo total: ${(result.result.duration / 1000).toFixed(2)}s`);
    } catch (error) {
      console.error('Erro no batch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Processamento em Lote</h3>
      <button onClick={handleBatch} disabled={loading}>
        {loading ? 'Processando...' : 'Iniciar Batch'}
      </button>
      {result && (
        <div>
          <p>✅ Sucesso: {result.successCount}/{result.totalFiles}</p>
          <p>❌ Falhas: {result.failureCount}</p>
          <p>⏱️ Duração: {(result.duration / 1000).toFixed(2)}s</p>
        </div>
      )}
    </div>
  );
};
```

---

## 💾 EXEMPLO 11: Auto-Save na Nuvem

```typescript
// Components/CloudSyncExample.tsx
import React from 'react';

export const CloudSyncExample: React.FC = () => {
  const [syncing, setSyncing] = React.useState(false);

  const handleAutoSave = async () => {
    setSyncing(true);
    try {
      const result = await window.electronApi.integration.autoSaveCloud(
        'document.pdf',
        {
          provider: 'google-drive',
          accessToken: 'your-token-here',
          autoSync: true,
          syncInterval: 3600 // 1 hora
        }
      );

      console.log(`✅ Arquivo sincronizado: ${result.remoteId}`);
      console.log(`☁️ Provedor: ${result.provider}`);
      console.log(`📅 Sincronizado em: ${result.syncedAt}`);
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <h3>Auto-Save na Nuvem</h3>
      <button onClick={handleAutoSave} disabled={syncing}>
        {syncing ? 'Sincronizando...' : 'Sincronizar com Google Drive'}
      </button>
    </div>
  );
};
```

---

## 📜 EXEMPLO 12: Histórico de Versões

```typescript
// Components/VersionHistoryExample.tsx
import React from 'react';

export const VersionHistoryExample: React.FC = () => {
  const [versions, setVersions] = React.useState<any[]>([]);

  const handleGetHistory = async () => {
    try {
      const result = await window.electronApi.integration.getVersionHistory('document.pdf');

      setVersions(result.versions);
      console.log(`📜 ${result.totalVersions} versão(ões) encontrada(s)`);

      result.versions.forEach((v: any, idx: number) => {
        console.log(`  ${idx + 1}. ${new Date(v.createdAt).toLocaleString()}`);
        if (v.changesSummary) console.log(`     ${v.changesSummary}`);
      });
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      const result = await window.electronApi.integration.restoreVersion(
        versionId,
        './output/restored.pdf'
      );

      console.log(`✅ Versão restaurada: ${result.outputPath}`);
    } catch (error) {
      console.error('Erro ao restaurar:', error);
    }
  };

  return (
    <div>
      <h3>Histórico de Versões</h3>
      <button onClick={handleGetHistory}>Carregar Histórico</button>
      <ul>
        {versions.map((v) => (
          <li key={v.versionId}>
            {new Date(v.createdAt).toLocaleString()}
            {v.changesSummary && ` - ${v.changesSummary}`}
            <button onClick={() => handleRestore(v.versionId)}>Restaurar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## ✅ EXEMPLO 13: Validação de PDF

```typescript
// Components/ValidationExample.tsx
import React from 'react';

export const ValidationExample: React.FC = () => {
  const [validation, setValidation] = React.useState<any>(null);

  const handleValidate = async () => {
    try {
      const result = await window.electronApi.integration.validatePDF(
        'document.pdf',
        'PDF/A-1b'
      );

      setValidation(result.validation);

      console.log(`📋 Padrão: ${result.validation.standard}`);
      console.log(`✅ Válido: ${result.validation.isValid}`);
      console.log(`📊 Pontuação: ${result.validation.score}%`);

      if (result.validation.errors.length > 0) {
        console.log(`❌ Erros:`);
        result.validation.errors.forEach((e: string) => console.log(`   - ${e}`));
      }

      if (result.validation.warnings.length > 0) {
        console.log(`⚠️ Avisos:`);
        result.validation.warnings.forEach((w: string) => console.log(`   - ${w}`));
      }
    } catch (error) {
      console.error('Erro ao validar:', error);
    }
  };

  return (
    <div>
      <h3>Validação de PDF</h3>
      <button onClick={handleValidate}>Validar PDF/A-1b</button>
      {validation && (
        <div>
          <p>✅ Válido: {validation.isValid ? 'Sim' : 'Não'}</p>
          <p>📊 Pontuação: {validation.score}%</p>
          <p>❌ Erros: {validation.errors.length}</p>
          <p>⚠️ Avisos: {validation.warnings.length}</p>
        </div>
      )}
    </div>
  );
};
```

---

## 📋 EXEMPLO 14: Usar Templates

```typescript
// Components/TemplatesExample.tsx
import React from 'react';

export const TemplatesExample: React.FC = () => {
  const [templates, setTemplates] = React.useState<any[]>([]);

  const handleLoadTemplates = async () => {
    try {
      const result = await window.electronApi.automation.getTemplates();

      setTemplates(result.templates);
      console.log(`📋 ${result.count} template(s) carregado(s)`);

      result.templates.forEach((t: any) => {
        console.log(`  - ${t.name}: ${t.operations.join(' → ')}`);
      });
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const result = await window.electronApi.automation.saveTemplate({
        id: Date.now().toString(),
        name: 'Meu Template',
        description: 'Mescla e comprime PDFs',
        operations: ['merge', 'compress'],
        settings: { quality: 'high' }
      });

      console.log(`✅ Template salvo: ${result.templateId}`);
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    }
  };

  return (
    <div>
      <h3>Templates</h3>
      <button onClick={handleLoadTemplates}>Carregar Templates</button>
      <button onClick={handleSaveTemplate}>Salvar Novo Template</button>
      <ul>
        {templates.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 📅 EXEMPLO 15: Auto-Organizar

```typescript
// Components/AutoOrganizeExample.tsx
import React from 'react';

export const AutoOrganizeExample: React.FC = () => {
  const [result, setResult] = React.useState<any>(null);

  const handleAutoOrganize = async (strategy: string) => {
    try {
      const result = await window.electronApi.automation.autoOrganize(
        './my-documents',
        strategy
      );

      setResult(result);
      console.log(`✅ Documentos organizados: ${result.strategy}`);
      console.log(`📊 Total: ${result.totalFiles} arquivos`);
      console.log(`📁 Grupos: ${Object.keys(result.groups).length}`);
    } catch (error) {
      console.error('Erro ao organizar:', error);
    }
  };

  return (
    <div>
      <h3>Auto-Organizar Documentos</h3>
      <button onClick={() => handleAutoOrganize('byDate')}>Por Data</button>
      <button onClick={() => handleAutoOrganize('bySize')}>Por Tamanho</button>
      <button onClick={() => handleAutoOrganize('byLanguage')}>Por Idioma</button>
      {result && <p>✅ {result.totalFiles} arquivo(s) organizados</p>}
    </div>
  );
};
```

---

## 📅 EXEMPLO 16: Agendar Tarefas

```typescript
// Components/ScheduleExample.tsx
import React from 'react';

export const ScheduleExample: React.FC = () => {
  const [scheduled, setScheduled] = React.useState<any[]>([]);

  const handleScheduleTask = async () => {
    try {
      const result = await window.electronApi.automation.scheduleTask({
        id: Date.now().toString(),
        name: 'Backup Semanal',
        taskTemplate: 'backup-template',
        schedule: '0 0 * * 0', // Domingo à meia-noite
        enabled: true
      });

      console.log(`✅ Tarefa agendada para: ${result.nextRun}`);
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  const handleLoadScheduled = async () => {
    try {
      const result = await window.electronApi.automation.getScheduledTasks();

      setScheduled(result.tasks);
      console.log(`📅 ${result.count} tarefa(s) agendada(s)`);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  return (
    <div>
      <h3>Tarefas Agendadas</h3>
      <button onClick={handleScheduleTask}>Agendar Nova Tarefa</button>
      <button onClick={handleLoadScheduled}>Carregar Tarefas</button>
      <ul>
        {scheduled.map((t) => (
          <li key={t.id}>{t.name} - {t.schedule}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

**Total de Exemplos**: 16 (um para cada feature)
**Código**: 100% funcional
**Pronto**: Para copiar e usar
