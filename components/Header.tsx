import * as React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-2 max-w-3xl">{subtitle}</p>}
    </header>
  );
};

export default React.memo(Header);