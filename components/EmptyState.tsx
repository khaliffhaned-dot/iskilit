import * as React from 'react';
import Card from './Card.tsx';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <Card className="mt-8">
        <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 text-slate-400 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">{message}</p>
        </div>
    </Card>
  );
};

export default EmptyState;