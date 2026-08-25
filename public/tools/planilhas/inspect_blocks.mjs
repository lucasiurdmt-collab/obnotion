import fs from 'fs';
const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

console.log("Blocks in extracted_data.json:", Object.keys(extractedMap));
for (const [k, v] of Object.entries(extractedMap)) {
  console.log(`Block ${k}: ${Object.keys(v.regions).length} regions`);
}
