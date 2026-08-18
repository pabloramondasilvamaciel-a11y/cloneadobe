export interface PDFMetadata {
  filename: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
  pages: number;
  author: string;
  title: string;
}

export interface PDFDocument {
  id: string;
  path: string;
  filename: string;
  numPages: number;
  currentPage: number;
  zoom: number;
  isEncrypted: boolean;
}

export interface PageRenderOptions {
  page: number;
  scale: number;
  rotation?: number;
  width?: number;
  height?: number;
}

export interface TextSearchResult {
  pageNumber: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PDFViewState {
  currentPage: number;
  totalPages: number;
  zoom: number;
  fit: 'page' | 'width' | 'height' | 'auto';
  rotation: 0 | 90 | 180 | 270;
  isDark: boolean;
}
