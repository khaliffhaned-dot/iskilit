const fs = require('fs');

let content = fs.readFileSync('types.ts', 'utf8');
content = content.replace(/export type Page =[\s\S]*?;/, (match) => {
    return match.replace(";", "\n  | 'Interactive Crisis Simulator';");
});

fs.writeFileSync('types.ts', content);
