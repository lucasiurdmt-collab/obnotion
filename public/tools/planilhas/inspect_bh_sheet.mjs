import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\UNIDADES_RELATORIO_SEMANAL_ATUALIZADO_MAIO_A_JULHO_2026_CORRIGIDO.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['BELO HORIZONTE'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

for (let r = 0; r < Math.min(rows.length, 30); r++) {
  if (rows[r] && rows[r].length > 0) {
    console.log(`\nRow ${r}:`);
    rows[r].forEach((val, c) => {
      if (val !== undefined && val !== null && val !== '') {
        console.log(`  Col ${c}: ${JSON.stringify(val)}`);
      }
    });
  }
}
