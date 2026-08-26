import fs from 'fs';
const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

for (const [block, data] of Object.entries(extractedMap)) {
  console.log(`\n=== BLOCO: ${block} ===`);
  for (const [reg, list] of Object.entries(data.regions)) {
    console.log(`  Região: ${reg} (${list.length} igrejas)`);
  }
}
