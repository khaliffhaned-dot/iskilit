const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

if (!content.includes("import CrisisSimulator")) {
    content = content.replace("import NarrativeForesight", "import CrisisSimulator from './contexts/pages/CrisisSimulator.tsx';\nimport NarrativeForesight");
}

if (!content.includes("case 'Interactive Crisis Simulator':")) {
    content = content.replace("case 'Narrative Foresight': return <NarrativeForesight activeWorkspace={activeWorkspace} currentUser={currentUser} />;", "case 'Narrative Foresight': return <NarrativeForesight activeWorkspace={activeWorkspace} currentUser={currentUser} />;\n      case 'Interactive Crisis Simulator': return <CrisisSimulator activeWorkspace={activeWorkspace} currentUser={currentUser} />;");
}

fs.writeFileSync('App.tsx', content);
