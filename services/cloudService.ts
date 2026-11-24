import { User, Workspace, MediaContact, InteractionLog, UserRole, WorkspaceMember, AIEngine, Comment } from '../types.ts';

// --- MOCK DATABASE ---
const MOCK_USERS: { [uid: string]: User } = {};
const MOCK_WORKSPACES: { [id: string]: Workspace } = {};
const MOCK_USER_ACTIVE_WORKSPACES: { [uid: string]: string } = {};
const MOCK_COMMENTS: { [reportId: string]: Comment[] } = {};


const initializeMockData = (user: User) => {
    if (MOCK_USERS[user.uid]) return; // Already initialized

    MOCK_USERS[user.uid] = user;

    const initialWorkspace: Workspace = {
        id: `ws_${user.uid}_${Date.now()}`,
        name: `AeroMY Comms Hub`,
        brandName: 'AeroMY',
        competitors: ['National Airways', 'Crest Air', 'SparkJet'],
        ownerId: user.uid,
        members: [{ userId: user.uid, name: user.name || 'Owner', email: user.email || '', role: 'Admin' }],
        mediaContacts: [
            {
                id: 'mc_1',
                name: 'Kamarul Zaman',
                type: 'Media Personality',
                platform: 'Podcast (Masa Singkat)',
                followers: '1.2M',
                engagementRate: '4.5%',
                niche: 'Politics & Current Affairs',
                bio: 'Former Health Minister turned prominent podcaster. Discusses Malaysian political landscape and socio-economic issues.',
                relationshipScore: 85,
                status: 'Warm',
                lastContacted: new Date().toISOString(),
                interactionHistory: []
            },
            {
                id: 'mc_2',
                name: 'Imran Shafiq',
                type: 'Journalist',
                platform: 'News Outlet',
                followers: '150K',
                engagementRate: '2.1%',
                niche: 'Business & Economy',
                bio: 'Lead anchor and executive producer. Focused on corporate developments, market trends, and economic policies in Malaysia.',
                relationshipScore: 60,
                status: 'Cold',
                lastContacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                interactionHistory: []
            }
        ]
    };
    MOCK_WORKSPACES[initialWorkspace.id] = initialWorkspace;
    MOCK_USER_ACTIVE_WORKSPACES[user.uid] = initialWorkspace.id;
};


// --- Authentication & User Management (Mocks) ---

export const getOrCreateUser = (uid: string, name: string | null, email: string | null): User => {
    if (MOCK_USERS[uid]) {
        return MOCK_USERS[uid];
    }
    const newUser: User = {
        uid,
        name,
        email,
        companyName: name ? `${name.split(' ')[0]}'s Company` : 'New Company',
        persona: { style: 'Professional and insightful', priorities: 'Clarity, impact, and data-driven decisions.', aiEngine: 'Gemini 2.5 Flash' },
        branding: { logoUrl: null },
    };
    initializeMockData(newUser);
    return newUser;
};


export const getUserProfile = async (uid: string): Promise<User | null> => {
    console.log(`[Mock] Fetching profile for UID: ${uid}`);
    await new Promise(res => setTimeout(res, 200)); // Simulate network delay
    return MOCK_USERS[uid] || null;
};

// --- WORKSPACE & DATA MANAGEMENT (Mocks) ---

export const getWorkspacesForUser = async (userId: string): Promise<Workspace[]> => {
    await new Promise(res => setTimeout(res, 200));
    return Object.values(MOCK_WORKSPACES).filter(ws => ws.members?.some(m => m.userId === userId));
}

export const getActiveWorkspaceId = async (userId: string): Promise<string | null> => {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_USER_ACTIVE_WORKSPACES[userId] || null;
}

export const getWorkspaceById = async (workspaceId: string): Promise<Workspace | null> => {
    await new Promise(res => setTimeout(res, 200));
    return MOCK_WORKSPACES[workspaceId] || null;
};

export const setActiveWorkspaceId = async (uid: string, workspaceId: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 50));
    MOCK_USER_ACTIVE_WORKSPACES[uid] = workspaceId;
    console.log(`[Mock] Set active workspace for ${uid} to ${workspaceId}`);
};

export const createWorkspace = async (user: User, name: string, brandName: string, competitors: string[]): Promise<Workspace> => {
    await new Promise(res => setTimeout(res, 500));
    const newWorkspace: Workspace = {
        id: `ws_${Date.now()}`,
        name,
        brandName,
        competitors,
        ownerId: user.uid,
        members: [{ userId: user.uid, name: user.name || 'Owner', email: user.email || '', role: 'Admin'}]
    };
    MOCK_WORKSPACES[newWorkspace.id] = newWorkspace;
    MOCK_USER_ACTIVE_WORKSPACES[user.uid] = newWorkspace.id;
    console.log(`[Mock] Created new workspace:`, newWorkspace);
    return newWorkspace;
};

export const uploadBrandingLogo = async (uid: string, file: File): Promise<string> => {
    await new Promise(res => setTimeout(res, 1000));
    // In a mock, we can use FileReader to get a data URL to simulate the upload
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            if (MOCK_USERS[uid]) {
                MOCK_USERS[uid].branding.logoUrl = dataUrl;
                resolve(dataUrl);
            } else {
                reject(new Error("User not found"));
            }
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

export const updateUserProfile = async (user: User): Promise<void> => {
    await new Promise(res => setTimeout(res, 200));
    if (MOCK_USERS[user.uid]) {
        MOCK_USERS[user.uid] = { ...MOCK_USERS[user.uid], ...user };
        console.log(`[Mock] Updated user profile for ${user.uid}`, MOCK_USERS[user.uid]);
    }
};

// --- Media Hub Mocks ---
export const getMediaContacts = async (workspaceId: string): Promise<MediaContact[]> => {
    await new Promise(res => setTimeout(res, 100));
    return MOCK_WORKSPACES[workspaceId]?.mediaContacts || [];
};

export const addMediaContact = async (workspaceId: string, contact: MediaContact): Promise<void> => {
    await new Promise(res => setTimeout(res, 100));
    const ws = MOCK_WORKSPACES[workspaceId];
    if (ws) {
        if (!ws.mediaContacts) ws.mediaContacts = [];
        ws.mediaContacts.push(contact);
    }
};

export const updateMediaContact = async (workspaceId: string, updatedContact: MediaContact): Promise<void> => {
    await new Promise(res => setTimeout(res, 100));
    const ws = MOCK_WORKSPACES[workspaceId];
    if (ws && ws.mediaContacts) {
        const index = ws.mediaContacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
            ws.mediaContacts[index] = updatedContact;
        }
    }
};

export const deleteMediaContact = async (workspaceId: string, contactId: string): Promise<void> => {
     await new Promise(res => setTimeout(res, 100));
    const ws = MOCK_WORKSPACES[workspaceId];
    if (ws && ws.mediaContacts) {
        ws.mediaContacts = ws.mediaContacts.filter(c => c.id !== contactId);
    }
};

export const logInteractionForContact = async (workspaceId: string, contactId: string, interaction: Omit<InteractionLog, 'id'>): Promise<void> => {
    await new Promise(res => setTimeout(res, 100));
    const ws = MOCK_WORKSPACES[workspaceId];
    if (ws && ws.mediaContacts) {
        const contact = ws.mediaContacts.find(c => c.id === contactId);
        if (contact) {
            const newInteraction: InteractionLog = { ...interaction, id: `log_${Date.now()}` };
            if (!contact.interactionHistory) contact.interactionHistory = [];
            contact.interactionHistory.push(newInteraction);
            contact.lastContacted = newInteraction.date; // Update last contacted date
        }
    }
};

// --- Collaboration Mocks ---

export const getCommentsForReport_REALTIME = (reportId: string, callback: (comments: Comment[]) => void): (() => void) => {
    if (!MOCK_COMMENTS[reportId]) {
        MOCK_COMMENTS[reportId] = [];
    }
    
    callback(MOCK_COMMENTS[reportId]);

    // In a real Firebase app, this would be `onSnapshot` and would return the unsubscribe function.
    // This is a mock, so we return a dummy function.
    const unsubscribe = () => {};
    return unsubscribe;
};

export const postComment = async (reportId: string, userId: string, userName: string, text: string): Promise<Comment> => {
    await new Promise(res => setTimeout(res, 300));
    if (!MOCK_COMMENTS[reportId]) {
        MOCK_COMMENTS[reportId] = [];
    }
    const newComment: Comment = {
        id: `comment_${Date.now()}`,
        userId,
        userName,
        text,
        timestamp: Date.now(),
    };
    MOCK_COMMENTS[reportId].push(newComment);
    // In a real app, the realtime listener would fire automatically.
    return newComment;
};