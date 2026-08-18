export type AnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'text-box' | 'drawing' | 'comment' | 'signature';

export interface Annotation {
  id: string;
  type: AnnotationType;
  pageNumber: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  content?: string;
  color?: string;
  opacity?: number;
}

export interface HighlightAnnotation extends Annotation {
  type: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface TextBoxAnnotation extends Annotation {
  type: 'text-box';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
}

export interface DrawingAnnotation extends Annotation {
  type: 'drawing';
  points: Array<{ x: number; y: number }>;
  color: string;
  lineWidth: number;
}

export interface CommentAnnotation extends Annotation {
  type: 'comment';
  x: number;
  y: number;
  content: string;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface SignatureAnnotation extends Annotation {
  type: 'signature';
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string; // base64 encoded image
  timestamp: Date;
  certificateInfo?: {
    subject: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
  };
}

export interface AnnotationState {
  currentTool: AnnotationType | null;
  annotations: Annotation[];
  selectedAnnotation: string | null;
  isDragging: boolean;
  startPoint: { x: number; y: number } | null;
  toolOptions: {
    color: string;
    lineWidth: number;
    opacity: number;
    fontSize: number;
  };
}
