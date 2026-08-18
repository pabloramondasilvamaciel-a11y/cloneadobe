import create from 'zustand';
import { PDFViewState, PDFDocument } from '@types/pdf';

interface PDFStore {
  document: PDFDocument | null;
  viewState: PDFViewState;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDocument: (doc: PDFDocument) => void;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  setFit: (fit: 'page' | 'width' | 'height' | 'auto') => void;
  setRotation: (rotation: 0 | 90 | 180 | 270) => void;
  setDarkMode: (isDark: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialViewState: PDFViewState = {
  currentPage: 1,
  totalPages: 0,
  zoom: 100,
  fit: 'auto',
  rotation: 0,
  isDark: false
};

export const usePDFStore = create<PDFStore>((set) => ({
  document: null,
  viewState: initialViewState,
  isLoading: false,
  error: null,

  setDocument: (doc) => set({ document: doc }),

  setCurrentPage: (page) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        currentPage: Math.min(Math.max(1, page), state.viewState.totalPages)
      }
    })),

  setZoom: (zoom) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        zoom: Math.min(Math.max(50, zoom), 400)
      }
    })),

  setFit: (fit) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        fit
      }
    })),

  setRotation: (rotation) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        rotation
      }
    })),

  setDarkMode: (isDark) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        isDark
      }
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      document: null,
      viewState: initialViewState,
      isLoading: false,
      error: null
    })
}));
