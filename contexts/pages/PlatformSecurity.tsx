import React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';

const SecurityPillarCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    services: string[];
}> = ({ icon, title, description, services }) => (
    <Card className="text-center h-full flex flex-col">
        <div className="mx-auto h-16 w-16 text-amber-500 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500 flex-grow">{description}</p>
        <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Google Cloud Services Used:</h4>
            <div className="flex flex-wrap justify-center gap-2">
                {services.map(service => (
                    <span key={service} className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-700">
                        {service}
                    </span>
                ))}
            </div>
        </div>
    </Card>
);

const PlatformSecurity: React.FC = () => {
    return (
        <div className="fade-in">
            <Header title="Platform Security" subtitle="Escalate is built on an enterprise-grade, secure-by-design architecture powered by Google Cloud." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SecurityPillarCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                    title="Identity & Access Management"
                    description="Granular, role-based access controls ensure that users can only access the data and perform the actions appropriate for their role."
                    services={['Firebase Authentication', 'Cloud IAM']}
                />
                <SecurityPillarCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
                    title="Infrastructure Protection"
                    description="Our backend is shielded from web-based attacks and data exfiltration attempts using a multi-layered defense system."
                    services={['Google Cloud Armor', 'VPC Service Controls']}
                />
                 <SecurityPillarCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.752A11.953 11.953 0 0112 2.75a11.953 11.953 0 01-2.402.986z" /></svg>}
                    title="Deployment Integrity"
                    description="We enforce that only verified, trusted code that has passed all security reviews can be deployed to our production environment."
                    services={['Binary Authorization', 'Cloud Build']}
                />
                 <SecurityPillarCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" /></svg>}
                    title="Hybrid Data Backend"
                    description="Our data architecture leverages a combination of specialized databases to ensure performance, scalability, and security for all workloads."
                    services={['Cloud Firestore', 'AlloyDB', 'Cloud SQL']}
                />
                 <SecurityPillarCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                    title="Secure AI Foundation"
                    description="All AI capabilities are built on Google's secure and scalable Vertex AI platform, allowing access to a garden of powerful models."
                    services={['Vertex AI', 'Gemini Models', 'Claude 3 Models']}
                />
            </div>
        </div>
    );
};

export default PlatformSecurity;