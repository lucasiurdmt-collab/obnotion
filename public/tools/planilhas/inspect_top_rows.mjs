import XLSX from 'xlsx';
const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
for (let i = 0; i < 20; i++) {
  console.log(`Row ${i}:`, rows[i]);
}
