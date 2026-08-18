import * as fs from 'fs';
import * as path from 'path';

export class AnnotationHandler {
  private getAnnotationPath(pdfPath: string): string {
    const dir = path.dirname(pdfPath);
    const basename = path.basename(pdfPath, '.pdf');
    return path.join(dir, `${basename}.annotations.json`);
  }

  async saveAnnotations(pdfPath: string, annotations: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const annotationPath = this.getAnnotationPath(pdfPath);
        const data = {
          pdfPath,
          annotations,
          savedAt: new Date().toISOString(),
          version: '1.0'
        };

        fs.writeFileSync(annotationPath, JSON.stringify(data, null, 2));
        resolve({ success: true, path: annotationPath });
      } catch (error) {
        reject(error);
      }
    });
  }

  async loadAnnotations(pdfPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const annotationPath = this.getAnnotationPath(pdfPath);

        if (!fs.existsSync(annotationPath)) {
          resolve({ success: true, annotations: [] });
          return;
        }

        const content = fs.readFileSync(annotationPath, 'utf-8');
        const data = JSON.parse(content);

        resolve({
          success: true,
          annotations: data.annotations || []
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAnnotation(pdfPath: string, annotationId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.loadAnnotations(pdfPath);
        if (result.success) {
          const annotations = result.annotations.filter(
            (a: any) => a.id !== annotationId
          );
          await this.saveAnnotations(pdfPath, annotations);
          resolve({ success: true });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateAnnotation(pdfPath: string, annotationId: string, updates: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.loadAnnotations(pdfPath);
        if (result.success) {
          const annotations = result.annotations.map((a: any) =>
            a.id === annotationId ? { ...a, ...updates } : a
          );
          await this.saveAnnotations(pdfPath, annotations);
          resolve({ success: true });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
