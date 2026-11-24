import { 
    AnalyticsDashboardData, EventIntelligenceReport, MediaAndSocialIntelligenceReport, BrandReputationReport, NarrativeForesightReport, CompetitiveAnalysisReport, 
    Influencer, ContentPiece, GeneratedImage, CampaignHubReport, ClientReportData, ContentSafetyReport, NarrativeSimulationReport, StakeholderReport, PolicyReport, 
    InterviewBriefing, AnswerFeedback, PredictiveResonanceReport, IntelligenceItem, InteractionLog 
} from '../types.ts';

export const mockContentRisks: any[] = [
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
];


export const mockDashboardData: AnalyticsDashboardData = {
    dailyBriefing: {
        marketPulse: {
            title: "Market Pulse",
            content: "The aviation sector is seeing a resurgence in domestic travel ahead of the Hari Raya festive season. The 'balik kampung' rush is driving significant booking volumes, although consumer sentiment remains sensitive to SST hikes and fluctuating ringgit."
        },
        topMention: {
            title: "Top Media Mention",
            content: "AeroMY receives praise from netizens and prominent figures like Kamarul Zaman for its 'fixed fare' late-night flights initiative during the festive period, seen as a much-needed relief for the Rakyat.",
            sourceName: "Metro Awani",
            sourceUrl: "https://www.astroawani.com"
        },
        strategicOpportunity: {
            title: "Strategic Opportunity",
            content: "Capitalize on the 'Sapot Lokal' sentiment. Launch a narrative focusing on connecting East and West Malaysia seamlessly to align with the government's WAWASAN vision of inclusivity."
        }
    },
    brandPerception: [
        { attribute: "Trust", AeroMY: 75, "National Airways": 85, "Crest Air": 65, SparkJet: 70 },
        { attribute: "Value for Money", AeroMY: 95, "National Airways": 60, "Crest Air": 75, SparkJet: 80 },
        { attribute: "Punctuality", AeroMY: 65, "National Airways": 80, "Crest Air": 70, SparkJet: 85 },
        { attribute: "Innovation", AeroMY: 90, "National Airways": 70, "Crest Air": 65, SparkJet: 60 },
        { attribute: "Customer Service", AeroMY: 60, "National Airways": 85, "Crest Air": 75, SparkJet: 75 }
    ],
    proactiveActions: [
        {
            title: "Amplify 'Balik Kampung' Fixed Fares",
            recommendation: "Draft a localized press release highlighting how AeroMY is helping students and B40 families return to Sabah and Sarawak without breaking the bank. Pitch this to major Malay dailies like Warta Harian and Suara Harian.",
            suggestedPage: "Content Studio"
        },
        {
            title: "Monitor Competitor Pricing",
            recommendation: "Run a competitive analysis on Crest Air's recent aggressive promo pricing on key domestic routes to ensure AeroMY's narrative of 'Now Everyone Can Fly' remains unchallenged.",
            suggestedPage: "Competitive Analysis"
        }
    ],
    contentRisks: mockContentRisks,
    timestamp: new Date().toISOString()
};

export const mockEventIntelligence: EventIntelligenceReport = {
    events: [
        {
            title: "Upcoming SST Increase on Domestic Flights",
            date: new Date().toISOString(),
            location: "Putrajaya",
            summary: "The Department of Finance announced potential revisions to the Sales and Service Tax (SST) which may impact domestic airline ticketing prices, causing anxiety among frequent flyers.",
            relevanceScore: 92,
            updates: [
                { timestamp: new Date().toISOString(), description: "Consumer associations urge the government to reconsider, citing burden on the M40 and B40." },
                { timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Minister issues a statement clarifying that rural routes (MASwings/SparkJet) might be exempted." }
            ],
            sources: [
                { uri: "https://www.thestar.com.my", title: "The Daily Spark: SST hike to affect domestic travel?" },
                { uri: "https://www.malaysiakini.com", title: "Warta Kini: NGOs protest potential flight tax" }
            ]
        },
        {
            title: "Monsoon Season Flight Disruptions",
            date: new Date(Date.now() - 86400000).toISOString(),
            location: "East Coast & Borneo",
            summary: "Heavy monsoon rains (Tengkujuh) are causing widespread flight delays and cancellations to airports in Kelantan, Terengganu, and Sabah. Passengers are stranded and expressing frustration on VidStream and MicroBlog.",
            relevanceScore: 85,
            updates: [
                { timestamp: new Date().toISOString(), description: "Viral VidStream video shows passengers 'lepak' at Terminal 2 waiting for updates." },
                { timestamp: new Date(Date.now() - 7200000).toISOString(), description: "National Weather Bureau issues red alert for continued heavy rainfall over the next 48 hours." }
            ],
            sources: [
                { uri: "https://www.nst.com.my", title: "The National Chronicle: Monsoon havoc disrupts flights to East Coast" },
                { uri: "https://twitter.com", title: "MicroBlog: Trending #Terminal 2 stranded" }
            ]
        }
    ]
};

export const mockMediaIntelligence: MediaAndSocialIntelligenceReport = {
    topic: "AeroMY",
    dateRange: "Last 7 Days",
    summary: {
        totalMentions: 12450,
        sentimentBreakdown: { positive: 45, neutral: 35, negative: 20 },
        keyInsight: "Positive sentiment spiked following the 'fixed fare' announcement, but negative chatter remains around customer service response times and refund processes via the AI chatbot, 'Ask Bot'."
    },
    mentionsOverTime: [
        { date: "Mon", count: 1200 }, { date: "Tue", count: 1350 }, { date: "Wed", count: 4500 },
        { date: "Thu", count: 3200 }, { date: "Fri", count: 1100 }, { date: "Sat", count: 800 }, { date: "Sun", count: 300 }
    ],
    topThemes: [
        { theme: "Fixed Fares for Raya", count: 4200 },
        { theme: "Customer Service / Ask Bot", count: 2100 },
        { theme: "Flight Delays", count: 1500 },
        { theme: "Super App Deals", count: 800 },
        { theme: "Signature Nasi Lemak", count: 650 }
    ],
    recentMentions: [
        {
            type: "Social",
            platform: "MicroBlog",
            url: "https://x.com",
            content: "Terima kasih AeroMY for the fixed fares to Kuching! Finally can balik kampung without eating maggi for a month. Mantap! ✈️🔥",
            author: "@borneo_bro",
            timestamp: new Date().toISOString(),
            sentiment: "Positive"
        },
        {
            type: "Social",
            platform: "VidStream",
            url: "https://tiktok.com",
            content: "My flight delayed for 3 hours and Ask Bot just goes pusing-pusing. Adoi, tolonglah improve customer service ni. #AeroMY #Delay",
            author: "@cik_travel",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sentiment: "Negative"
        },
        {
            type: "News",
            platform: "Metro Awani",
            url: "https://astroawani.com",
            content: "AeroMY offers 20,000 extra seats with fixed fares for upcoming festive season, aiming to reunite families across the South China Sea.",
            author: "Metro Awani News",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            sentiment: "Positive"
        }
    ]
};

export const mockNarrativeForesight: NarrativeForesightReport = {
    narratives: [
        {
            title: "The Return of the 'Green Fee' Debate",
            summary: "Conversations around sustainability and carbon offset fees for domestic flights are gaining traction among Gen-Z Malaysians and local environmental NGOs.",
            timeframe: "Next 3-6 months",
            potentialImpact: "Medium",
            likelihood: 70,
            drivingFactors: ["Government's Net Zero 2050 pledge", "Youth-led climate strikes in KL", "Competitors introducing opt-in green fees"]
        },
        {
            title: "Super App Fatigue vs. Niche Platforms",
            summary: "Users are expressing frustration with bloated 'all-in-one' apps, craving simpler, faster booking experiences. 'Cincai' UI is becoming a point of criticism.",
            timeframe: "Next 1-3 months",
            potentialImpact: "High",
            likelihood: 85,
            drivingFactors: ["Complaints on tech forums like TechForum.my", "Rise of minimalist competitor apps", "Bugs during high-traffic promo periods"]
        }
    ]
};

export const mockCompetitiveAnalysis: CompetitiveAnalysisReport = {
    summary: "AeroMY maintains a dominant share of voice due to aggressive promotional campaigns and strong social media presence. However, National Airways holds the narrative dominance in 'Premium Experience' and 'National Pride', while Crest Air is making inroads in the 'Value with Perks' segment.",
    shareOfVoice: [
        { name: "AeroMY", value: 55 },
        { name: "National Airways", value: 25 },
        { name: "Crest Air", value: 15 },
        { name: "SparkJet", value: 5 }
    ],
    narrativeDominance: [
        { name: "Affordability", value: 75 },
        { name: "National Pride", value: 10 },
        { name: "Reliability", value: 15 }
    ],
    brandAnalyses: [
        {
            brandName: "AeroMY",
            positioning: "The democratizer of travel; 'Now Everyone Can Fly'.",
            keyThemes: ["Low Fares", "Asean Super App", "Youthful Energy", "Occasional Delay Frustrations"]
        },
        {
            brandName: "National Airways",
            positioning: "Premium, full-service national carrier embodying Malaysian Hospitality.",
            keyThemes: ["Malaysian Hospitality", "Safety", "Premium Pricing", "Global Flight Alliance"]
        },
        {
            brandName: "Crest Air",
            positioning: "Hybrid carrier offering value fares with added perks like baggage and screens.",
            keyThemes: ["Smart Travel", "Terminal 1 Main Terminal", "Growing Network", "Aggressive Promos"]
        }
    ]
};

// --- NEW MOCKS FOR REMAINING MODULES ---

export const mockInfluencers: Influencer[] = [
    {
        id: "inf_1",
        name: "Caleb Lee",
        type: "Social Media Creator",
        platform: "VidStream",
        followers: "2.1M",
        engagementRate: "8.5%",
        niche: "Travel hacks, budget flights, lifestyle",
        bio: "Malaysian content creator known for sharing budget travel hacks and reviewing budget airlines. Highly influential among Gen-Z and Millennials in Klang Valley."
    },
    {
        id: "inf_2",
        name: "Imran Shafiq",
        type: "Journalist",
        platform: "News Outlet",
        followers: "150K",
        engagementRate: "2.1%",
        niche: "Business, aviation, economy",
        bio: "Prominent broadcast journalist focusing on corporate Malaysia. Often covers aviation industry updates and government policies affecting travel."
    },
    {
        id: "inf_3",
        name: "Kamarul Zaman",
        type: "Media Personality",
        platform: "MicroBlog",
        followers: "2.8M",
        engagementRate: "5.2%",
        niche: "Current affairs, politics, socio-economy",
        bio: "Former minister and current podcaster (Masa Singkat). Highly influential voice on national issues, frequently weighing in on policies affecting the Rakyat."
    }
];

export const mockPitchDraft = `Hi [Name],

I saw your recent coverage on the challenges Malaysians face with rising living costs, especially during festive seasons. 

As the 'balik kampung' rush approaches, AeroMY is launching a new "Fixed Fares for Raya" initiative to ensure affordable travel for the Rakyat, particularly students and B40 families flying between Peninsular and East Malaysia. 

We'd love to offer you an exclusive interview with our CEO to discuss how we are navigating operational costs to keep fares low and support the government's WAWASAN vision of inclusivity. 

Let me know if you're interested in covering this. 

Best regards,
[Your Name]`;

export const mockContentPiece: ContentPiece = {
    title: "Balik Kampung Lebih Jimat dengan Tambang Tetap AeroMY!",
    body: "Musim perayaan dah dekat! Kami faham rindu nak balik kampung jumpa keluarga, tapi bajet lari. Jangan risau, AeroMY bawakan kempen Tambang Tetap Raya khas untuk anda yang terbang antara Semenanjung dan Sabah/Sarawak. Tempah sekarang sebelum kehabisan tempat duduk! Biar kami bantu anda pulang beraya dengan senyuman. ✈️🏠",
    hashtags: ["#AeroMYRaya", "#BalikKampung", "#TambangTetap", "#SapotLokal", "#KeluargaMalaysia"]
};

export const mockCampaignPlan: CampaignHubReport = {
    plan: {
        strategy: {
            title: "Kempen Raya: Jom Balik Sama-Sama",
            targetAudience: "Malaysian students in Peninsular, young professionals from East Malaysia",
            coreMessage: "AeroMY makes reuniting with family affordable and accessible for everyone this Raya."
        },
        contentCalendar: [
            { day: 1, platform: "VidStream", title: "Teaser Video: 'Rindu Masakan Ibu'", description: "Emotional short video featuring a student missing home, teasing the fixed fare announcement.", draftContent: "Rindu ketupat rendang ibu? #TungguUpdateKami" },
            { day: 3, platform: "PhotoShare", title: "Official Launch & Promo Details", description: "Infographic detailing the fixed fares and booking dates.", draftContent: "Berita baik untuk semua! Tambang Tetap Raya kini dibuka. Jom tempah sekarang! 🛫" },
            { day: 5, platform: "MicroBlog", title: "Customer Highlight (UGC)", description: "Retweet/share positive stories from users who secured their tickets.", draftContent: "Syukur alhamdulillah! Terima kasih @AeroMY dapat tiket murah balik Kuching. #AeroMYRaya" }
        ],
        performanceReport: {
            metrics: [
                { kpi: "Reach", value: "2.5M", change: 15 },
                { kpi: "Engagement Rate", value: "6.8%", change: 2.1 },
                { kpi: "Click-Through Rate", value: "3.2%", change: 0.5 }
            ],
            engagementProjection: [
                { day: "Day 1", engagement: 15000 },
                { day: "Day 3", engagement: 45000 },
                { day: "Day 5", engagement: 30000 },
                { day: "Day 7", engagement: 20000 }
            ]
        }
    }
};

export const mockBrandReputation: BrandReputationReport = {
    id: "rep_1",
    brandName: "AeroMY",
    summary: "AeroMY maintains strong visibility, largely driven by its affordability narrative. However, customer service frustrations (Ask Bot) and flight delay complaints continue to drag down overall sentiment, particularly on VidStream.",
    reputationScore: 68,
    sentimentTrend: [
        { day: "Mon", score: 65 }, { day: "Tue", score: 62 }, { day: "Wed", score: 75 },
        { day: "Thu", score: 72 }, { day: "Fri", score: 68 }
    ],
    metrics: [
        { name: "Share of Voice", value: "58%", explanation: "Dominates aviation conversations in Malaysia." },
        { name: "Net Sentiment", value: "+12", explanation: "Slightly positive, buoyed by recent promo announcements." },
        { name: "Trust Index", value: "6.5/10", explanation: "Impacted by perceived unreliability in scheduling." }
    ],
    keyFindings: [
        { type: "Positive", description: "Strong appreciation for 'Fixed Fares' during Raya.", source: "MicroBlog", impact: "High" },
        { type: "Negative", description: "Viral complaints about 'Ask Bot' looping issues.", source: "VidStream", impact: "High" },
        { type: "Opportunity", description: "Highlight on-time performance improvements on key domestic routes.", source: "Internal Data", impact: "Medium" }
    ],
    strategicRecommendations: [
        { recommendation: "Launch a 'Behind the Scenes' series showing human customer service agents assisting 'Ask Bot' to humanize the brand." },
        { recommendation: "Partner with local influencers to review the ease of booking the new fixed fares." }
    ].map(r => r.recommendation),
    timestamp: new Date().toISOString()
};

export const mockClientReport: ClientReportData = {
    id: "cr_1",
    executiveSummary: "Over the past month, AeroMY dominated the domestic aviation narrative with the successful launch of the Raya Fixed Fares campaign. Sentiment improved by 15%, driven by positive coverage in major Malay dailies and viral appreciation tweets.",
    keyMetrics: [
        { name: "Total Mentions", value: "45,200", change: "+22%" },
        { name: "Positive Sentiment", value: "52%", change: "+15%" },
        { name: "Media Reach", value: "12.5M", change: "+8%" }
    ],
    mediaMentions: [
        { headline: "AeroMY Tawar Tambang Tetap Balik Kampung", summary: "20,000 tempat duduk tambahan disediakan...", outlet: "Warta Harian", timestamp: "2 days ago", url: "#" },
        { headline: "Relief for East Malaysians as AeroMY Caps Fares", summary: "Students and workers praise the initiative...", outlet: "The Daily Spark", timestamp: "3 days ago", url: "#" }
    ]
};

export const mockContentSafety: ContentSafetyReport = {
    disinformation: {
        isDisinformation: false,
        confidence: 95,
        explanation: "No evidence found to suggest this content contains coordinated disinformation or fake news regarding Malaysian aviation policies.",
        verifiedSources: [{ uri: "https://sebenarnya.my", title: "Sebenarnya.my: Tiada Kenaikan Cukai Lapangan Terbang" }]
    },
    safety: {
        isSafe: true,
        violations: []
    },
    biasAndTone: {
        politicalBias: 'None',
        emotionalTone: 'Informative and Neutral',
        riskScore: 12
    },
    deepfakeAnalysis: {
        isManipulated: false,
        confidence: 98,
        artifactsFound: []
    }
};

export const mockNarrativeSimulation: NarrativeSimulationReport = {
    scenario: "AeroMY announces a sudden system outage causing nationwide check-in delays during the school holidays.",
    summary: "The crisis escalates quickly on social media, with 'AeroMY Down' trending on MicroBlog within 30 minutes. Frustration peaks due to long queues at Terminal 2 and perceived lack of ground staff communication.",
    likelyMediaAngles: [
        { angle: "Chaos at Terminal 2: Thousands Stranded", outletType: "Mainstream News (e.g., Metro Awani)" },
        { angle: "System Upgrade Gone Wrong? Questions on AeroMY's IT Infrastructure", outletType: "Business/Tech Portals (e.g., The Business Edge)" }
    ],
    potentialJournalistQuestions: [
        "What caused this sudden outage, and why wasn't there a backup system?",
        "Will passengers who missed their flights be fully compensated?",
        "How long will it take to clear the backlog at Terminal 2?"
    ],
    simulatedSocialMediaFeed: [
        { platform: "MicroBlog", author: "@Terminal 1_Updates", content: "Current situation at Terminal 2: Chaos. Systems offline. Check-in lines are stretching to the exit doors. #AeroMYDown", sentiment: "Negative" },
        { platform: "VidStream", author: "@angry_traveler", content: "Been waiting 2 hours and no staff is telling us anything. Macam mana ni AeroMY?! 🤬", sentiment: "Negative" }
    ],
    simulatedVisualConcepts: {
        imagePrompts: ["A well-lit, calm customer service desk at Terminal 2 with an agent patiently assisting a family.", "An infographic detailing step-by-step instructions for passengers to check in manually."],
        videoScripts: ["CEO statement filmed on the ground at Terminal 2, acknowledging the issue, apologizing sincerely, and outlining the immediate steps being taken."]
    },
    strategicRecommendations: [
        "Deploy the 'Red Team' immediately to Terminal 2 to physically manage lines and distribute water/snacks.",
        "Issue a holding statement on all social platforms acknowledging the issue within 15 minutes of detection.",
        "Pause all promotional ad spending until the system is restored."
    ],
    timestamp: new Date().toISOString()
};

export const mockStakeholderReport: StakeholderReport = {
    summary: "Key stakeholders are highly engaged regarding the new sustainability initiatives. Government bodies are supportive, while consumer groups remain cautious about potential fee increases.",
    stakeholders: [
        { name: "Department of Transport (DOT)", category: "Government", influence: "High", stance: "Supportive", interests: ["National connectivity", "Aviation safety", "Affordable fares"], engagementStrategy: "Regular briefings on capacity planning and adherence to regulations.", predictedActions: ["Endorse safety protocols", "Request quarterly updates"], sentimentTrend: "Improving" },
        { name: "National Aviation Authority (NAA)", category: "Industry Body", influence: "High", stance: "Neutral", interests: ["Consumer protection", "Quality of service (QoS)"], engagementStrategy: "Quarterly reviews of customer service metrics and prompt resolution of escalated complaints.", predictedActions: ["Audit refund policies", "Issue public advisory"], sentimentTrend: "Stable" },
        { name: "National Consumer Group (NCG)", category: "Community Group", influence: "Medium", stance: "Opposed", interests: ["Preventing hidden fees", "Refund efficiency"], engagementStrategy: "Proactive dialogues on pricing transparency and updates on refund processing times.", predictedActions: ["Publish critical report", "Launch social media campaign"], sentimentTrend: "Declining" }
    ]
};

export const mockPolicyReport: PolicyReport = {
    policies: [
        { title: "Revision of Passenger Service Charge (PSC)", ministry: "Department of Transport / National Aviation Authority (NAA)", status: "Proposed", summary: "National Aviation Authority (NAA) is reviewing the PSC structure, potentially standardizing rates between Terminal 1 and Terminal 2.", potentialImpact: "Could reduce AeroMY's cost advantage at Terminal 2 if rates are equalized.", sourceUrl: "#", riskLevel: "High", timeline: "Expected Q4 2026" },
        { title: "Net Zero Carbon Emission 2050 Framework", ministry: "Ministry of Natural Resources & Environment", status: "Active", summary: "National framework mandating carbon reporting and gradual reduction for heavy industries, including aviation.", potentialImpact: "Requires immediate investment in SAF (Sustainable Aviation Fuel) and carbon offset programs.", sourceUrl: "#", riskLevel: "Medium", timeline: "Implementation started Q1 2026" }
    ]
};

export const mockInterviewBriefing: InterviewBriefing = {
    topic: "AeroMY's Q3 Financial Recovery and Route Expansion",
    outlet: "Business FM 99.9 - The Business Station",
    likelyQuestions: [
        { question: "With the strengthening ringgit, how much has your fuel cost burden eased this quarter?", context: "Business FM listeners are financially savvy and track currency impacts on corporate earnings." },
        { question: "You've announced new routes to Central Asia. Is this a pivot away from your traditional ASEAN stronghold?", context: "Testing the strategic direction and competitive landscape." }
    ],
    keyTalkingPoints: [
        "The stronger Ringgit is a welcome tailwind, but our focus remains on operational efficiency and driving down unit costs.",
        "ASEAN remains our core, but Central Asia represents an underserved market with high growth potential for our mid-haul fleet (AeroMY Extra).",
        "Our Super App ecosystem is starting to yield significant ancillary revenue, diversifying our income beyond ticket sales."
    ],
    interviewerPersona: {
        name: "Imran Shafiq / Wong Su Lin",
        style: "Direct, data-driven, occasionally probing.",
        potentialAgenda: "To push beyond PR fluff and get hard numbers on profitability and yield margins."
    }
};

export const mockAnswerFeedback: AnswerFeedback = {
    question: "Why are passengers still experiencing delays despite your claims of improved operations?",
    transcript: "We are trying our best. The weather is unpredictable and sometimes air traffic control is slow.",
    feedback: { overall: "Too defensive and shifts blame. You need to take ownership, acknowledge the frustration, and provide concrete examples of what is being done to fix it." },
    score: 45,
    followUpQuestion: "So you're saying the delays are entirely out of your control?"
};

export const mockPredictiveResonance: PredictiveResonanceReport = {
    resonanceScore: 82,
    predictionSummary: "The 'Jom Cuti-Cuti Malaysia' campaign will likely resonate well with local families and young adults looking for affordable weekend getaways. The focus on local food and culture hits the right nostalgic notes.",
    alignmentWithTrends: "High alignment with current 'Sapot Lokal' sentiment and domestic tourism pushes by National Tourism Board.",
    potentialRisks: ["If promo seats run out too quickly, backlash may occur ('scam promo' claims).", "Competitors might launch matching flash sales."],
    recommendations: ["Ensure robust server capacity to handle booking surges.", "Be transparent about seat limitations in the T&Cs.", "Highlight lesser-known local destinations to ease congestion in popular spots like Penang or Langkawi."]
};

export const mockCustomModuleResult = "Berdasarkan analisis terkini, sentimen rakyat terhadap isu kelewatan penerbangan masih berada di tahap membimbangkan. Pihak pengurusan dicadangkan untuk mengadakan sesi 'Townhall' bersama media tempatan bagi menjelaskan situasi sebenar dan langkah-langkah mitigasi yang sedang diambil.";


export const mockStakeholders2: any[] = [
  {
    id: "shk-001",
    name: "Kamarul Zaman",
    role: "Former Minister / Political Commentator",
    organization: "Independent",
    category: "Government",
    influenceScore: 92,
    stanceScore: 65, 
    regulatoryPower: "High",
    engagementStatus: "Engaged"
  },
  {
    id: "shk-002",
    name: "Persatuan Pengguna M'sia (PPM)",
    role: "Consumer Advocacy",
    organization: "NGO",
    category: "NGO",
    influenceScore: 78,
    stanceScore: -45,
    regulatoryPower: "Medium",
    engagementStatus: "Requires Immediate Action"
  },
  {
    id: "shk-003",
    name: "Imran Shafiq",
    role: "Lead Anchor",
    organization: "Metro Awani",
    category: "Media",
    influenceScore: 85,
    stanceScore: 15,
    regulatoryPower: "Low",
    engagementStatus: "Monitor"
  }
];



export const mockRegulatoryShifts: any[] = [
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
];
