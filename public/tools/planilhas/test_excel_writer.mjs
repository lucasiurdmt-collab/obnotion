import XLSX from 'xlsx';
import fs from 'fs';

// Unit to Sheet mapping
const unitToSheet = {
  'dom bosco': 'BELO HORIZONTE',
  'horto': 'BELO HORIZONTE',
  'sao jeronimo': 'BELO HORIZONTE',
  'são jerônimo': 'BELO HORIZONTE',
  'santa helena': 'BELO HORIZONTE',
  'cia': 'BELO HORIZONTE',
  'santa clara': 'BELO HORIZONTE',
  'sao benedito': 'BELO HORIZONTE',
  'justinopolis': 'VENDA NOVA',
  'dom pedro': 'VENDA NOVA',
  'ceip': 'SETE LAGOAS ',
  'cse': 'SETE LAGOAS ',
  'sete lagoas': 'SETE LAGOAS ',
  'montes claros': 'MONTES CLAROS',
  'pirapora': 'MONTES CLAROS',
  'uberaba': 'UBERABA',
  'santa luzia': 'JUIZ DE FORA',
  'juiz de fora': 'JUIZ DE FORA',
  'uberlandia': 'UBERLANDIA',
  'unai': 'UBERLANDIA',
  'semiliberdade uberlandia': 'UBERLANDIA',
  'governador valadares': 'GOVERNADOR VALADARES',
  'ipatinga': 'GOVERNADOR VALADARES',
  'eldorado': 'ELDORADO',
  'teofilo otoni': 'TEOFILO OTONI'
};

const filePath = 'C:\\Users\\wmsli\\Downloads\\UNIDADES_RELATORIO_SEMANAL_ATUALIZADO_MAIO_A_JULHO_2026_CORRIGIDO.xlsx';
const workbook = XLSX.readFile(filePath);

console.log('Workbook sheets available:', workbook.SheetNames);
