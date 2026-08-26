import fs from 'fs';
import XLSX from 'xlsx';

const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

// Build church -> { block, region } mapping dictionary
const churchToHierarchy = {};
for (const [blockName, blockObj] of Object.entries(extractedMap)) {
  for (const [regionName, churches] of Object.entries(blockObj.regions)) {
    for (const item of churches) {
      const churchKey = item.church.trim().toLowerCase();
      churchToHierarchy[churchKey] = {
        block: blockName,
        region: regionName,
        originalName: item.church
      };
    }
  }
}

console.log(`Total mapped churches in dictionary: ${Object.keys(churchToHierarchy).length}`);

// Now read Excel
const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const excelData = [];
let startReading = false;
let headerInfo = [];

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length === 0) continue;
  
  if (row[0] && String(row[0]).startsWith('#')) {
    headerInfo.push(String(row[0]));
    continue;
  }
  
  if (row[0] === 'igreja' || (row[1] && String(row[1]).includes('Usuários'))) {
    startReading = true;
    continue;
  }
  
  if (startReading) {
    // Check if it's total geral
    if (row[2] === 'Total geral' || row[0] === 'Total geral' || (!row[0] && row[1])) {
      console.log('Found Total Geral row:', row);
      continue;
    }
    
    const churchName = row[0] ? String(row[0]).trim() : '';
    const userCount = Number(row[1]) || 0;
    
    if (churchName) {
      excelData.push({ church: churchName, count: userCount });
    }
  }
}

console.log(`Total churches in Excel: ${excelData.length}`);

const matched = [];
const unmatched = [];

for (const item of excelData) {
  const key = item.church.toLowerCase();
  if (churchToHierarchy[key]) {
    matched.push({ ...item, ...churchToHierarchy[key] });
  } else {
    // Try normalized match (e.g. hyphens, underscores)
    const normKey = key.replace(/[-_ ]/g, '');
    const found = Object.keys(churchToHierarchy).find(k => k.replace(/[-_ ]/g, '') === normKey);
    if (found) {
      matched.push({ ...item, ...churchToHierarchy[found] });
    } else {
      unmatched.push(item);
    }
  }
}

console.log(`Matched: ${matched.length}, Unmatched: ${unmatched.length}`);
if (unmatched.length > 0) {
  console.log('Unmatched items:', unmatched);
}
