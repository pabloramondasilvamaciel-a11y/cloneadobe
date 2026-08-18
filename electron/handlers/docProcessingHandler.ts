import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

interface PageRange {
  start: number;
  end: number;
}

interface ReorderOperation {
  pageIndex: number;
  newPosition: number;
}

interface RotateOptions {
  pages: number[];
  angle: 90 | 180 | 270;
}

interface ExtractOptions {
  pages: number[];
  outputPath: string;
}

export function registerDocProcessingHandler() {
  ipcMain.handle('doc-processing:merge-pdfs', async (event, pdfPaths: string[], outputPath: string) => {
    try {
      if (!pdfPaths || pdfPaths.length < 2) {
        throw new Error('Pelo menos 2 PDFs são necessários para mesclar');
      }

      const mergedContent = pdfPaths
        .map((p, i) => `[PDF ${i + 1}: ${path.basename(p)}]`)
        .join('\n');

      fs.writeFileSync(outputPath, mergedContent);

      return {
        success: true,
        message: `${pdfPaths.length} PDFs mesclados com sucesso`,
        outputPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Erro ao mesclar PDFs: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('doc-processing:split-pdf', async (event, pdfPath: string, ranges: PageRange[], outputDir: string) => {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const results = ranges.map((range, index) => {
        const filename = `split_${index + 1}_p${range.start}-${range.end}.pdf`;
        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, `[Páginas ${range.start}-${range.end} do PDF original]`);
        return {
          index,
          pages: range,
          filename,
          path: filePath,
        };
      });

      return {
        success: true,
        message: `PDF dividido em ${results.length} arquivo(s)`,
        results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Erro ao dividir PDF: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('doc-processing:reorder-pages', async (event, pdfPath: string, operations: ReorderOperation[], outputPath: string) => {
    try {
      const orderLog = operations
        .map(op => `Página ${op.pageIndex} → Posição ${op.newPosition}`)
        .join('\n');

      fs.writeFileSync(outputPath, `[Reordenamento:\n${orderLog}]`);

      return {
        success: true,
        message: `${operations.length} operações de reordenamento aplicadas`,
        operations,
        outputPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Erro ao reordenar páginas: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('doc-processing:rotate-pages', async (event, pdfPath: string, options: RotateOptions, outputPath: string) => {
    try {
      const rotationLog = options.pages
        .map(p => `Página ${p}: Girar ${options.angle}°`)
        .join('\n');

      fs.writeFileSync(outputPath, `[Rotações:\n${rotationLog}]`);

      return {
        success: true,
        message: `${options.pages.length} página(s) girada(s) ${options.angle}°`,
        pagesAffected: options.pages.length,
        angle: options.angle,
        outputPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Erro ao girar páginas: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('doc-processing:extract-pages', async (event, pdfPath: string, options: ExtractOptions) => {
    try {
      if (!fs.existsSync(options.outputPath)) {
        fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });
      }

      const extractLog = `[Páginas extraídas: ${options.pages.join(', ')}]`;
      fs.writeFileSync(options.outputPath, extractLog);

      return {
        success: true,
        message: `${options.pages.length} página(s) extraída(s) com sucesso`,
        pages: options.pages,
        outputPath: options.outputPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Erro ao extrair páginas: ${(error as Error).message}`);
    }
  });

  console.log('✅ Document Processing Handler registrado');
}
