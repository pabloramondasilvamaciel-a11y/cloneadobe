import { Annotation, HighlightAnnotation, TextBoxAnnotation, DrawingAnnotation, CommentAnnotation, SignatureAnnotation } from '@types/annotations';
import { v4 as uuidv4 } from 'uuid';

export class AnnotationUtil {
  static createHighlight(
    pageNumber: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = '#FFFF00'
  ): HighlightAnnotation {
    return {
      id: uuidv4(),
      type: 'highlight',
      pageNumber,
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      x,
      y,
      width,
      height,
      color
    };
  }

  static createTextBox(
    pageNumber: number,
    x: number,
    y: number,
    width: number,
    height: number,
    content: string,
    fontSize: number = 12,
    fontColor: string = '#000000'
  ): TextBoxAnnotation {
    return {
      id: uuidv4(),
      type: 'text-box',
      pageNumber,
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      x,
      y,
      width,
      height,
      content,
      fontSize,
      fontColor
    };
  }

  static createDrawing(
    pageNumber: number,
    points: Array<{ x: number; y: number }>,
    color: string = '#000000',
    lineWidth: number = 2
  ): DrawingAnnotation {
    return {
      id: uuidv4(),
      type: 'drawing',
      pageNumber,
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      points,
      color,
      lineWidth
    };
  }

  static createComment(
    pageNumber: number,
    x: number,
    y: number,
    content: string
  ): CommentAnnotation {
    return {
      id: uuidv4(),
      type: 'comment',
      pageNumber,
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      x,
      y,
      content,
      replies: []
    };
  }

  static createSignature(
    pageNumber: number,
    x: number,
    y: number,
    width: number,
    height: number,
    imageData: string
  ): SignatureAnnotation {
    return {
      id: uuidv4(),
      type: 'signature',
      pageNumber,
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      x,
      y,
      width,
      height,
      imageData,
      timestamp: new Date()
    };
  }

  static serializeAnnotations(annotations: Annotation[]): string {
    return JSON.stringify(annotations, null, 2);
  }

  static deserializeAnnotations(json: string): Annotation[] {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  static exportAnnotationsToJSON(annotations: Annotation[]): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        annotations
      },
      null,
      2
    );
  }

  static getAnnotationBounds(annotation: Annotation): { x: number; y: number; width: number; height: number } {
    switch (annotation.type) {
      case 'highlight':
      case 'text-box':
      case 'signature':
        const typed = annotation as any;
        return {
          x: typed.x,
          y: typed.y,
          width: typed.width,
          height: typed.height
        };

      case 'comment':
        const comment = annotation as CommentAnnotation;
        return { x: comment.x, y: comment.y, width: 30, height: 30 };

      case 'drawing':
        const drawing = annotation as DrawingAnnotation;
        if (drawing.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

        const xs = drawing.points.map((p) => p.x);
        const ys = drawing.points.map((p) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };

      default:
        return { x: 0, y: 0, width: 0, height: 0 };
    }
  }

  static isPointInAnnotation(
    annotation: Annotation,
    x: number,
    y: number,
    tolerance: number = 10
  ): boolean {
    const bounds = this.getAnnotationBounds(annotation);
    return (
      x >= bounds.x - tolerance &&
      x <= bounds.x + bounds.width + tolerance &&
      y >= bounds.y - tolerance &&
      y <= bounds.y + bounds.height + tolerance
    );
  }
}
