import * as React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-slate-100 p-3 text-center border-t border-slate-200 flex-shrink-0 flex items-center justify-center">
            <p className="text-xs text-slate-500 text-center">
                <span className="font-semibold">
                    <span className="text-slate-600">Powered by </span>
                    <span className="font-bold text-slate-800">Escalate AI</span>
                </span>
                <span className="mx-2 text-slate-400">|</span>
                <span className="italic"><strong>Disclaimer:</strong> AI-generated insights are for strategic guidance and require professional verification before being used in public-facing materials.</span>
            </p>
        </footer>
    );
};

export default React.memo(Footer);