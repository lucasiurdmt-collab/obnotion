import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const defaultInputPdf = 'C:\\Users\\wmsli\\Downloads\\Relatorio_usuarios_ativos_por_bloco_regiao.pdf';
const desktopPath = 'C:\\Users\\wmsli\\OneDrive\\Desktop';
const outputDir = path.join(desktopPath, 'Relatorios_Por_Bloco');

function formatNumber(num) {
  return num.toLocaleString('pt-BR');
}

function sanitizeFilename(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
}

async function extractDataFromPdf(pdfPath) {
  console.log(`Lendo arquivo PDF: ${pdfPath}`);
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const doc = await loadingTask.promise;
  
  const blocks = {};
  let currentBlock = "SEM_BLOCO";
  let currentRegion = "GERAL";
  
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Sort items by Y descending (top to bottom), then X ascending (left to right)
    const items = content.items.map(it => ({
      str: it.str.trim(),
      x: it.transform[4],
      y: it.transform[5]
    })).filter(it => it.str.length > 0);
    
    items.sort((a, b) => {
      if (Math.abs(b.y - a.y) > 3) return b.y - a.y;
      return a.x - b.x;
    });

    let i = 0;
    while (i < items.length) {
      const item = items[i];
      const text = item.str;
      
      // Ignore footers and page markers
      if (text.startsWith("Fonte dos quantitativos") || text.startsWith("Página ")) {
        i++;
        continue;
      }
      
      // Check for block header
      if (text === 'n' && i + 1 < items.length && items[i+1].str.startsWith("BLOCO:")) {
        currentBlock = items[i+1].str.replace("BLOCO:", "").trim();
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: currentBlock, regions: {} };
        i += 2;
        continue;
      } else if (text.startsWith("BLOCO:")) {
        currentBlock = text.replace("BLOCO:", "").trim();
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: currentBlock, regions: {} };
        i++;
        continue;
      }
      
      // Check for region header
      if (text === 'n' && i + 1 < items.length && items[i+1].str.startsWith("Região:")) {
        currentRegion = items[i+1].str.replace("Região:", "").trim();
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: currentBlock, regions: {} };
        if (!blocks[currentBlock].regions[currentRegion]) {
          blocks[currentBlock].regions[currentRegion] = [];
        }
        i += 2;
        continue;
      } else if (text.startsWith("Região:")) {
        currentRegion = text.replace("Região:", "").trim();
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: currentBlock, regions: {} };
        if (!blocks[currentBlock].regions[currentRegion]) {
          blocks[currentBlock].regions[currentRegion] = [];
        }
        i++;
        continue;
      }
      
      // Check for table header keywords
      if (text === 'Igreja' || text === 'Usuários ativos' || text === 'Registro') {
        i++;
        continue;
      }
      
      // Check for unmapped records section
      if (text.startsWith("IGREJAS / REGISTROS SEM CORRESPONDÊNCIA")) {
        currentBlock = "SEM_CORRESPONDENCIA";
        currentRegion = "REGISTROS SEM CORRESPONDÊNCIA";
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: "REGISTROS SEM CORRESPONDÊNCIA", regions: {} };
        if (!blocks[currentBlock].regions[currentRegion]) {
          blocks[currentBlock].regions[currentRegion] = [];
        }
        i++;
        continue;
      }
      
      // Check for church name + count pair
      if (i + 1 < items.length && /^\d+$/.test(items[i+1].str)) {
        const church = text;
        const count = parseInt(items[i+1].str, 10);
        if (!blocks[currentBlock]) blocks[currentBlock] = { name: currentBlock, regions: {} };
        if (!blocks[currentBlock].regions[currentRegion]) blocks[currentBlock].regions[currentRegion] = [];
        blocks[currentBlock].regions[currentRegion].push({ church, count, page: pageNum });
        i += 2;
        continue;
      }
      
      i++;
    }
  }

  return blocks;
}

function generateBlockHtml(blockKey, blockData) {
  const displayName = blockData.name || blockKey;
  let totalUsers = 0;
  let totalChurches = 0;
  const regionNames = Object.keys(blockData.regions);
  const totalRegions = regionNames.length;

  for (let churches of Object.values(blockData.regions)) {
    totalChurches += churches.length;
    totalUsers += churches.reduce((s, c) => s + c.count, 0);
  }

  let regionsHtml = '';

  for (let [regName, churches] of Object.entries(blockData.regions)) {
    const regTotal = churches.reduce((s, c) => s + c.count, 0);
    
    let rowsHtml = churches.map((c, idx) => `
      <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
        <td class="church-name">${c.church}</td>
        <td class="church-count">${formatNumber(c.count)}</td>
      </tr>
    `).join('');

    regionsHtml += `
      <div class="region-card">
        <div class="region-header">
          <div class="region-title"><span class="reg-prefix">Região:</span> ${regName}</div>
          <div class="region-summary">${churches.length} ${churches.length === 1 ? 'igreja' : 'igrejas'} | <strong>${formatNumber(regTotal)}</strong> ativos</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-church">Igreja / Registro</th>
              <th class="col-count">Usuários Ativos</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório - ${displayName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.35;
      background-color: #ffffff;
    }
    .header-container {
      margin-bottom: 12px;
      border-bottom: 2px solid #0f2b4c;
      padding-bottom: 8px;
    }
    .doc-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }
    .doc-main-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f2b4c;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-subtitle {
      font-size: 9px;
      color: #64748b;
      font-weight: 500;
    }
    .block-banner {
      background: linear-gradient(135deg, #0b2d5b 0%, #17365d 60%, #1e4b82 100%);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(15, 43, 76, 0.12);
    }
    .block-name {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .block-badge-group {
      display: flex;
      gap: 10px;
    }
    .badge {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 3px 9px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .badge strong {
      font-size: 11.5px;
      color: #ffffff;
    }
    .content-grid {
      column-count: 2;
      column-gap: 16px;
      margin-top: 10px;
    }
    .region-card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 12px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .region-header {
      background-color: #f1f5f9;
      border-bottom: 1px solid #cbd5e1;
      padding: 5px 9px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .region-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #0f2b4c;
      text-transform: uppercase;
    }
    .reg-prefix {
      color: #64748b;
      font-weight: 600;
    }
    .region-summary {
      font-size: 9px;
      color: #475569;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    .data-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table th {
      padding: 3.5px 9px;
      font-size: 8.5px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .data-table th.col-church {
      text-align: left;
    }
    .data-table th.col-count {
      text-align: right;
    }
    .data-table td {
      padding: 3.5px 9px;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-table tr.even {
      background-color: #ffffff;
    }
    .data-table tr.odd {
      background-color: #f8fafc;
    }
    .church-name {
      font-weight: 500;
      color: #1e293b;
    }
    .church-count {
      text-align: right;
      font-weight: 600;
      color: #0f2b4c;
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="doc-top-bar">
      <h1 class="doc-main-title">Relatório de Usuários Ativos</h1>
      <span class="doc-subtitle">Organização por bloco e região conforme relatório de referência</span>
    </div>
    <div class="block-banner">
      <div class="block-name">${blockKey.startsWith('SEM_') ? displayName : 'BLOCO: ' + displayName}</div>
      <div class="block-badge-group">
        <div class="badge">Regiões: <strong>${totalRegions}</strong></div>
        <div class="badge">Igrejas / Itens: <strong>${totalChurches}</strong></div>
        <div class="badge">Total Usuários Ativos: <strong>${formatNumber(totalUsers)}</strong></div>
      </div>
    </div>
  </div>

  <div class="content-grid">
    ${regionsHtml}
  </div>
</body>
</html>
  `;
}

async function main() {
  const inputPdf = process.argv[2] || defaultInputPdf;
  
  if (!fs.existsSync(inputPdf)) {
    console.error(`Erro: Arquivo não encontrado em ${inputPdf}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const blocksData = await extractDataFromPdf(inputPdf);
  const blockKeys = Object.keys(blocksData);
  console.log(`\nIdentificados ${blockKeys.length} blocos / seções.`);

  console.log(`Iniciando geração dos PDFs em: ${outputDir}\n`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const summaryReport = [];

  let index = 1;
  for (let [blockKey, blockData] of Object.entries(blocksData)) {
    const rawName = blockData.name || blockKey;
    const prefix = blockKey.startsWith('SEM_') ? '' : 'BLOCO_';
    const cleanName = prefix + sanitizeFilename(rawName);
    const fileName = `${String(index).padStart(2, '0')}_${cleanName}.pdf`;
    const targetFilePath = path.join(outputDir, fileName);

    let churchCount = 0;
    let userCount = 0;
    for (let r of Object.values(blockData.regions)) {
      churchCount += r.length;
      userCount += r.reduce((s, c) => s + c.count, 0);
    }

    const html = generateBlockHtml(blockKey, blockData);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.pdf({
      path: targetFilePath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 8px; color: #7a7a7a; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm 4mm 14mm;">
          <span>Fonte dos quantitativos: arquivo atual de Usuários ativos</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: '12mm',
        bottom: '14mm',
        left: '12mm',
        right: '12mm'
      }
    });

    console.log(`[${index}/${blockKeys.length}] Gerado: ${fileName} (${Object.keys(blockData.regions).length} regiões, ${churchCount} igrejas, ${formatNumber(userCount)} usuários)`);
    
    summaryReport.push({
      indice: index,
      bloco: rawName,
      arquivo: fileName,
      regioes: Object.keys(blockData.regions).length,
      igrejas: churchCount,
      usuariosAtivos: userCount
    });

    index++;
  }

  await browser.close();

  // Save summary JSON & Markdown on the output folder
  const summaryMd = `# Resumo dos Relatórios por Bloco

**Arquivo de Origem**: \`${inputPdf}\`  
**Pasta de Destino**: \`${outputDir}\`  
**Total de Blocos Gerados**: ${summaryReport.length}  
**Total Geral de Usuários Ativos**: ${formatNumber(summaryReport.reduce((s, r) => s + r.usuariosAtivos, 0))}  
**Total Geral de Igrejas / Registros**: ${formatNumber(summaryReport.reduce((s, r) => s + r.igrejas, 0))}  

---

| # | Bloco | Arquivo PDF | Regiões | Igrejas / Itens | Usuários Ativos |
|---|---|---|---|---|---|
${summaryReport.map(r => `| ${r.indice} | **${r.bloco}** | \`${r.arquivo}\` | ${r.regioes} | ${r.igrejas} | **${formatNumber(r.usuariosAtivos)}** |`).join('\n')}
`;

  fs.writeFileSync(path.join(outputDir, 'README_RESUMO.md'), summaryMd, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'resumo_blocos.json'), JSON.stringify(summaryReport, null, 2), 'utf8');

  console.log(`\nProcesso concluído com sucesso! Todos os PDFs foram salvos na pasta:\n${outputDir}`);
}

main().catch(err => {
  console.error("Erro durante a execução:", err);
  process.exit(1);
});
