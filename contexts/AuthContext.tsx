import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import * as cloudService from '../services/cloudService.ts';
import { User } from '../types.ts';

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
  logInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// A mock user ID for the simulation
const MOCK_USER_ID = 'mock_user_12345';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for a logged-in state in localStorage on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
        setAuthLoading(true);

        // Force logout state initially once to take the user to the landing page as requested
        if (!localStorage.getItem('escalate_has_visited_landing_once')) {
            localStorage.setItem('escalate_explicit_logout', 'true');
            localStorage.removeItem('escalate_mock_user');
            localStorage.setItem('escalate_has_visited_landing_once', 'true');
        }

        let loggedInUser = localStorage.getItem('escalate_mock_user');
        const explicitLogout = localStorage.getItem('escalate_explicit_logout');
        
        // If not logged in and not explicitly logged out, auto-login with default profile for best experience
        if (!loggedInUser && !explicitLogout) {
            const defaultUser = {
                uid: MOCK_USER_ID,
                name: 'Khaliff',
                email: 'khaliff@escalate.my'
            };
            localStorage.setItem('escalate_mock_user', JSON.stringify(defaultUser));
            loggedInUser = JSON.stringify(defaultUser);
        }

        if (loggedInUser) {
            try {
                const parsedUser = JSON.parse(loggedInUser);
                // Migrate legacy emails or names to the requested Khaliff profile
                if (parsedUser.email === 'khaliff@escalategency.my' || parsedUser.name !== 'Khaliff' || parsedUser.email !== 'khaliff@escalate.my') {
                    parsedUser.name = 'Khaliff';
                    parsedUser.email = 'khaliff@escalate.my';
                    localStorage.setItem('escalate_mock_user', JSON.stringify(parsedUser));
                }
                // In a real app, you'd verify this token/session with a backend.
                // Here, we just trust it and fetch the profile.
                const userProfile = cloudService.getOrCreateUser(parsedUser.uid, parsedUser.name, parsedUser.email);
                // Ensure cloud service gets the updated properties in case of legacy cache
                userProfile.name = 'Khaliff';
                userProfile.email = 'khaliff@escalate.my';
                setCurrentUser(userProfile);
            } catch (e) {
                console.error("Failed to parse mock user from storage", e);
                localStorage.removeItem('escalate_mock_user');
            }
        } else {
            setCurrentUser(null);
        }
        setAuthLoading(false);
    };
    checkAuthStatus();
  }, []);


  const logInWithGoogle = useCallback(async () => {
    setAuthLoading(true);
    // Simulate API call to Google
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Create a mock user profile
    const mockGoogleUser = {
        uid: MOCK_USER_ID,
        name: 'Khaliff',
        email: 'khaliff@escalate.my'
    };
    
    const userProfile = cloudService.getOrCreateUser(mockGoogleUser.uid, mockGoogleUser.name, mockGoogleUser.email);
    setCurrentUser(userProfile);
    
    // Persist mock login state
    localStorage.setItem('escalate_mock_user', JSON.stringify(mockGoogleUser));
    localStorage.removeItem('escalate_explicit_logout');

    setAuthLoading(false);
  }, []);

  const logOut = useCallback(async () => {
    setAuthLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    localStorage.removeItem('escalate_mock_user');
    localStorage.setItem('escalate_explicit_logout', 'true');
    setAuthLoading(false);
    // This will cause a re-render, and App.tsx will show the LandingPage
  }, []);

  const value = useMemo(() => ({
    currentUser,
    authLoading,
    logInWithGoogle,
    logOut,
  }), [currentUser, authLoading, logInWithGoogle, logOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};