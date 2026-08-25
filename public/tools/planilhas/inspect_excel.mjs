import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\novo arquivo para editar.xlsx';
const workbook = XLSX.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`Total rows: ${jsonData.length}`);
  console.log('First 15 rows:');
  console.log(JSON.stringify(jsonData.slice(0, 15), null, 2));
}
