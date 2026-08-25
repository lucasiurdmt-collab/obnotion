import fs from 'fs';
import XLSX from 'xlsx';

const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

// Read Excel
const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let startReading = false;
const excelMap = {};
let totalGeralExcel = 0;

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length === 0) continue;
  if (row[0] === 'igreja' || (row[1] && String(row[1]).includes('Usuários'))) {
    startReading = true;
    continue;
  }
  if (startReading) {
    if (row[2] === 'Total geral' || row[0] === 'Total geral' || (!row[0] && row[1])) {
      totalGeralExcel = Number(row[1]) || 0;
      continue;
    }
    const rawName = row[0] ? String(row[0]).trim() : '';
    const count = Number(row[1]) || 0;
    if (rawName) {
      let cleanKey = rawName.toLowerCase().trim();
      if (cleanKey.includes('http')) {
        cleanKey = cleanKey.split('http')[0].trim().replace(/[^a-z0-9_]/g, '');
      }
      cleanKey = cleanKey.replace(/\*+/g, '').replace(/👌.*/g, '').trim();
      excelMap[cleanKey] = { rawName, count };
    }
  }
}

console.log(`Total Excel keys: ${Object.keys(excelMap).length}, Total Geral in Excel: ${totalGeralExcel}`);

// Now create the new structured blocks data
const newBlocksData = {};
const usedExcelKeys = new Set();

for (const [blockName, blockObj] of Object.entries(extractedMap)) {
  if (blockName === 'SEM_CORRESPONDENCIA') continue;
  newBlocksData[blockName] = {
    name: blockObj.name,
    regions: {}
  };

  for (const [regionName, churches] of Object.entries(blockObj.regions)) {
    newBlocksData[blockName].regions[regionName] = [];
    
    for (const item of churches) {
      const churchName = item.church;
      const key = churchName.trim().toLowerCase();
      let count = 0;
      
      if (excelMap[key]) {
        count = excelMap[key].count;
        usedExcelKeys.add(key);
      } else {
        // Try normalized match
        const normKey = key.replace(/[-_ ]/g, '');
        const matchedKey = Object.keys(excelMap).find(k => k.replace(/[-_ ]/g, '') === normKey);
        if (matchedKey) {
          count = excelMap[matchedKey].count;
          usedExcelKeys.add(matchedKey);
        }
      }
      
      newBlocksData[blockName].regions[regionName].push({
        church: churchName,
        count: count
      });
    }
  }
}

// Check unused Excel keys (these go to SEM_CORRESPONDENCIA or special groups)
const unmapped = [];
for (const [key, item] of Object.entries(excelMap)) {
  if (!usedExcelKeys.has(key)) {
    // Check specific known mappings
    if (key === 'sede_teofilo_otoni' || key === 'teofilo_otoni') {
      // handled?
    }
    unmapped.push({ church: item.rawName, count: item.count, key });
  }
}

console.log(`Unused/Unmapped Excel keys: ${unmapped.length}`);
console.log(unmapped);

// Add SEM_CORRESPONDENCIA
newBlocksData['SEM_CORRESPONDENCIA'] = {
  name: 'REGISTROS SEM CORRESPONDÊNCIA',
  regions: {
    'REGISTROS SEM CORRESPONDÊNCIA': unmapped.map(u => ({ church: u.church, count: u.count }))
  }
};

let sumAllUsers = 0;
for (const b of Object.values(newBlocksData)) {
  for (const r of Object.values(b.regions)) {
    sumAllUsers += r.reduce((s, c) => s + c.count, 0);
  }
}
console.log(`Sum of all users mapped + unmapped: ${sumAllUsers} (Excel Total Geral: ${totalGeralExcel})`);
