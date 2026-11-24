const fs = require('fs');

let content = fs.readFileSync('services/malaysianMockData.ts', 'utf8');

content = content.replace('AeroMY MicroBlog', 'AeroMY Extra');
content = content.replace('Tourism Malaysia', 'National Tourism Board');
content = content.replace('BFM listeners', 'Business FM listeners');
content = content.replace('Ministry of Transport', 'Department of Transport');

fs.writeFileSync('services/malaysianMockData.ts', content);

