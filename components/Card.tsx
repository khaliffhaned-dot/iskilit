import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', ...rest }) => {
  return (
    <div 
      {...rest} 
      className={`bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/40 shadow-[0_8px_32px_0_rgba(15,23,42,0.03)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:border-slate-350/50 transition-all duration-300 p-5 sm:p-6 ${className}`}
    >
      {title && <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${titleClassName}`}>{title}</h3>}
      {children}
    </div>
  );
};

export default React.memo(Card);