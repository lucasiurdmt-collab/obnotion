import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\UNIDADES_RELATORIO_SEMANAL_ATUALIZADO_MAIO_A_JULHO_2026_CORRIGIDO.xlsx';
const workbook = XLSX.readFile(filePath);

console.log('All Sheet Names:', workbook.SheetNames);

for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\nSheet [${name}]: ${rows.length} rows`);
  
  // Find non-empty units in this sheet
  const units = new Set();
  for (const r of rows) {
    if (!r) continue;
    for (let c = 0; c < r.length; c++) {
      const val = String(r[c] || '').trim();
      if (val.startsWith('CENTRO SOCIO') || val.startsWith('UNIDADE') || val.startsWith('SEMILIBERDADE') || val.startsWith('CEIP') || val.startsWith('CIA') || val.startsWith('CSE') || val.startsWith('DOM BOSCO') || val.startsWith('HORTO') || val.startsWith('SAO JERONIMO') || val.startsWith('SÃO JERÔNIMO')) {
        units.add(val);
      }
    }
  }
  if (units.size > 0) {
    console.log('  Units found:', Array.from(units));
  }
}
