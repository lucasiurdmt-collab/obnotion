import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\UNIDADES_RELATORIO_SEMANAL_ATUALIZADO_MAIO_A_JULHO_2026_CORRIGIDO.xlsx';
const workbook = XLSX.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  console.log(`\n========================================`);
  console.log(`SHEET: ${sheetName}`);
  console.log(`========================================`);
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`Total rows: ${rows.length}`);
  for (let i = 0; i < Math.min(rows.length, 25); i++) {
    if (rows[i] && rows[i].length > 0) {
      console.log(`Row ${i}:`, rows[i]);
    }
  }
}
