import fs from 'fs';
const extractedMap = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));
console.log("GRUPOS SANTUÁRIO:", JSON.stringify(extractedMap["GRUPOS SANTUÁRIO"], null, 2));
console.log("SEM_CORRESPONDENCIA:", JSON.stringify(extractedMap["SEM_CORRESPONDENCIA"], null, 2));
