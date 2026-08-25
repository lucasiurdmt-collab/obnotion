import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'C:\\Users\\wmsli\\OneDrive\\Desktop\\Relatorio_Usuarios_Ativos_Consolidado.pdf';
const data = new Uint8Array(fs.readFileSync(pdfPath));
const loadingTask = pdfjsLib.getDocument({ data });
const doc = await loadingTask.promise;

console.log(`Generated PDF Total Pages: ${doc.numPages}`);
for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
  const page = await doc.getPage(i);
  const text = await page.getTextContent();
  const sample = text.items.map(it => it.str).join(' ').substring(0, 120);
  console.log(`Page ${i}: ${sample}...`);
}
