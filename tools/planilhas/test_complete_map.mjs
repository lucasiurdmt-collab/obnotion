import fs from 'fs';
import XLSX from 'xlsx';

// Load base hierarchy
const baseHierarchy = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

// Specific alias mapping for clean matching
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

// Build church -> location index from base hierarchy
const churchIndex = {};
for (const [blockName, blockObj] of Object.entries(baseHierarchy)) {
  for (const [regionName, churches] of Object.entries(blockObj.regions)) {
    for (const item of churches) {
      const key = item.church.toLowerCase().trim();
      churchIndex[key] = { block: blockName, region: regionName, name: item.church };
      // Also index stripped version
      const stripped = key.replace(/[-_ ]/g, '');
      if (!churchIndex[stripped]) {
        churchIndex[stripped] = { block: blockName, region: regionName, name: item.church };
      }
    }
  }
}

// Read Excel
const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let startReading = false;
const processedBlocks = {};

// Initialize structure from base hierarchy
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

// Add special groups if needed
if (!processedBlocks['GRUPOS SANTUÁRIO'].regions['FTU']) {
  processedBlocks['GRUPOS SANTUÁRIO'].regions['FTU'] = [];
}
if (!processedBlocks['GRUPOS SANTUÁRIO'].regions['SOCIOEDUCATIVO']) {
  processedBlocks['GRUPOS SANTUÁRIO'].regions['SOCIOEDUCATIVO'] = [];
}

const semCorrespondencia = [];
let totalRows = 0;
let totalUsersCounted = 0;

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length === 0) continue;
  if (row[0] === 'igreja' || (row[1] && String(row[1]).includes('Usuários'))) {
    startReading = true;
    continue;
  }
  if (startReading) {
    if (row[2] === 'Total geral' || row[0] === 'Total geral' || (!row[0] && row[1])) {
      continue;
    }
    const rawName = row[0] ? String(row[0]).trim() : '';
    const count = Number(row[1]) || 0;
    if (!rawName) continue;

    totalRows++;
    totalUsersCounted += count;

    // Clean name
    let cleanKey = rawName.toLowerCase().trim();
    if (cleanKey.includes('http')) {
      cleanKey = cleanKey.split('http')[0].trim().replace(/[^a-z0-9_]/g, '');
    }
    cleanKey = cleanKey.replace(/\*+/g, '').replace(/👌.*/g, '').trim();

    // Check alias first
    let loc = churchAliases[cleanKey] || churchIndex[cleanKey] || churchIndex[cleanKey.replace(/[-_ ]/g, '')];

    if (loc && loc.block !== 'SEM_CORRESPONDENCIA') {
      if (!processedBlocks[loc.block]) {
        processedBlocks[loc.block] = { name: loc.block, regions: {} };
      }
      if (!processedBlocks[loc.block].regions[loc.region]) {
        processedBlocks[loc.block].regions[loc.region] = [];
      }
      // Check if already in region (e.g. duplicate rows)
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

console.log(`Total Excel rows processed: ${totalRows}`);
console.log(`Total Users across all rows: ${totalUsersCounted}`);
console.log(`SEM_CORRESPONDENCIA count: ${semCorrespondencia.length}`);
console.log(semCorrespondencia);

for (const [b, obj] of Object.entries(processedBlocks)) {
  let uSum = 0;
  let cCount = 0;
  for (const list of Object.values(obj.regions)) {
    cCount += list.length;
    uSum += list.reduce((s, c) => s + c.count, 0);
  }
  console.log(`Bloco ${b}: ${Object.keys(obj.regions).length} regiões, ${cCount} igrejas, ${uSum} usuários`);
}
