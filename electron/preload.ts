import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Define API types
interface PDFApi {
  load: (filePath: string) => Promise<any>;
  getMetadata: (filePath: string) => Promise<any>;
  decrypt: (filePath: string, password: string) => Promise<any>;
  onFileOpen: (callback: (filePath: string) => void) => void;
  onZoomIn: (callback: () => void) => void;
  onZoomOut: (callback: () => void) => void;
  onZoomReset: (callback: () => void) => void;
  onThemeChange: (callback: (theme: string) => void) => void;
}

interface AnnotationApi {
  save: (pdfPath: string, annotations: any[]) => Promise<any>;
  load: (pdfPath: string) => Promise<any>;
}

interface SecurityApi {
  protect: (filePath: string, password: string, options: any) => Promise<any>;
  onProtectRequest: (callback: () => void) => void;
}

interface PrintApi {
  preview: (pdfPath: string) => Promise<any>;
  execute: (options: any) => Promise<any>;
  onPrintRequest: (callback: () => void) => void;
}

interface DocProcessingApi {
  mergePDFs: (pdfPaths: string[], outputPath: string) => Promise<any>;
  splitPDF: (pdfPath: string, ranges: any[], outputDir: string) => Promise<any>;
  reorderPages: (pdfPath: string, operations: any[], outputPath: string) => Promise<any>;
  rotatePages: (pdfPath: string, options: any, outputPath: string) => Promise<any>;
  extractPages: (pdfPath: string, options: any) => Promise<any>;
}

interface RecognitionApi {
  detectTables: (pdfPath: string, pages?: number[]) => Promise<any>;
  extractText: (pdfPath: string, pages?: number[]) => Promise<any>;
  getMetadata: (pdfPath: string) => Promise<any>;
  getStats: (pdfPath: string) => Promise<any>;
}

interface AutomationApi {
  batchProcess: (taskId: string, inputFolder: string, operation: string) => Promise<any>;
  saveTemplate: (template: any) => Promise<any>;
  getTemplates: () => Promise<any>;
  autoOrganize: (sourceFolder: string, strategy: string) => Promise<any>;
  scheduleTask: (task: any) => Promise<any>;
  getScheduledTasks: () => Promise<any>;
}

interface IntegrationApi {
  autoSaveCloud: (pdfPath: string, config: any) => Promise<any>;
  getVersionHistory: (pdfPath: string) => Promise<any>;
  restoreVersion: (versionId: string, outputPath: string) => Promise<any>;
  validatePDF: (pdfPath: string, standard?: string) => Promise<any>;
  syncSettings: (config: any) => Promise<any>;
  getSyncStatus: () => Promise<any>;
}

interface ElectronApi {
  pdf: PDFApi;
  annotation: AnnotationApi;
  security: SecurityApi;
  print: PrintApi;
  docProcessing: DocProcessingApi;
  recognition: RecognitionApi;
  automation: AutomationApi;
  integration: IntegrationApi;
}

const pdf: PDFApi = {
  load: (filePath: string) => ipcRenderer.invoke('pdf:load', filePath),
  getMetadata: (filePath: string) => ipcRenderer.invoke('pdf:getMetadata', filePath),
  decrypt: (filePath: string, password: string) =>
    ipcRenderer.invoke('pdf:decrypt', filePath, password),
  onFileOpen: (callback: (filePath: string) => void) => {
    ipcRenderer.on('file:open', (event: IpcRendererEvent, filePath: string) => {
      callback(filePath);
    });
  },
  onZoomIn: (callback: () => void) => {
    ipcRenderer.on('zoom:in', callback);
  },
  onZoomOut: (callback: () => void) => {
    ipcRenderer.on('zoom:out', callback);
  },
  onZoomReset: (callback: () => void) => {
    ipcRenderer.on('zoom:reset', callback);
  },
  onThemeChange: (callback: (theme: string) => void) => {
    ipcRenderer.on('theme:change', (event: IpcRendererEvent, theme: string) => {
      callback(theme);
    });
  }
};

const annotation: AnnotationApi = {
  save: (pdfPath: string, annotations: any[]) =>
    ipcRenderer.invoke('annotation:save', pdfPath, annotations),
  load: (pdfPath: string) => ipcRenderer.invoke('annotation:load', pdfPath)
};

const security: SecurityApi = {
  protect: (filePath: string, password: string, options: any) =>
    ipcRenderer.invoke('security:protect', filePath, password, options),
  onProtectRequest: (callback: () => void) => {
    ipcRenderer.on('security:protect', callback);
  }
};

const print: PrintApi = {
  preview: (pdfPath: string) => ipcRenderer.invoke('print:preview', pdfPath),
  execute: (options: any) => ipcRenderer.invoke('print:execute', options),
  onPrintRequest: (callback: () => void) => {
    ipcRenderer.on('print:open', callback);
  }
};

const docProcessing: DocProcessingApi = {
  mergePDFs: (pdfPaths: string[], outputPath: string) =>
    ipcRenderer.invoke('doc-processing:merge-pdfs', pdfPaths, outputPath),
  splitPDF: (pdfPath: string, ranges: any[], outputDir: string) =>
    ipcRenderer.invoke('doc-processing:split-pdf', pdfPath, ranges, outputDir),
  reorderPages: (pdfPath: string, operations: any[], outputPath: string) =>
    ipcRenderer.invoke('doc-processing:reorder-pages', pdfPath, operations, outputPath),
  rotatePages: (pdfPath: string, options: any, outputPath: string) =>
    ipcRenderer.invoke('doc-processing:rotate-pages', pdfPath, options, outputPath),
  extractPages: (pdfPath: string, options: any) =>
    ipcRenderer.invoke('doc-processing:extract-pages', pdfPath, options)
};

const recognition: RecognitionApi = {
  detectTables: (pdfPath: string, pages?: number[]) =>
    ipcRenderer.invoke('recognition:detect-tables', pdfPath, pages),
  extractText: (pdfPath: string, pages?: number[]) =>
    ipcRenderer.invoke('recognition:extract-text', pdfPath, pages),
  getMetadata: (pdfPath: string) =>
    ipcRenderer.invoke('recognition:get-metadata', pdfPath),
  getStats: (pdfPath: string) =>
    ipcRenderer.invoke('recognition:get-stats', pdfPath)
};

const automation: AutomationApi = {
  batchProcess: (taskId: string, inputFolder: string, operation: string) =>
    ipcRenderer.invoke('automation:batch-process', taskId, inputFolder, operation),
  saveTemplate: (template: any) =>
    ipcRenderer.invoke('automation:save-template', template),
  getTemplates: () =>
    ipcRenderer.invoke('automation:get-templates'),
  autoOrganize: (sourceFolder: string, strategy: string) =>
    ipcRenderer.invoke('automation:auto-organize', sourceFolder, strategy),
  scheduleTask: (task: any) =>
    ipcRenderer.invoke('automation:schedule-task', task),
  getScheduledTasks: () =>
    ipcRenderer.invoke('automation:get-scheduled-tasks')
};

const integration: IntegrationApi = {
  autoSaveCloud: (pdfPath: string, config: any) =>
    ipcRenderer.invoke('integration:auto-save-cloud', pdfPath, config),
  getVersionHistory: (pdfPath: string) =>
    ipcRenderer.invoke('integration:get-version-history', pdfPath),
  restoreVersion: (versionId: string, outputPath: string) =>
    ipcRenderer.invoke('integration:restore-version', versionId, outputPath),
  validatePDF: (pdfPath: string, standard?: string) =>
    ipcRenderer.invoke('integration:validate-pdf', pdfPath, standard),
  syncSettings: (config: any) =>
    ipcRenderer.invoke('integration:sync-settings', config),
  getSyncStatus: () =>
    ipcRenderer.invoke('integration:get-sync-status')
};

const electronApi: ElectronApi = {
  pdf,
  annotation,
  security,
  print,
  docProcessing,
  recognition,
  automation,
  integration
};

contextBridge.exposeInMainWorld('electronApi', electronApi);

declare global {
  interface Window {
    electronApi: ElectronApi;
  }
}
