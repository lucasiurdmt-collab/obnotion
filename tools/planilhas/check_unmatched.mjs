import fs from 'fs';
import XLSX from 'xlsx';

const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

// Build a list of all existing church keys and their location
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

// Also let's check all churches in extractedMap to see similar names
const allExistingChurches = Object.keys(churchToHierarchy);

const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let startReading = false;
const excelItems = [];

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length === 0) continue;
  if (row[0] === 'igreja' || (row[1] && String(row[1]).includes('Usuários'))) {
    startReading = true;
    continue;
  }
  if (startReading) {
    if (row[2] === 'Total geral' || row[0] === 'Total geral' || (!row[0] && row[1])) continue;
    const churchName = row[0] ? String(row[0]).trim() : '';
    const userCount = Number(row[1]) || 0;
    if (churchName) {
      excelItems.push({ rawChurch: row[0], church: churchName, count: userCount });
    }
  }
}

console.log("Total items from Excel:", excelItems.length);

const unmatched = [];
for (const item of excelItems) {
  let cleanName = item.church.toLowerCase().trim();
  
  // Clean url attachments or special characters
  if (cleanName.includes('http')) {
    cleanName = cleanName.split('http')[0].trim().replace(/[^a-z0-9_]/g, '');
  }
  cleanName = cleanName.replace(/\*+/g, '').replace(/👌.*/g, '').trim();

  let matched = churchToHierarchy[cleanName];
  if (!matched) {
    // Try without underscores/hyphens
    const norm = cleanName.replace(/[-_ ]/g, '');
    const found = allExistingChurches.find(k => k.replace(/[-_ ]/g, '') === norm);
    if (found) {
      matched = churchToHierarchy[found];
    }
  }

  if (matched) {
    // mapped!
  } else {
    // look for close matches
    const closeMatches = allExistingChurches.filter(k => k.includes(cleanName) || cleanName.includes(k));
    unmatched.push({ raw: item.rawChurch, cleanName, count: item.count, closeMatches });
  }
}

console.log(`Unmatched count: ${unmatched.length}`);
console.log(JSON.stringify(unmatched, null, 2));
