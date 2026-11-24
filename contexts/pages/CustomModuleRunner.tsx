import React, { useState, useCallback } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { Workspace, User, CustomModule } from '../../types.ts';
import { runCustomModule } from '../../services/aiService.ts';
import { sanitizeAndFormatAIOutput } from '../../services/formatAndSanitizeService.ts';

interface CustomModuleRunnerProps {
    module: CustomModule;
    activeWorkspace: Workspace;
    currentUser: User;
}

const CustomModuleRunner: React.FC<CustomModuleRunnerProps> = ({ module, activeWorkspace, currentUser }) => {
    const [input, setInput] = useState('');
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target?.result as string);
                setInput(''); // Clear text input when a file is loaded
            };
            reader.readAsText(file);
        }
    };
    
    const handleClearFile = () => {
        setFileContent(null);
        setFileName(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    }

    const handleRun = useCallback(async () => {
        if (!input.trim() && !fileContent) {
            setError('Please provide text input or upload a file.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await runCustomModule(activeWorkspace.id, {
                module,
                input,
                fileContent: fileContent || undefined,
                userPersona: currentUser.persona
            }, currentUser.persona.aiEngine);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [input, fileContent, module, activeWorkspace.id, currentUser.persona, currentUser.persona.aiEngine]);

    return (
        <div className="fade-in">
            <Header title={module.name} subtitle={module.description} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Input</h3>
                    <div className="space-y-4">
                        <textarea
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                if (fileContent) handleClearFile();
                            }}
                            placeholder="Enter your input text here..."
                            rows={10}
                            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-slate-100"
                            disabled={!!fileContent}
                        />

                        <div className="flex items-center justify-center text-sm text-slate-500">
                            <span className="flex-grow border-t border-slate-200"></span>
                            <span className="px-2">OR</span>
                            <span className="flex-grow border-t border-slate-200"></span>
                        </div>
                        
                        <div>
                            {fileName ? (
                                <div className="flex items-center justify-between p-2 bg-slate-100 border border-slate-200 rounded-lg">
                                    <p className="text-sm text-slate-700 truncate">{fileName}</p>
                                    <button onClick={handleClearFile} className="text-slate-500 hover:text-red-500 font-bold text-lg">&times;</button>
                                </div>
                            ) : (
                                <input id="file-input" type="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                            )}
                        </div>

                        <button onClick={handleRun} disabled={isLoading} className="w-full btn btn-primary">
                            {isLoading ? 'Running...' : 'Run Module'}
                        </button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Output</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[300px] flex-grow">
                        {isLoading && <div className="py-20"><LoadingSpinner /></div>}
                        {error && <p className="text-center text-red-600">{error}</p>}
                        {result && (
                            <div
                                className="prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeAndFormatAIOutput(result) }}
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CustomModuleRunner;