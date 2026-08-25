import fs from 'fs';
import XLSX from 'xlsx';

const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));
const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let startReading = false;
const excelMap = {};
let sumRawExcel = 0;

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
    if (rawName) {
      let cleanKey = rawName.toLowerCase().trim();
      if (cleanKey.includes('http')) {
        cleanKey = cleanKey.split('http')[0].trim().replace(/[^a-z0-9_]/g, '');
      }
      cleanKey = cleanKey.replace(/\*+/g, '').replace(/👌.*/g, '').trim();
      excelMap[cleanKey] = { rawName, count };
      sumRawExcel += count;
    }
  }
}

console.log(`Sum of raw Excel rows: ${sumRawExcel}`);

const matchedChurchToExcel = {};
for (const [blockName, blockObj] of Object.entries(extractedMap)) {
  if (blockName === 'SEM_CORRESPONDENCIA') continue;
  for (const [regionName, churches] of Object.entries(blockObj.regions)) {
    for (const item of churches) {
      const churchName = item.church;
      const key = churchName.trim().toLowerCase();
      
      let matchedKey = null;
      if (excelMap[key]) {
        matchedKey = key;
      } else {
        const normKey = key.replace(/[-_ ]/g, '');
        matchedKey = Object.keys(excelMap).find(k => k.replace(/[-_ ]/g, '') === normKey);
      }
      
      if (matchedKey) {
        if (!matchedChurchToExcel[matchedKey]) matchedChurchToExcel[matchedKey] = [];
        matchedChurchToExcel[matchedKey].push({ churchName, blockName, regionName });
      }
    }
  }
}

for (const [k, list] of Object.entries(matchedChurchToExcel)) {
  if (list.length > 1) {
    console.log(`Excel key "${k}" matched multiple extracted churches:`, list);
  }
}
