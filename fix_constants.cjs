const fs = require('fs');

let content = fs.readFileSync('constants.tsx', 'utf8');

const simulatorItem = `
             { name: 'Interactive Crisis Simulator', icon: <SimulatorIcon />, description: 'Branching crisis scenarios.' },`;

if (!content.includes("'Interactive Crisis Simulator'")) {
    content = content.replace(" { name: 'Narrative Simulator', icon: <SimulatorIcon />, description: 'War-game scenarios to anticipate outcomes.' },", " { name: 'Narrative Simulator', icon: <SimulatorIcon />, description: 'War-game scenarios to anticipate outcomes.' }," + simulatorItem);
}

fs.writeFileSync('constants.tsx', content);
