const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(new RegExp(search, 'g'), replace);
    }
    fs.writeFileSync(filePath, content);
}

const replacements = [
    ['MADANI', 'WAWASAN'],
    ['MAVCOM', 'National Aviation Authority (NAA)'],
    ['FOMCA', 'National Consumer Group (NCG)'],
    ['Ministry of Transport \\(MOT\\)', 'Department of Transport (DOT)'],
    ['Ministry of Finance', 'Department of Finance'],
    ['MetMalaysia', 'National Weather Bureau'],
    ['KLIA2', 'Terminal 2'],
    ['KLIA', 'Terminal 1'],
    ['TikTok', 'VidStream'],
    ['X \\(Twitter\\)', 'MicroBlog'],
    ['Instagram', 'PhotoShare'],
    ['Facebook', 'SocialConnect'],
    ['YouTube', 'VidHub'],
    ['X\\b(?!M)', 'MicroBlog'], // Replace X if it's standalone, careful not to break XML or similar. Actually better to just replace the specific ones: '"X"' -> '"MicroBlog"', 'on X' -> 'on MicroBlog'
    ['"X"', '"MicroBlog"'],
    ['on X ', 'on MicroBlog '],
    ['@KLIA_Updates', '@Terminal2_Updates'],
    ['Aero Nasi Lemak', 'Signature Nasi Lemak']
];

replaceInFile('services/malaysianMockData.ts', replacements);
replaceInFile('services/cloudService.ts', replacements);

console.log('Second round of entities renamed successfully.');
