import fs from 'fs';
const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

const churchOccurrences = {};
for (const [blockName, blockObj] of Object.entries(extractedMap)) {
  for (const [regionName, churches] of Object.entries(blockObj.regions)) {
    for (const item of churches) {
      const k = item.church.toLowerCase().trim();
      if (!churchOccurrences[k]) churchOccurrences[k] = [];
      churchOccurrences[k].push({ block: blockName, region: regionName, count: item.count });
    }
  }
}

for (const [k, list] of Object.entries(churchOccurrences)) {
  if (list.length > 1) {
    console.log(`Duplicate church "${k}" found in:`, list);
  }
}
