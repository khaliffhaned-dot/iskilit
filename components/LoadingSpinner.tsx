import * as React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes sonar-ping {
          0% {
            transform: scale(0.1);
            opacity: 1;
          }
          70% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-sonar-ping {
          animation: sonar-ping 2s infinite cubic-bezier(0.45, 0, 0.55, 1);
        }
      `}</style>
      <div className="flex justify-center items-center p-8">
        <div className="relative w-16 h-16">
          <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-amber-500"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-amber-400 animate-sonar-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-red-500 animate-sonar-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </>
  );
};

export default React.memo(LoadingSpinner);