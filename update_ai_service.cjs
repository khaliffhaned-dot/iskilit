const fs = require('fs');

let content = fs.readFileSync('services/aiService.ts', 'utf8');

// Add all the mock imports
content = content.replace(
    /import \{ mockDashboardData, mockEventIntelligence, mockMediaIntelligence, mockNarrativeForesight, mockCompetitiveAnalysis \} from '\.\/malaysianMockData\.ts';/,
    `import { 
    mockDashboardData, mockEventIntelligence, mockMediaIntelligence, mockNarrativeForesight, mockCompetitiveAnalysis,
    mockInfluencers, mockPitchDraft, mockContentPiece, mockCampaignPlan, mockBrandReputation, mockClientReport,
    mockContentSafety, mockNarrativeSimulation, mockStakeholderReport, mockPolicyReport, mockInterviewBriefing,
    mockAnswerFeedback, mockPredictiveResonance, mockCustomModuleResult
} from './malaysianMockData.ts';`
);

// We need to replace the implementations of the AI functions to just return the mocks.
function mockFunction(functionName, returnStatement) {
    const regex = new RegExp(`export async function ${functionName}\\([^{]*\\)[^{]*\\{[\\s\\S]*?\\n\\}`);
    const match = content.match(regex);
    if (match) {
        // Just return the mock directly inside the function
        const newFunc = match[0].replace(/\{[\s\S]*?\n\}/, `{\n    return new Promise(resolve => setTimeout(() => resolve(${returnStatement}), 800));\n}`);
        content = content.replace(match[0], newFunc);
    }
}

mockFunction('fetchAnalyticsDashboardData', 'mockDashboardData');
mockFunction('generateCompetitiveAnalysis', 'mockCompetitiveAnalysis');
mockFunction('findInfluencers', 'mockInfluencers');
mockFunction('draftPersonalizedPitch', 'mockPitchDraft');
mockFunction('generateContentPiece', 'mockContentPiece');
mockFunction('generateImage', 'null // Images not mocked via AI text');
mockFunction('generateCampaignHubPlan', 'mockCampaignPlan');
mockFunction('generateCampaignContent', 'mockCampaignPlan');
mockFunction('generateBrandReputationReport', 'mockBrandReputation');
mockFunction('generateClientReport', 'mockClientReport');
mockFunction('runContentSafetyAnalysis', 'mockContentSafety');
mockFunction('runNarrativeSimulation', 'mockNarrativeSimulation');
mockFunction('mapStakeholders', 'mockStakeholderReport');
mockFunction('trackPolicies', 'mockPolicyReport');
mockFunction('generateInterviewBriefing', 'mockInterviewBriefing');
mockFunction('analyzeInterviewAnswer', 'mockAnswerFeedback');
mockFunction('getEngagementRecommendations', '{ recommendations: ["Invite them for a media briefing", "Send an exclusive press release", "Engage with their recent social media post"] }');
mockFunction('fetchEventIntelligenceReport', 'mockEventIntelligence');
mockFunction('testPredictiveResonance', 'mockPredictiveResonance');
mockFunction('generateNarrativeForesightReport', 'mockNarrativeForesight');
mockFunction('fetchIntelligenceFeed', `[
    { source: "The Star", author: "News Desk", content: "AirAsia announces Raya fixed fares.", url: "#", timestamp: new Date().toISOString(), reach: 150000, sentiment: "Positive" },
    { source: "X (Twitter)", author: "@travel_junkie", content: "Wow, Batik Air is having a massive sale! Time to book my flight.", url: "#", timestamp: new Date().toISOString(), reach: 5000, sentiment: "Positive" }
]`);
mockFunction('fetchMediaAndSocialIntelligence', 'mockMediaIntelligence');
mockFunction('runCustomModule', 'mockCustomModuleResult');

fs.writeFileSync('services/aiService.ts', content);
console.log("Updated aiService.ts");
