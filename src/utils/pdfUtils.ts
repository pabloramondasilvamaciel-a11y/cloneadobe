import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class PDFUtil {
  private pdf: any | null = null;
  private currentScale = 1;

  async loadPDF(url: string | ArrayBuffer): Promise<any> {
    this.pdf = await pdfjsLib.getDocument(url).promise;
    return this.pdf;
  }

  getPageCount(): number {
    return this.pdf?.numPages || 0;
  }

  async renderPage(
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number = 1
  ): Promise<void> {
    if (!this.pdf) throw new Error('PDF not loaded');

    const page = await this.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  }

  async extractText(pageNumber: number): Promise<string> {
    if (!this.pdf) throw new Error('PDF not loaded');

    const page = await this.pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    return textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
  }

  async searchText(
    query: string,
    options: { matchCase?: boolean; wholeWords?: boolean } = {}
  ): Promise<Array<{ page: number; text: string; matches: number }>> {
    if (!this.pdf) throw new Error('PDF not loaded');

    const results: Array<{ page: number; text: string; matches: number }> = [];
    const searchQuery = options.matchCase ? query : query.toLowerCase();

    for (let i = 1; i <= this.pdf.numPages; i++) {
      const page = await this.pdf.getPage(i);
      const textContent = await page.getTextContent();

      let pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');

      if (!options.matchCase) pageText = pageText.toLowerCase();

      const matches = (pageText.match(new RegExp(searchQuery, 'g')) || []).length;

      if (matches > 0) {
        results.push({
          page: i,
          text: pageText.substring(0, 200),
          matches
        });
      }
    }

    return results;
  }

  async getPageText(pageNumber: number): Promise<string> {
    if (!this.pdf) throw new Error('PDF not loaded');

    const page = await this.pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    return textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join('');
  }

  async getPageDimensions(
    pageNumber: number
  ): Promise<{ width: number; height: number }> {
    if (!this.pdf) throw new Error('PDF not loaded');

    const page = await this.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });

    return {
      width: viewport.width,
      height: viewport.height
    };
  }

  destroy(): void {
    if (this.pdf) {
      this.pdf.cleanup();
      this.pdf = null;
    }
  }
}

export const pdfUtil = new PDFUtil();
