import XLSX from 'xlsx';

const filePath = 'C:\\Users\\wmsli\\Downloads\\UNIDADES_RELATORIO_SEMANAL_ATUALIZADO_MAIO_A_JULHO_2026_CORRIGIDO.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = 'BELO HORIZONTE';
const sheet = workbook.Sheets[sheetName];

// Convert sheet to array of rows (header: 1)
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log(`Original rows in ${sheetName}: ${rows.length}`);

// Sample new record
const newRecord = {
  unidade: 'DOM BOSCO',
  dataHora: 'SEG - 06/07/2026 20H',
  quemFez: 'João e Sr celson',
  voluntarios: 2,
  adolescentes: 44,
  agentes: 9,
  atividade: 'oração e palavra',
  folhaUniversal: 0,
  bibliaRevista: '1 biblia',
  alimentos: 0,
  atendimentos: '',
  cidadeObs: 'BH'
};

// Create empty array of length at least 20
const newRow = new Array(20).fill('');
newRow[1] = newRecord.unidade;
newRow[3] = newRecord.dataHora;
newRow[6] = newRecord.quemFez;
newRow[8] = newRecord.voluntarios;
newRow[10] = newRecord.adolescentes;
newRow[13] = newRecord.agentes;
newRow[14] = newRecord.atividade;
newRow[15] = newRecord.folhaUniversal;
newRow[16] = newRecord.bibliaRevista;
newRow[17] = newRecord.alimentos;
newRow[18] = newRecord.atendimentos;
newRow[19] = newRecord.cidadeObs;

rows.push(newRow);

const newSheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newSheet;

XLSX.writeFile(workbook, 'test_output.xlsx');
console.log('Saved test_output.xlsx successfully!');
