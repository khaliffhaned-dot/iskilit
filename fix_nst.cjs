const fs = require('fs');

let content = fs.readFileSync('services/aiService.ts', 'utf8');
content = content.replace(/ANTI_HIJACK_IThe National ChronicleRUCTION/g, 'ANTI_HIJACK_INSTRUCTION');
fs.writeFileSync('services/aiService.ts', content);

console.log('Fixed NST replacement error');
