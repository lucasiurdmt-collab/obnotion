import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let startReading = false;
const counts = {};

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
      if (!counts[rawName]) counts[rawName] = [];
      counts[rawName].push({ row: r + 1, count });
    }
  }
}

for (const [k, list] of Object.entries(counts)) {
  if (list.length > 1) {
    console.log(`Duplicate row in Excel for "${k}":`, list);
  }
}
