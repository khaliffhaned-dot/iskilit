import * as React from 'react';
import Logo from '../../components/Logo.tsx';
import Footer from '../../components/Footer.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import ParticleBackground from '../../components/ParticleBackground.tsx';

const LandingPage: React.FC = () => {
    const { logInWithGoogle, authLoading } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-slate-800 p-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <ParticleBackground />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-grow">
            <div className="w-full max-w-4xl text-center animate-slide-fade-in-up flex flex-col items-center justify-center">
                <Logo className="justify-center" />
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 max-w-2xl mx-auto mt-4 text-center">
                    The Narrative Intelligence Platform
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-xl text-slate-600 text-center">
                    Engineered for the Media Agency. Outmaneuver competitors, see the future first, and command market-moving impact.
                </p>

                <div className="mt-12">
                    <button 
                        onClick={logInWithGoogle} 
                        disabled={authLoading}
                        className="btn h-12 flex items-center justify-center gap-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-md hover:shadow-lg text-slate-700 font-semibold px-6 text-base"
                    >
                        {authLoading ? (
                           <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.028 36.318 44 31.136 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                                Sign in with Google
                            </>
                        )}
                    </button>
                </div>
                
                 <div className="partner-logos justify-center mt-16">
                    <span className="text-sm font-semibold text-slate-500">Powered By:</span>
                     <img src="https://storage.googleapis.com/web-assets-prod/images/cloud/google-cloud-logo.svg" alt="Google Cloud" />
                     <img src="https://storage.googleapis.com/web-assets-prod/images/gemini/google-gemini-wordmark-2023.svg" alt="Gemini" />
                </div>
            </div>
        </div>
        <div className="relative z-10 w-full">
            <Footer />
        </div>
    </div>
  );
};

export default LandingPage;