const fs = require('fs');

let content = fs.readFileSync('services/malaysianMockData.ts', 'utf8');

const newRisks = `export const mockContentRisks: any[] = [
  {
    id: "risk-001",
    timestamp: "2026-07-10T14:30:00Z",
    platform: "MicroBlog",
    threatLevel: "Critical",
    vector: "Coordinated Bot Activity",
    snippet: "300+ newly created accounts amplifying false reports of AeroMY engine failure during Tengkujuh storm over East Coast. Hashtag #BoikotAeroMY trending synthetically.",
    actionTaken: "Under Review",
    aiRecommendation: "Immediately publish timestamped maintenance logs on the corporate portal. Deploy PR 'Truth Squad' asset to authoritative local media (e.g., Metro Awani) to control the narrative."
  },
  {
    id: "risk-002",
    timestamp: "2026-07-10T11:45:00Z",
    platform: "VidStream",
    threatLevel: "Elevated",
    vector: "3R Violation",
    snippet: "Viral user-generated video falsely claiming the new in-flight menu overhaul systematically excludes local Bumiputera SME vendors in favor of foreign conglomerates.",
    actionTaken: "Quarantined",
    aiRecommendation: "Do not engage the creator. Draft a pre-emptive holding statement detailing the stringent, merit-based local procurement policies and highlight current local SME partnerships."
  },
  {
    id: "risk-003",
    timestamp: "2026-07-09T20:15:00Z",
    platform: "Internal",
    threatLevel: "Critical",
    vector: "Deepfake/Manipulated Media",
    snippet: "Circulating WhatsApp audio clip purportedly featuring the CEO discussing unannounced, massive operational restructuring and layoffs ahead of the Q3 financial briefing.",
    actionTaken: "Takedown Requested",
    aiRecommendation: "Activate the crisis communications matrix. Issue an internal memo to all staff immediately debunking the audio. Prepare a firm denial for mainstream financial press if the leak breaches public domains."
  }
];`;

const newRegs = `export const mockRegulatoryShifts: any[] = [
  {
    id: "reg-001",
    policyName: "Mandatory Price Ceilings for Festive Seasons",
    governingBody: "Department of Transport (DOT)",
    status: "Active Debate",
    impactScore: 8,
    primaryRisk: "Revenue Loss",
    summary: "Proposed bill to cap all domestic flight prices during Hari Raya, CNY, and Gawai to protect consumers from dynamic pricing surges.",
    mitigationStrategy: "Proactively pitch the 'Tambang Tetap Raya' initiative as an industry-led, self-regulated alternative to strict government mandates, preserving commercial flexibility."
  },
  {
    id: "reg-002",
    policyName: "Aviation Carbon Levy & ESG Mandate",
    governingBody: "National Aviation Authority (NAA) & Ministry of Environment",
    status: "Drafting Phase",
    impactScore: 7,
    primaryRisk: "Operational Bottleneck",
    summary: "Early discussions on introducing a per-passenger carbon tax and stringent, mandatory environmental waste management reporting for all domestic routes by 2027.",
    mitigationStrategy: "Activate Key Opinion Leaders in environmental NGOs. Pre-emptively publish an executive summary of AeroMY’s fleet modernization, fuel-efficiency metrics, and current green infrastructure investments."
  },
  {
    id: "reg-003",
    policyName: "Revised Foreign Ownership Limits in Aviation Services",
    governingBody: "Ministry of Economy",
    status: "Rumored",
    impactScore: 4,
    primaryRisk: "Reputational Damage",
    summary: "Market speculation regarding a potential tightening of foreign equity caps in critical aviation support and ground-handling services.",
    mitigationStrategy: "Monitor financial press closely. Ensure corporate fact sheets emphasizing the company's strong local incorporation and domestic talent development programs are updated and accessible."
  }
];`;

content = content.replace(/export const mockContentRisks: any\[\] = \[[\s\S]*?\];/g, newRisks);
content = content.replace(/export const mockRegulatoryShifts: any\[\] = \[[\s\S]*?\];/g, newRegs);

fs.writeFileSync('services/malaysianMockData.ts', content);
