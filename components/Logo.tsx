import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center group font-inter ${className}`} aria-label="Escalate Logo">
      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-dark-red">
        Escalate<span className="pulse-dot">.</span>
      </h1>
    </div>
  );
};

export default Logo;