import type { Annotation } from './annotations';

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  operations: string[];
  settings: Record<string, unknown>;
}

export interface ScheduledTask {
  id: string;
  name: string;
  taskTemplate: string;
  schedule: string;
  enabled: boolean;
  nextRun?: string;
}

export interface SyncStatus {
  syncStatus: string;
  lastSync: string;
  provider: string;
}

export interface DocumentVersion {
  versionId: string;
  filename: string;
  createdAt: string;
  size: number;
  author: string;
  changesSummary?: string;
}

export interface RecognitionTableInfo {
  pageNumber: number;
  tableIndex: number;
  rows: number;
  columns: number;
  confidence: number;
}

export interface RecognitionResults {
  tables?: RecognitionTableInfo[];
  totalTablesFound?: number;
  results?: unknown[];
  totalPages?: number;
  totalWords?: number;
  totalCharacters?: number;
  metadata?: Record<string, unknown>;
  stats?: {
    totalPages: number;
    totalSize: number;
    totalCharacters: number;
    totalWords: number;
    languages: string[];
    hasImages: boolean;
    hasFormFields: boolean;
  };
}

export interface PdfLoadResult {
  success: boolean;
  data: string;
}

export interface ElectronApi {
  pdf: {
    onFileOpen: (callback: (path: string) => void) => void;
    onZoomIn: (callback: () => void) => void;
    onZoomOut: (callback: () => void) => void;
    onThemeChange: (callback: (theme: string) => void) => void;
    load: (filePath: string) => Promise<PdfLoadResult>;
  };
  print: {
    onPrintRequest: (callback: () => void) => void;
    execute: (options: { filePath: string | null }) => Promise<void>;
  };
  security: {
    onProtectRequest: (callback: () => void) => void;
    protect: (
      filePath: string | null,
      password: string,
      permissions: { canPrint: boolean; canCopy: boolean; canModify: boolean }
    ) => Promise<void>;
  };
  annotation: {
    save: (filePath: string, annotations: Annotation[]) => Promise<void>;
  };
  automation?: {
    getTemplates: () => Promise<{ templates: AutomationTemplate[] }>;
    getScheduledTasks: () => Promise<{ tasks: ScheduledTask[] }>;
    batchProcess: (taskId: string, inputDir: string, operation: string) => Promise<unknown>;
    saveTemplate: (template: AutomationTemplate) => Promise<void>;
    autoOrganize: (path: string, strategy: string) => Promise<void>;
    scheduleTask: (task: ScheduledTask) => Promise<void>;
  };
  docProcessing?: {
    mergePDFs: (files: string[], output: string) => Promise<void>;
    splitPDF: (
      file: string,
      ranges: Array<{ start: number; end: number }>,
      outputDir: string
    ) => Promise<void>;
  };
  integration?: {
    getSyncStatus: () => Promise<SyncStatus>;
    getVersionHistory: (filePath: string) => Promise<{ versions: DocumentVersion[] }>;
    autoSaveCloud: (
      filePath: string,
      config: { provider: string; accessToken: string }
    ) => Promise<void>;
    validatePDF: (filePath: string, standard: string) => Promise<unknown>;
    restoreVersion: (versionId: string, outputPath: string) => Promise<void>;
  };
  recognition?: {
    detectTables: (filePath: string) => Promise<RecognitionResults>;
    extractText: (filePath: string) => Promise<RecognitionResults>;
    getMetadata: (filePath: string) => Promise<RecognitionResults>;
    getStats: (filePath: string) => Promise<RecognitionResults>;
  };
}

declare global {
  interface Window {
    electronApi?: ElectronApi;
  }
}

export {};
