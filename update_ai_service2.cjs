const fs = require('fs');
let content = fs.readFileSync('services/aiService.ts', 'utf8');

function injectMock(functionName, returnStatement) {
    const regex = new RegExp(`(export async function ${functionName}\\([^)]+\\)[^{]*\\{\\s*)`);
    content = content.replace(regex, `$1\n    return new Promise(resolve => setTimeout(() => resolve(${returnStatement}), 800));\n`);
}

injectMock('fetchAnalyticsDashboardData', 'mockDashboardData');
injectMock('generateCompetitiveAnalysis', 'mockCompetitiveAnalysis');
injectMock('findInfluencers', 'mockInfluencers');
injectMock('draftPersonalizedPitch', 'mockPitchDraft');
injectMock('generateContentPiece', 'mockContentPiece');
injectMock('generateImage', 'null // mock not needed here');
injectMock('generateCampaignHubPlan', 'mockCampaignPlan');
injectMock('generateCampaignContent', 'mockCampaignPlan');
injectMock('generateBrandReputationReport', 'mockBrandReputation');
injectMock('generateClientReport', 'mockClientReport');
injectMock('runContentSafetyAnalysis', 'mockContentSafety');
injectMock('runNarrativeSimulation', 'mockNarrativeSimulation');
injectMock('mapStakeholders', 'mockStakeholderReport');
injectMock('trackPolicies', 'mockPolicyReport');
injectMock('generateInterviewBriefing', 'mockInterviewBriefing');
injectMock('analyzeInterviewAnswer', 'mockAnswerFeedback');
injectMock('getEngagementRecommendations', '{ recommendations: ["Invite them for a media briefing", "Send an exclusive press release", "Engage with their recent social media post"] }');
injectMock('fetchEventIntelligenceReport', 'mockEventIntelligence');
injectMock('testPredictiveResonance', 'mockPredictiveResonance');
injectMock('generateNarrativeForesightReport', 'mockNarrativeForesight');
injectMock('fetchIntelligenceFeed', `[
    { source: "The Star", author: "News Desk", content: "AirAsia announces Raya fixed fares.", url: "#", timestamp: new Date().toISOString(), reach: 150000, sentiment: "Positive" },
    { source: "X (Twitter)", author: "@travel_junkie", content: "Wow, Batik Air is having a massive sale! Time to book my flight.", url: "#", timestamp: new Date().toISOString(), reach: 5000, sentiment: "Positive" }
]`);
injectMock('fetchMediaAndSocialIntelligence', 'mockMediaIntelligence');
injectMock('runCustomModule', 'mockCustomModuleResult');

fs.writeFileSync('services/aiService.ts', content);
console.log("Updated aiService.ts with prepended returns");
