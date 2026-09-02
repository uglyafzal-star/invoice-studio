import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Renders a DOM element (the invoice document) into a high-quality,
 * A4-optimized, multi-page-aware PDF and triggers a download.
 */
export async function downloadElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
    windowWidth: element.offsetWidth,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const pxPerMm = canvas.width / pageW;
  const pagePxH = Math.floor(pageH * pxPerMm);

  let y = 0;
  let page = 0;
  while (y < canvas.height) {
    const sliceH = Math.min(pagePxH, canvas.height - y);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceH;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not supported in this browser.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
    const img = pageCanvas.toDataURL('image/jpeg', 0.98);
    if (page > 0) pdf.addPage();
    pdf.addImage(img, 'JPEG', 0, 0, pageW, sliceH / pxPerMm);
    y += sliceH;
    page += 1;
  }

  pdf.save(filename);
}
