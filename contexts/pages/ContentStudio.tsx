import * as React from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { generateContentPiece, generateImage } from '../../services/aiService.ts';
import { ContentPiece, GeneratedImage, ActivePage, User, Workspace } from '../../types.ts';

const tones = ['Professional', 'Casual', 'Witty', 'Urgent', 'Informative'];

interface ContentStudioProps {
  setActivePage: (pageState: ActivePage) => void;
  currentUser: User;
  activeWorkspace: Workspace;
}

const ContentVariantEditor: React.FC<{
    title: string;
    onGenerate: (topic: string, tone: string) => Promise<ContentPiece | null>;
    initialTopic?: string;
    initialTone?: string;
    initialContent?: ContentPiece;
}> = ({ title, onGenerate, initialTopic = '', initialTone = tones[0], initialContent = null }) => {
    const [topic, setTopic] = React.useState(initialTopic);
    const [tone, setTone] = React.useState(initialTone);
    const [content, setContent] = React.useState<ContentPiece | null>(initialContent);
    const [isLoading, setIsLoading] = React.useState(false);
    const [copySuccess, setCopySuccess] = React.useState('');

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setContent(null);
        const result = await onGenerate(topic, tone);
        setContent(result);
        setIsLoading(false);
    };

    const handleCopy = React.useCallback(() => {
        if (!content?.body) return;
        const textToCopy = `${content.title}\n\n${content.body}${content.hashtags ? `\n\n${content.hashtags.join(' ')}` : ''}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    }, [content]);

    const inputClass = "w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";

    return (
        <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="space-y-4">
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic or Key Message" className={inputClass} />
                <select value={tone} onChange={e => setTone(e.target.value)} className={inputClass}>
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button onClick={handleGenerate} disabled={isLoading || !topic} className="w-full btn btn-primary">
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            {isLoading && <div className="py-8"><LoadingSpinner /></div>}
            {content && !isLoading && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800">{content.title}</h4>
                    <p className="mt-2 whitespace-pre-wrap text-slate-600">{content.body}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm text-amber-600">{content.hashtags?.join(' ')}</p>
                        <button onClick={handleCopy} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
                           {copySuccess || 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = React.useState('A high-quality promotional poster for AeroMY featuring a Malaysian family happily boarding an airplane, with festive Hari Raya elements in the background, vibrant colors.');
    const [image, setImage] = React.useState<GeneratedImage | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const inputClass = "w-full p-2 border rounded-md bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-amber-500 focus:border-amber-500";


    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setImage(null);
        try {
            const result = await generateImage(prompt);
            setImage(result);
        } catch(e) {
            console.error(e);
            alert("Image generation failed. Please check the console for details.");
        }
        setIsLoading(false);
    };

    return (
        <Card className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Image Generator</h3>
            <div className="space-y-4 flex-grow flex flex-col">
                 <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    rows={3}
                    className={inputClass}
                />
                <div className="flex-grow flex items-center justify-center bg-slate-100 rounded-lg min-h-[200px] border border-slate-200">
                    {isLoading ? <LoadingSpinner /> : image ? 
                        <img src={`data:image/jpeg;base64,${image.base64}`} alt={image.prompt} className="max-h-full max-w-full object-contain rounded-md" /> 
                        : <p className="text-slate-400">Image will appear here</p>
                    }
                </div>
            </div>
             <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full btn btn-primary mt-4">
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </Card>
    );
}


const ContentStudio: React.FC<ContentStudioProps> = ({ setActivePage, activeWorkspace, currentUser }) => {
    
    const createPressRelease = (topic: string, tone: string) => {
        const prompt = `Write a professional press release with the title "${topic}" in a ${tone} tone. The company name is ${activeWorkspace.brandName}. Include a standard boilerplate and media contact section.`;
        return generateContentPiece(activeWorkspace.id, { type: 'Press Release', topic: prompt, tone }, currentUser.persona, currentUser.persona.aiEngine);
    };

    const createSocialPost = (topic: string, tone: string) => {
        const prompt = `Write a social media post for LinkedIn about "${topic}" in a ${tone} tone. Include relevant hashtags.`;
        return generateContentPiece(activeWorkspace.id, { type: 'Social Media Post', topic: prompt, tone }, currentUser.persona, currentUser.persona.aiEngine);
    };

    return (
        <div className="fade-in">
            <Header title="The Message Factory" subtitle="Your AI co-pilot for drafting, refining, and visualizing on-brand communications content at scale." />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                     <ContentVariantEditor 
                        title="Press Release Draft" 
                        onGenerate={createPressRelease} 
                        initialTopic="AeroMY Announces 'Tambang Tetap Raya' to Keep Festive Travel Affordable"
                        initialTone="Professional"
                        initialContent={{
                            title: "FOR IMMEDIATE RELEASE: AeroMY Announces 'Tambang Tetap Raya' to Keep Festive Travel Affordable",
                            body: "KUALA LUMPUR, MALAYSIA - As the festive season approaches, AeroMY is proud to announce its 'Tambang Tetap Raya' initiative, capping fares for flights between Peninsular Malaysia and East Malaysia. This initiative underscores AeroMY's commitment to supporting the Department of Transport's WAWASAN vision of ensuring affordable and accessible travel for all Malaysians.\n\n\"We understand the importance of reuniting with loved ones during this special time,\" said a spokesperson for AeroMY. \"Our fixed fares guarantee that passengers won't face exorbitant prices during peak travel periods.\"\n\nThe fixed fares are available for booking immediately. Passengers are encouraged to secure their seats early to avoid disappointment.\n\nAbout AeroMY\nAeroMY is a leading low-cost carrier dedicated to democratizing travel across the region. With a focus on affordability and innovation, AeroMY connects millions of passengers to their destinations every year.",
                            hashtags: ["#AeroMY", "#TambangTetap", "#SapotLokal"]
                        }}
                    />
                </div>
                <div className="xl:col-span-1">
                    <ContentVariantEditor 
                        title="Social Media Post" 
                        onGenerate={createSocialPost}
                        initialTopic="Balik Kampung Lebih Jimat dengan Tambang Tetap AeroMY!"
                        initialTone="Casual"
                        initialContent={{
                            title: "Balik Kampung Lebih Jimat dengan Tambang Tetap AeroMY!",
                            body: "Musim perayaan dah dekat! Kami faham rindu nak balik kampung jumpa keluarga, tapi bajet lari. Jangan risau, AeroMY bawakan kempen Tambang Tetap Raya khas untuk anda yang terbang antara Semenanjung dan Sabah/Sarawak. Tempah sekarang sebelum kehabisan tempat duduk! Biar kami bantu anda pulang beraya dengan senyuman. ✈️🏠",
                            hashtags: ["#AeroMYRaya", "#BalikKampung", "#TambangTetap", "#SapotLokal", "#KeluargaMalaysia"]
                        }}
                    />
                </div>
                 <div className="lg:col-span-2 xl:col-span-1">
                    <ImageGenerator />
                </div>
            </div>
        </div>
    );
};

export default ContentStudio;