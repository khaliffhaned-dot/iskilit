const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(new RegExp(search, 'g'), replace);
    }
    fs.writeFileSync(filePath, content);
}

const replacements = [
    ['AirAsia', 'AeroMY'],
    ['AirAsia\\\'s', 'AeroMY\\\'s'],
    ['airasia', 'aeromy'],
    ['Malaysia Airlines', 'National Airways'],
    ['Batik Air', 'Crest Air'],
    ['Firefly', 'SparkJet'],
    ['Khairy Jamaluddin', 'Kamarul Zaman'],
    ['Ibrahim Sani', 'Imran Shafiq'],
    ['Cedric Loo', 'Caleb Lee'],
    ['Keluar Sekejap', 'Masa Singkat'],
    ['Astro Awani', 'Metro Awani'],
    ['The Star', 'The Daily Spark'],
    ['Malaysiakini', 'Warta Kini'],
    ['Berita Harian', 'Warta Harian'],
    ['Utusan', 'Suara Harian'],
    ['NST', 'The National Chronicle'],
    ['Ask Bo', 'Ask Bot'],
    ['Lowyat\\.net', 'TechForum.my'],
    ['@abg_sarawak', '@borneo_bro'],
    ['@minah_travels', '@cik_travel'],
    ['Santan Nasi Lemak', 'Aero Nasi Lemak'],
    ['Oneway Alliance', 'Global Flight Alliance'],
    ['Wong Shou Ning', 'Wong Su Lin'],
    ['BFM 89\\.9', 'Business FM 99.9'],
    ['The Edge', 'The Business Edge'],
    ['@KLIA2Updates', '@KLIA_Updates']
];

replaceInFile('services/cloudService.ts', replacements);
replaceInFile('services/malaysianMockData.ts', replacements);
replaceInFile('services/aiService.ts', replacements);

console.log('Entities renamed successfully.');
