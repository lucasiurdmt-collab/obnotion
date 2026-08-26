import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const desktopPath = 'C:\\Users\\wmsli\\OneDrive\\Desktop';
const defaultExcelPath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const outputPdfPath = path.join(desktopPath, 'Relatorio_Usuarios_Ativos_Consolidado.pdf');

function formatNumber(num) {
  return Number(num || 0).toLocaleString('pt-BR');
}

function sanitizeFilename(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
}

async function loadAndProcessData(excelFilePath) {
  console.log(`Lendo arquivo Excel: ${excelFilePath}`);
  
  // Base hierarchy extracted from master reference
  const baseHierarchy = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

  // Aliases for churches with specific naming conventions
  const churchAliases = {
    'sede_teofilo_otoni': { block: 'TEOFILO OTONI', region: 'SEDE DO BLOCO', name: 'sede_teofilo_otoni' },
    'teofilo_otoni': { block: 'TEOFILO OTONI', region: 'SEDE DO BLOCO', name: 'sede_teofilo_otoni' },
    'venda_nova': { block: 'VENDA NOVA', region: 'SEDE DO BLOCO', name: 'sede_venda_nova' },
    'arinos': { block: 'UBERLANDIA', region: 'UNAI', name: 'arinos' },
    'campanha': { block: 'VARGINHA', region: 'TRES CORACOES', name: 'campanha' },
    'resplendor': { block: 'GOVERNADOR VALADARES', region: 'GOVERNADOR VALADARES', name: 'resplendor' },
    'ftu': { block: 'GRUPOS SANTUÁRIO', region: 'FTU', name: 'ftu' },
    'socioeducativo': { block: 'GRUPOS SANTUÁRIO', region: 'SOCIOEDUCATIVO', name: 'socioeducativo' },
    'morro_alto': { block: 'VENDA NOVA', region: 'VESPASIANO', name: 'morro_alto' },
    'general_carneiro': { block: 'BELO HORIZONTE', region: 'SABARA', name: 'general_carneiro' },
    'gameleira': { block: 'BELO HORIZONTE', region: 'AMAZONAS', name: 'gameleira' },
    'alto_dos_pinheiros': { block: 'BELO HORIZONTE', region: 'BARROCA', name: 'alto_dos_pinheiros' },
    'eymard': { block: 'BELO HORIZONTE', region: 'SAO GABRIEL', name: 'eymard' },
    'tupi': { block: 'BELO HORIZONTE', region: 'GUARANI', name: 'tupi' },
    'amazonas': { block: 'BELO HORIZONTE', region: 'AMAZONAS', name: 'amazonas' },
    'mirai': { block: 'UBÁ', region: 'MURIAE', name: 'mirai' },
    'arceburgo': { block: 'VARGINHA', region: 'SAO SEBASTIAO DO PARAISO', name: 'arceburgo' },
    'tangara': { block: 'MONTES CLAROS', region: 'MONTES CLAROS', name: 'tangara' },
    'canaa_luizote': { block: 'UBERLANDIA', region: 'LUIZOTE', name: 'canaa_luizote' },
    'cardoso': { block: 'BELO HORIZONTE', region: 'BARREIRO', name: 'cardoso' },
    'piedade': { block: 'CONSELHEIRO LAFAIETE', region: 'BARBACENA', name: 'piedade' },
    'pote': { block: 'TEOFILO OTONI', region: 'MALACACHETA', name: 'pote' },
    'rio_manso': { block: 'BETIM', region: 'IGARAPE', name: 'rio_manso' },
    'buritizeiro': { block: 'MONTES CLAROS', region: 'PIRAPORA', name: 'buritizeiro' },
    'campos_altos': { block: 'DIVINOPOLIS', region: 'NOVA SERRANA', name: 'campos_altos' },
    'residencial_2000': { block: 'UBERABA', region: 'UBERABA', name: 'residencial_2000' },
    'valim_de_melo': { block: 'UBERABA', region: 'UBERABA', name: 'valim_de_melo' },
    'campanario': { block: 'GOVERNADOR VALADARES', region: 'GOVERNADOR VALADARES', name: 'campanario' },
    'pilar': { block: 'ITABIRA', region: 'BARAO DE COCAIS', name: 'morro_do_pilar' },
    'aclimacao': { block: 'UBERLANDIA', region: 'PLANALTO', name: 'aclimacao' },
    'alvinopolis': { block: 'ITABIRA', region: 'JOAO MONLEVADE', name: 'alvinopolis' },
    'campod_do_meio': { block: 'VARGINHA', region: 'ALFENAS', name: 'campo_do_meio' },
    'nacional': { block: 'ELDORADO', region: 'FLORENCA', name: 'nacional' },
    'santana_da_vargem': { block: 'VARGINHA', region: 'TRES PONTAS', name: 'santana_da_vargem' },
    'taquara': { block: 'ITABIRA', region: 'GUANHAES', name: 'taquaracu' }
  };

  const churchIndex = {};
  for (const [blockName, blockObj] of Object.entries(baseHierarchy)) {
    for (const [regionName, churches] of Object.entries(blockObj.regions)) {
      for (const item of churches) {
        const key = item.church.toLowerCase().trim();
        churchIndex[key] = { block: blockName, region: regionName, name: item.church };
        const stripped = key.replace(/[-_ ]/g, '');
        if (!churchIndex[stripped]) {
          churchIndex[stripped] = { block: blockName, region: regionName, name: item.church };
        }
      }
    }
  }

  const workbook = XLSX.readFile(excelFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  let startReading = false;
  const processedBlocks = {};
  let metaProjectTitle = "Vencendo o Divórcio";
  let metaPeriod = "";
  let totalGeralExcel = 0;

  for (const [blockName, blockObj] of Object.entries(baseHierarchy)) {
    if (blockName === 'SEM_CORRESPONDENCIA') continue;
    processedBlocks[blockName] = {
      name: blockObj.name,
      regions: {}
    };
    for (const regionName of Object.keys(blockObj.regions)) {
      processedBlocks[blockName].regions[regionName] = [];
    }
  }

  if (!processedBlocks['GRUPOS SANTUÁRIO'].regions['FTU']) {
    processedBlocks['GRUPOS SANTUÁRIO'].regions['FTU'] = [];
  }
  if (!processedBlocks['GRUPOS SANTUÁRIO'].regions['SOCIOEDUCATIVO']) {
    processedBlocks['GRUPOS SANTUÁRIO'].regions['SOCIOEDUCATIVO'] = [];
  }

  const semCorrespondencia = [];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    
    if (row[0] && String(row[0]).startsWith('#')) {
      const line = String(row[0]).replace(/^#\s*/, '').trim();
      if (line.includes('Vencendo')) metaProjectTitle = line;
      if (/\d{8}-\d{8}/.test(line)) {
        const parts = line.split('-');
        if (parts.length === 2 && parts[0].length === 8 && parts[1].length === 8) {
          const d1 = `${parts[0].substring(6,8)}/${parts[0].substring(4,6)}/${parts[0].substring(0,4)}`;
          const d2 = `${parts[1].substring(6,8)}/${parts[1].substring(4,6)}/${parts[1].substring(0,4)}`;
          metaPeriod = `${d1} a ${d2}`;
        } else {
          metaPeriod = line;
        }
      }
      continue;
    }

    if (row[0] === 'igreja' || (row[1] && String(row[1]).includes('Usuários'))) {
      startReading = true;
      continue;
    }

    if (startReading) {
      if (row[2] === 'Total geral' || row[0] === 'Total geral' || (!row[0] && row[1])) {
        totalGeralExcel = Number(row[1]) || totalGeralExcel;
        continue;
      }
      const rawName = row[0] ? String(row[0]).trim() : '';
      const count = Number(row[1]) || 0;
      if (!rawName) continue;

      let cleanKey = rawName.toLowerCase().trim();
      if (cleanKey.includes('http')) {
        cleanKey = cleanKey.split('http')[0].trim().replace(/[^a-z0-9_]/g, '');
      }
      cleanKey = cleanKey.replace(/\*+/g, '').replace(/👌.*/g, '').trim();

      let loc = churchAliases[cleanKey] || churchIndex[cleanKey] || churchIndex[cleanKey.replace(/[-_ ]/g, '')];

      if (loc && loc.block !== 'SEM_CORRESPONDENCIA') {
        if (!processedBlocks[loc.block]) {
          processedBlocks[loc.block] = { name: loc.block, regions: {} };
        }
        if (!processedBlocks[loc.block].regions[loc.region]) {
          processedBlocks[loc.block].regions[loc.region] = [];
        }
        const existing = processedBlocks[loc.block].regions[loc.region].find(c => c.church.toLowerCase() === rawName.toLowerCase());
        if (existing) {
          existing.count += count;
        } else {
          processedBlocks[loc.block].regions[loc.region].push({ church: rawName, count });
        }
      } else {
        semCorrespondencia.push({ church: rawName, count });
      }
    }
  }

  if (semCorrespondencia.length > 0) {
    processedBlocks['SEM_CORRESPONDENCIA'] = {
      name: 'REGISTROS SEM CORRESPONDÊNCIA',
      regions: {
        'REGISTROS SEM CORRESPONDÊNCIA': semCorrespondencia
      }
    };
  }

  return {
    blocks: processedBlocks,
    meta: {
      projectTitle: metaProjectTitle,
      period: metaPeriod,
      totalGeralExcel
    }
  };
}

function generateCompleteHtml(blocksData, meta) {
  let summaryRows = [];
  let grandTotalUsers = 0;
  let grandTotalChurches = 0;
  let grandTotalRegions = 0;

  // Pre-calculate block summaries
  let blockIndex = 1;
  const blockList = [];

  for (let [blockKey, blockData] of Object.entries(blocksData)) {
    const rawName = blockData.name || blockKey;
    let bChurches = 0;
    let bUsers = 0;
    const regKeys = Object.keys(blockData.regions);
    const bRegions = regKeys.length;

    for (let churches of Object.values(blockData.regions)) {
      bChurches += churches.length;
      bUsers += churches.reduce((s, c) => s + c.count, 0);
    }

    grandTotalUsers += bUsers;
    grandTotalChurches += bChurches;
    grandTotalRegions += bRegions;

    blockList.push({
      index: blockIndex,
      key: blockKey,
      name: rawName,
      data: blockData,
      regionsCount: bRegions,
      churchesCount: bChurches,
      usersCount: bUsers
    });

    summaryRows.push(`
      <tr>
        <td class="col-center idx-col">${blockIndex}</td>
        <td class="col-name"><strong>${rawName}</strong></td>
        <td class="col-num">${bRegions}</td>
        <td class="col-num">${bChurches}</td>
        <td class="col-num highlight-num">${formatNumber(bUsers)}</td>
      </tr>
    `);

    blockIndex++;
  }

  // Generate Summary Cover Page
  const coverHtml = `
    <div class="page-block cover-page">
      <div class="cover-header">
        <div class="super-badge">RELATÓRIO CONSOLIDADO ESTADUAL</div>
        <h1 class="cover-main-title">${meta.projectTitle}</h1>
        <div class="cover-meta-info">
          ${meta.period ? `<span><strong>Período:</strong> ${meta.period}</span> &bull; ` : ''}
          <span><strong>Total de Blocos:</strong> ${blockList.length}</span> &bull;
          <span><strong>Total de Regiões:</strong> ${grandTotalRegions}</span> &bull;
          <span><strong>Total de Igrejas / Registros:</strong> ${formatNumber(grandTotalChurches)}</span>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">TOTAL DE USUÁRIOS ATIVOS</div>
          <div class="kpi-val">${formatNumber(grandTotalUsers)}</div>
          <div class="kpi-sub">${formatNumber(meta.totalGeralExcel || grandTotalUsers)} únicos no período</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">TOTAL DE BLOCOS</div>
          <div class="kpi-val">${blockList.length}</div>
          <div class="kpi-sub">incluindo Grupos e Registros</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">REGIÕES ATIVAS</div>
          <div class="kpi-val">${grandTotalRegions}</div>
          <div class="kpi-sub">distribuídas em Minas Gerais</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">IGREJAS / PONTOS</div>
          <div class="kpi-val">${formatNumber(grandTotalChurches)}</div>
          <div class="kpi-sub">com registros cadastrados</div>
        </div>
      </div>

      <div class="summary-table-container">
        <h3 class="section-title">Resumo Comparativo por Bloco</h3>
        <table class="summary-table">
          <thead>
            <tr>
              <th class="col-center" style="width: 40px;">#</th>
              <th>Bloco / Seção</th>
              <th class="col-num" style="width: 90px;">Regiões</th>
              <th class="col-num" style="width: 110px;">Igrejas / Itens</th>
              <th class="col-num" style="width: 140px;">Usuários Ativos</th>
            </tr>
          </thead>
          <tbody>
            ${summaryRows.join('')}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2" class="total-label">TOTAL CONSOLIDADO GERAL</th>
              <th class="col-num">${grandTotalRegions}</th>
              <th class="col-num">${formatNumber(grandTotalChurches)}</th>
              <th class="col-num highlight-num-total">${formatNumber(grandTotalUsers)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  // Generate Detail Page for each Block
  let blockPagesHtml = '';

  for (const b of blockList) {
    let regionsHtml = '';

    for (let [regName, churches] of Object.entries(b.data.regions)) {
      const regTotal = churches.reduce((s, c) => s + c.count, 0);

      // Sort churches by count descending, then by name
      const sortedChurches = [...churches].sort((x, y) => {
        if (y.count !== x.count) return y.count - x.count;
        return x.church.localeCompare(y.church);
      });

      let rowsHtml = sortedChurches.map((c, idx) => `
        <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
          <td class="church-name">${c.church}</td>
          <td class="church-count">${formatNumber(c.count)}</td>
        </tr>
      `).join('');

      regionsHtml += `
        <div class="region-card">
          <div class="region-header">
            <div class="region-title"><span class="reg-prefix">Região:</span> ${regName}</div>
            <div class="region-summary">${churches.length} ${churches.length === 1 ? 'igreja' : 'igrejas'} &bull; <strong>${formatNumber(regTotal)}</strong> ativos</div>
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

    const isSpecial = b.key.startsWith('SEM_');
    const headerTitle = isSpecial ? b.name : `BLOCO: ${b.name}`;

    blockPagesHtml += `
      <div class="page-block detail-page">
        <div class="header-container">
          <div class="doc-top-bar">
            <div>
              <span class="doc-project">${meta.projectTitle}</span>
              <h2 class="doc-main-title">Relatório de Usuários Ativos</h2>
            </div>
            <div class="doc-meta-right">
              ${meta.period ? `<span class="period-pill">Período: ${meta.period}</span>` : ''}
              <span class="block-index-pill">Bloco ${b.index} de ${blockList.length}</span>
            </div>
          </div>
          
          <div class="block-banner">
            <div class="block-name">${headerTitle}</div>
            <div class="block-badge-group">
              <div class="badge">Regiões: <strong>${b.regionsCount}</strong></div>
              <div class="badge">Igrejas / Itens: <strong>${formatNumber(b.churchesCount)}</strong></div>
              <div class="badge">Total Usuários Ativos: <strong>${formatNumber(b.usersCount)}</strong></div>
            </div>
          </div>
        </div>

        <div class="content-grid ${b.regionsCount > 8 ? 'grid-3-col' : 'grid-2-col'}">
          ${regionsHtml}
        </div>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${meta.projectTitle} - Relatório Consolidado</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.35;
      background-color: #ffffff;
    }

    .page-block {
      page-break-before: always;
      break-before: page;
    }
    .page-block:first-child {
      page-break-before: avoid;
      break-before: avoid;
    }

    /* COVER / SUMMARY PAGE */
    .cover-page {
      padding: 0;
    }
    .cover-header {
      text-align: center;
      margin-bottom: 8px;
      border-bottom: 2px solid #0f2b4c;
      padding-bottom: 6px;
    }
    .super-badge {
      display: inline-block;
      background-color: #0f2b4c;
      color: #ffffff;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1.2px;
      padding: 2px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .cover-main-title {
      font-size: 18px;
      font-weight: 900;
      color: #0b2d5b;
      margin: 0 0 3px 0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .cover-meta-info {
      font-size: 9.5px;
      color: #475569;
      font-weight: 500;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 10px;
    }
    .kpi-card {
      background: linear-gradient(145deg, #f8fafc 0%, #edf2f7 100%);
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      border-left: 4px solid #0b2d5b;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .kpi-label {
      font-size: 7.5px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.6px;
      margin-bottom: 2px;
    }
    .kpi-val {
      font-size: 16px;
      font-weight: 900;
      color: #0b2d5b;
      line-height: 1.1;
    }
    .kpi-sub {
      font-size: 7.5px;
      color: #64748b;
      margin-top: 2px;
    }

    .summary-table-container {
      margin-top: 4px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f2b4c;
      text-transform: uppercase;
      margin: 0 0 5px 0;
      letter-spacing: 0.4px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      overflow: hidden;
    }
    .summary-table thead tr {
      background: #0f2b4c;
      color: #ffffff;
    }
    .summary-table th {
      padding: 3.5px 8px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border-right: 1px solid rgba(255,255,255,0.15);
    }
    .summary-table th:last-child {
      border-right: none;
    }
    .summary-table td {
      padding: 2.8px 8px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
    }
    .summary-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .summary-table tr:nth-child(odd) {
      background-color: #ffffff;
    }
    .summary-table tfoot tr {
      background-color: #e2e8f0;
      border-top: 2px solid #0f2b4c;
    }
    .summary-table tfoot th {
      color: #0f2b4c;
      padding: 4px 8px;
      font-size: 8.5px;
      font-weight: 800;
    }
    .total-label {
      text-align: left;
    }
    .col-center { text-align: center; }
    .col-num { text-align: right; font-variant-numeric: tabular-nums; }
    .idx-col { color: #64748b; font-weight: 600; }
    .col-name { color: #0f2b4c; font-size: 8.5px; }
    .highlight-num {
      font-weight: 800;
      color: #0b2d5b;
    }
    .highlight-num-total {
      font-size: 10.5px;
      font-weight: 900;
      color: #0b2d5b;
    }

    /* DETAIL BLOCK PAGES */
    .header-container {
      margin-bottom: 10px;
      border-bottom: 2px solid #0f2b4c;
      padding-bottom: 6px;
    }
    .doc-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 6px;
    }
    .doc-project {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: block;
    }
    .doc-main-title {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f2b4c;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-meta-right {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .period-pill {
      font-size: 8.5px;
      background-color: #f1f5f9;
      color: #475569;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      font-weight: 600;
    }
    .block-index-pill {
      font-size: 8.5px;
      background-color: #0f2b4c;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
    }

    .block-banner {
      background: linear-gradient(135deg, #0b2d5b 0%, #17365d 60%, #1e4b82 100%);
      color: #ffffff;
      padding: 7px 12px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(15, 43, 76, 0.12);
    }
    .block-name {
      font-size: 13.5px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .block-badge-group {
      display: flex;
      gap: 8px;
    }
    .badge {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 2.5px 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .badge strong {
      font-size: 11px;
      color: #ffffff;
    }

    .content-grid {
      column-gap: 14px;
      margin-top: 8px;
    }
    .grid-2-col {
      column-count: 2;
    }
    .grid-3-col {
      column-count: 3;
    }

    .region-card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 9px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .region-header {
      background-color: #f1f5f9;
      border-bottom: 1px solid #cbd5e1;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .region-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #0f2b4c;
      text-transform: uppercase;
    }
    .reg-prefix {
      color: #64748b;
      font-weight: 600;
    }
    .region-summary {
      font-size: 8.5px;
      color: #475569;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    .data-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table th {
      padding: 3px 8px;
      font-size: 8px;
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
      padding: 3px 8px;
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
      font-weight: 700;
      color: #0f2b4c;
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body>
  ${coverHtml}
  ${blockPagesHtml}
</body>
</html>
  `;
}

async function main() {
  const inputExcel = process.argv[2] || defaultExcelPath;

  if (!fs.existsSync(inputExcel)) {
    console.error(`Erro: Arquivo Excel não encontrado em: ${inputExcel}`);
    process.exit(1);
  }

  console.log(`Iniciando processamento do Excel: ${inputExcel}`);
  const { blocks, meta } = await loadAndProcessData(inputExcel);

  console.log(`Gerando HTML completo unificado...`);
  const htmlContent = generateCompleteHtml(blocks, meta);

  const previewHtmlPath = path.join(path.dirname(outputPdfPath), 'preview_relatorio.html');
  fs.writeFileSync(previewHtmlPath, htmlContent, 'utf8');
  console.log(`Preview HTML salvo em: ${previewHtmlPath}`);

  console.log(`Iniciando Puppeteer para renderizar PDF consolidado único...`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 8px; color: #7a7a7a; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm 4mm 14mm;">
        <span>Fonte: ${meta.projectTitle} - Usuários Ativos (${meta.period || 'Consolidado'})</span>
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

  await browser.close();

  console.log(`\n========================================`);
  console.log(`PDF CONSOLIDADO GERADO COM SUCESSO!`);
  console.log(`Arquivo salvo em: ${outputPdfPath}`);
  console.log(`========================================\n`);
}

main().catch(err => {
  console.error("Erro durante a execução:", err);
  process.exit(1);
});
