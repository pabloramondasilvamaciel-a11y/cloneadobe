import React, { useRef, useEffect, useState } from 'react';
import { Annotation, HighlightAnnotation, TextBoxAnnotation, DrawingAnnotation, CommentAnnotation } from '@types/annotations';
import { useAnnotationStore } from '@store/annotationStore';
import { AnnotationUtil } from '@utils/annotationUtils';
import './AnnotationLayer.css';

interface AnnotationLayerProps {
  pageNumber: number;
  annotations: Annotation[];
  canvasWidth: number;
  canvasHeight: number;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  pageNumber,
  annotations,
  canvasWidth,
  canvasHeight
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    currentTool,
    toolOptions,
    addAnnotation,
    setIsDragging,
    setStartPoint,
    startPoint,
    isDragging,
    selectedAnnotation,
    setSelectedAnnotation
  } = useAnnotationStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Array<{ x: number; y: number }>>([]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!currentTool || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setIsDragging(true);
    setIsDrawing(true);

    if (currentTool === 'drawing') {
      setDrawingPoints([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !svgRef.current || currentTool !== 'drawing') return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawingPoints((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!startPoint || !isDrawing || !currentTool) return;

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);

    if (currentTool === 'highlight' && width > 10 && height > 10) {
      addAnnotation(
        AnnotationUtil.createHighlight(
          pageNumber,
          Math.min(startPoint.x, x),
          Math.min(startPoint.y, y),
          width,
          height,
          toolOptions.color
        )
      );
    } else if (currentTool === 'drawing' && drawingPoints.length > 2) {
      addAnnotation(
        AnnotationUtil.createDrawing(
          pageNumber,
          drawingPoints,
          toolOptions.color,
          toolOptions.lineWidth
        )
      );
    } else if (currentTool === 'text-box' && width > 20 && height > 20) {
      const content = prompt('Enter text:');
      if (content) {
        addAnnotation(
          AnnotationUtil.createTextBox(
            pageNumber,
            Math.min(startPoint.x, x),
            Math.min(startPoint.y, y),
            width,
            height,
            content,
            toolOptions.fontSize,
            toolOptions.color
          )
        );
      }
    } else if (currentTool === 'comment') {
      const content = prompt('Enter comment:');
      if (content) {
        addAnnotation(
          AnnotationUtil.createComment(pageNumber, startPoint.x, startPoint.y, content)
        );
      }
    }

    setIsDragging(false);
    setIsDrawing(false);
    setStartPoint(null);
    setDrawingPoints([]);
  };

  return (
    <svg
      ref={svgRef}
      className="annotation-layer"
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Highlight Annotations */}
      {annotations.map((ann) => {
        if (ann.type === 'highlight') {
          const h = ann as HighlightAnnotation;
          return (
            <rect
              key={ann.id}
              x={h.x}
              y={h.y}
              width={h.width}
              height={h.height}
              fill={h.color}
              opacity={0.3}
              className={`annotation ${selectedAnnotation === ann.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnotation(ann.id);
              }}
            />
          );
        }
        return null;
      })}

      {/* Text Box Annotations */}
      {annotations.map((ann) => {
        if (ann.type === 'text-box') {
          const t = ann as TextBoxAnnotation;
          return (
            <g key={ann.id}>
              <rect
                x={t.x}
                y={t.y}
                width={t.width}
                height={t.height}
                fill="rgba(255, 255, 0, 0.1)"
                stroke={t.fontColor}
                strokeWidth="1"
                className={`annotation ${selectedAnnotation === ann.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotation(ann.id);
                }}
              />
              <text
                x={t.x + 5}
                y={t.y + t.fontSize}
                fontSize={t.fontSize}
                fill={t.fontColor}
                pointerEvents="none"
              >
                {t.content}
              </text>
            </g>
          );
        }
        return null;
      })}

      {/* Drawing Annotations */}
      {annotations.map((ann) => {
        if (ann.type === 'drawing') {
          const d = ann as DrawingAnnotation;
          if (d.points.length === 0) return null;

          const pathData = d.points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');

          return (
            <path
              key={ann.id}
              d={pathData}
              stroke={d.color}
              strokeWidth={d.lineWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`annotation ${selectedAnnotation === ann.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnotation(ann.id);
              }}
            />
          );
        }
        return null;
      })}

      {/* Comment Annotations */}
      {annotations.map((ann) => {
        if (ann.type === 'comment') {
          const c = ann as CommentAnnotation;
          return (
            <g key={ann.id}>
              <circle
                cx={c.x}
                cy={c.y}
                r="15"
                fill="#FFC107"
                opacity="0.7"
                className={`annotation ${selectedAnnotation === ann.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotation(ann.id);
                }}
              />
              <text
                x={c.x}
                y={c.y + 5}
                textAnchor="middle"
                fontSize="12"
                fill="black"
                pointerEvents="none"
              >
                💬
              </text>
            </g>
          );
        }
        return null;
      })}

      {/* Drawing in progress */}
      {isDrawing && currentTool === 'drawing' && drawingPoints.length > 1 && (
        <polyline
          points={drawingPoints.map((p) => `${p.x},${p.y}`).join(' ')}
          stroke={toolOptions.color}
          strokeWidth={toolOptions.lineWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      )}

      {/* Selection box */}
      {isDragging && startPoint && (
        <rect
          x={startPoint.x}
          y={startPoint.y}
          width={0}
          height={0}
          stroke={toolOptions.color}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4"
          opacity="0.5"
        />
      )}
    </svg>
  );
};

export default AnnotationLayer;
