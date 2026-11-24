import * as React from 'react';

export type Page =
  | 'Dashboard'
  | 'Competitive Analysis'
  | 'Brand Reputation'
  | 'Influencer & Media Discovery'
  | 'Content Studio'
  | 'Campaign Planner'
  | 'Client Reporting'
  | 'Narrative Simulator'
  | 'Strategic Media Relations'
  | 'Content Safety & Integrity'
  | 'Stakeholder Mapping'
  | 'Regulatory Radar'
  | 'Settings'
  | 'Event Intelligence'
  | 'Narrative Foresight'
  | 'Interactive Crisis Simulator'
  | 'AI Search Visibility'
  | 'FactCheckCenter';

export interface NavItem {
    name: Page | string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    description?: string;
    displayName?: string;
}

export interface NavSegment {
    title: string;
    items: NavItem[];
}

export interface ActivePage {
  page: Page | string;
  payload?: any;
}

export type AIEngine = 'Gemini 2.5 Flash' | 'Gemini 2.5 Pro';

// --- User & Workspace ---
export type UserRole = 'Admin' | 'Member';

export interface UserPersona {
    style: string;
    priorities: string;
    aiEngine: AIEngine;
}

export interface BrandingSettings {
    logoUrl: string | null;
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  companyName: string | null;
  persona: UserPersona;
  branding: BrandingSettings;
  // Workspace info is now managed by the cloud service, not stored directly on the user object.
}

export interface WorkspaceMember {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface Workspace {
    id:string;
    name: string;
    brandName: string;
    competitors: string[];
    ownerId: string;
    mediaContacts?: MediaContact[];
    members?: WorkspaceMember[];
    trackedKeywords?: string[];
    priorityOutlets?: string[];
    trackedHandles?: string[];
}

// --- Core Feature Types ---

export interface BriefingItem {
    title: string;
    content: string;
    sourceName?: string;
    sourceUrl?: string;
}

export interface BrandPerceptionDataPoint {
    attribute: string;
    [key: string]: string | number;
}

export interface ProactiveAction {
    title: string;
    recommendation: string;
    suggestedPage: Page;
}

export interface AnalyticsDashboardData {
    dailyBriefing: {
        marketPulse: BriefingItem;
        topMention: BriefingItem;
        strategicOpportunity: BriefingItem;
    };
    brandPerception: BrandPerceptionDataPoint[];
    proactiveActions: ProactiveAction[];
    predictiveEvents?: PredictiveEvent[];
    stakeholders?: Stakeholder[];
    contentRisks?: ContentRiskAlert[];
    timestamp: string;
}

export interface Influencer {
    id: string;
    name: string;
    type: 'Social Media Creator' | 'Journalist' | 'Industry Analyst' | 'Media Personality';
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'X (Twitter)' | 'Blog' | 'News Outlet';
    followers: string;
    engagementRate: string;
    niche: string;
    bio: string;
    samplePosts?: {title: string, url: string}[];
    email?: string;
}

export interface ContentPiece {
  title: string;
  body: string;
  hashtags?: string[];
}

export interface GeneratedImage {
    base64: string;
    prompt: string;
}

export interface ShareDataPoint {
    name: string;
    value: number;
}

export interface BrandAnalysis {
    brandName: string;
    positioning: string;
    keyThemes: string[];
}

export interface CompetitiveAnalysisReport {
    summary: string;
    shareOfVoice: ShareDataPoint[];
    narrativeDominance: ShareDataPoint[];
    brandAnalyses: BrandAnalysis[];
}

export interface CampaignCalendarItem {
    day: number;
    platform: string;
    title: string;
    description: string;
    draftContent?: string;
}

export interface CampaignHubReport {
    plan: {
        strategy: {
            title: string;
            targetAudience: string;
            coreMessage: string;
        };
        contentCalendar: CampaignCalendarItem[];
        performanceReport: {
            metrics: { kpi: string; value: string; change: number }[];
            engagementProjection: { day: string; engagement: number }[];
        };
    };
}

export interface ReputationMetric {
    name: string;
    value: string;
    explanation: string;
}

export interface ReputationKeyFinding {
    type: 'Positive' | 'Negative' | 'Opportunity';
    description: string;
    source: string;
    impact: 'High' | 'Medium' | 'Low';
}

export interface BrandReputationReport {
    id: string;
    brandName: string;
    summary: string;
    reputationScore: number;
    sentimentTrend: { day: string; score: number }[];
    metrics: ReputationMetric[];
    keyFindings: ReputationKeyFinding[];
    strategicRecommendations: string[];
    timestamp: string;
}

export interface ClientReportData {
    id: string;
    executiveSummary: string;
    keyMetrics: { name: string; value: string; change: string }[];
    mediaMentions: { headline: string; summary: string; outlet: string; timestamp: string; url: string }[];
}

export type InteractionType = 'Pitch' | 'Email' | 'Call' | 'Meeting' | 'Coverage';

export interface InteractionLog {
    id: string;
    date: string; // ISO string
    type: InteractionType;
    notes: string;
}

export interface MediaContact extends Influencer {
    relationshipScore: number;
    status: string;
    lastContacted: string; // ISO string
    interactionHistory: InteractionLog[];
}

export interface GroundedNews {
    uri: string;
    title: string;
}

export interface ContentSafetyReport {
    disinformation: {
        isDisinformation: boolean;
        confidence: number;
        explanation: string;
        verifiedSources: GroundedNews[];
    };
    safety: {
        isSafe: boolean;
        violations: string[];
    };
    biasAndTone?: {
        politicalBias: 'Left' | 'Center' | 'Right' | 'None' | 'Mixed';
        emotionalTone: string;
        riskScore: number;
    };
    deepfakeAnalysis?: {
        isManipulated: boolean;
        confidence: number;
        artifactsFound: string[];
    };
}

export interface NarrativeSimulationReport {
    scenario: string;
    summary: string;
    likelyMediaAngles: { angle: string; outletType: string }[];
    potentialJournalistQuestions: string[];
    simulatedSocialMediaFeed: {
        platform: string;
        author: string;
        content: string;
        sentiment: 'Positive' | 'Negative' | 'Neutral';
    }[];
    simulatedVisualConcepts: {
        imagePrompts: string[];
        videoScripts: string[];
    };
    strategicRecommendations: string[];
    timestamp: string;
}

export interface Stakeholder {
    name: string;
    category: 'Government' | 'Media' | 'Industry Body' | 'Community Group' | 'Investor' | 'Internal' | 'Other';
    influence: 'High' | 'Medium' | 'Low';
    stance: 'Supportive' | 'Neutral' | 'Opposed';
    interests: string[];
    engagementStrategy: string;
    predictedActions?: string[];
    sentimentTrend?: 'Improving' | 'Stable' | 'Declining';
}

export interface StakeholderReport {
    summary: string;
    stakeholders: Stakeholder[];
}

export interface PolicyItem {
    title: string;
    ministry: string;
    status: string;
    summary: string;
    potentialImpact: string;
    sourceUrl: string;
    riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
    timeline?: string;
}

export interface PolicyReport {
    policies: PolicyItem[];
}

export interface InterviewBriefing {
    topic: string;
    outlet: string;
    likelyQuestions: { question: string; context: string }[];
    keyTalkingPoints: string[];
    interviewerPersona: { name: string; style: string; potentialAgenda: string; };
}

export interface AnswerFeedback {
    question: string;
    transcript: string;
    feedback: { overall: string; };
    score: number;
    followUpQuestion: string | null;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: number;
    page?: Page;
}

export interface DashboardSettings {
    visibleWidgets: string[];
}

export interface MonitoredEventUpdate {
    timestamp: string;
    description: string;
}

export interface MonitoredEvent {
    title: string;
    date: string;
    location: string;
    summary: string;
    relevanceScore: number;
    updates: MonitoredEventUpdate[];
    sources: GroundedNews[];
}

export interface EventIntelligenceReport {
    events: MonitoredEvent[];
}

export interface PredictiveResonanceReport {
    resonanceScore: number;
    predictionSummary: string;
    alignmentWithTrends: string;
    potentialRisks: string[];
    recommendations: string[];
}

export interface NarrativeNode {
    title: string;
    summary: string;
    timeframe: string;
    potentialImpact: 'High' | 'Medium' | 'Low';
    likelihood: number;
    drivingFactors: string[];
}

export interface NarrativeForesightReport {
    narratives: NarrativeNode[];
}

export interface IntelligenceItem {
    source: string;
    author: string;
    content: string;
    summary?: string;
    url: string;
    timestamp: string;
    reach: number | null;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface UnifiedMention {
    type: 'News' | 'Social';
    platform: string;
    url: string;
    content: string; // Headline for News, post text for Social
    author: string; // Publication for News, user handle for Social
    timestamp: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface MediaAndSocialIntelligenceReport {
    topic: string;
    dateRange: string;
    summary: {
        totalMentions: number;
        sentimentBreakdown: {
            positive: number;
            neutral: number;
            negative: number;
        };
        keyInsight: string;
    };
    mentionsOverTime: { date: string; count: number }[];
    topThemes: { theme: string; count: number }[];
    recentMentions: UnifiedMention[];
}

export interface CustomModule {
    id: string;
    name: string;
    description: string;
    prompt: string;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: number;
}
export interface ImageAnalysis {};
export interface AICommsPlan {};
export interface PitchDeck {};
export interface Stakeholder2 {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'Media' | 'Government' | 'NGO' | 'Corporate' | 'Key Opinion Leader' | string;
  influenceScore: number;
  stanceScore: number;
  regulatoryPower: 'High' | 'Medium' | 'Low'; 
  engagementStatus: 'Engaged' | 'Monitor' | 'Requires Immediate Action';
}

export interface ContentRiskAlert {
  id: string;
  timestamp: string;
  platform: 'MicroBlog' | 'VidStream' | 'NewsPortal' | 'Internal' | string;
  threatLevel: 'Low' | 'Elevated' | 'Critical';
  vector: '3R Violation' | 'Coordinated Bot Activity' | 'Deepfake/Manipulated Media' | 'Misinformation' | string;
  snippet: string;
  actionTaken: 'Quarantined' | 'Under Review' | 'Cleared' | 'Takedown Requested';
  aiRecommendation: string;
}

export interface RegulatoryShift {
  id: string;
  policyName: string;
  governingBody: string;
  status: 'Rumored' | 'Drafting Phase' | 'Active Debate' | 'Enacted' | string;
  impactScore: number;
  primaryRisk: 'Revenue Loss' | 'Operational Bottleneck' | 'Reputational Damage' | string;
  summary: string;
  mitigationStrategy: string;
}

export interface PredictiveEvent {
    id: string;
    title: string;
    date: string;
    probability: number;
    description: string;
    actionRequired: boolean;
}

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    influence: 'High' | 'Medium' | 'Low';
    interest: 'High' | 'Medium' | 'Low';
    sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface EvidenceItem {
    id: string;
    source: string;
    snippet: string;
    url?: string;
    admiraltyCode: string;
    reliability: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    credibility: 1 | 2 | 3 | 4 | 5 | 6;
    justification: string;
}

export type VerdictType = 'Verified' | 'Partly Verified' | 'Unverified' | 'Contradicted' | 'Insufficient Evidence';

export interface VerificationTraceStep {
    agentName: string;
    action: string;
    timestamp: string;
    status: 'completed' | 'clarifying' | 'in_progress';
    details?: string;
}

export interface VerificationResult {
    recordId: string;
    sessionId: string;
    languageDetected: string;
    normalizedClaim: string;
    clarificationQuestion?: string;
    isAwaitingClarification?: boolean;
    trace: VerificationTraceStep[];
    evidence: EvidenceItem[];
    verdict: VerdictType;
    confidence: number;
    reasoning: string;
    timestamp: string;
}
