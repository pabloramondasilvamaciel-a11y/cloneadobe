import create from 'zustand';
import { Annotation, AnnotationType, AnnotationState } from '@types/annotations';
import { v4 as uuidv4 } from 'uuid';

interface AnnotationStoreState extends AnnotationState {
  // Actions
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  setCurrentTool: (tool: AnnotationType | null) => void;
  setSelectedAnnotation: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setStartPoint: (point: { x: number; y: number } | null) => void;
  setToolOptions: (options: Partial<AnnotationState['toolOptions']>) => void;
  clearAnnotations: () => void;
  getAnnotationsByPage: (pageNumber: number) => Annotation[];
}

export const useAnnotationStore = create<AnnotationStoreState>((set, get) => ({
  currentTool: null,
  annotations: [],
  selectedAnnotation: null,
  isDragging: false,
  startPoint: null,
  toolOptions: {
    color: '#FFFF00',
    lineWidth: 2,
    opacity: 0.7,
    fontSize: 12
  },

  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [...state.annotations, { ...annotation, id: annotation.id || uuidv4() }]
    })),

  removeAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id)
    })),

  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              updatedAt: new Date()
            }
          : a
      )
    })),

  setCurrentTool: (tool) => set({ currentTool: tool }),

  setSelectedAnnotation: (id) => set({ selectedAnnotation: id }),

  setIsDragging: (isDragging) => set({ isDragging }),

  setStartPoint: (point) => set({ startPoint: point }),

  setToolOptions: (options) =>
    set((state) => ({
      toolOptions: { ...state.toolOptions, ...options }
    })),

  clearAnnotations: () => set({ annotations: [] }),

  getAnnotationsByPage: (pageNumber) => {
    const state = get();
    return state.annotations.filter((a) => a.pageNumber === pageNumber);
  }
}));
