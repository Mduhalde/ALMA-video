import React, { useState, useEffect, useCallback } from 'react';
import { useVideoGenerator } from './hooks/useVideoGenerator';
import { InputPanel } from './components/InputPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { GithubIcon } from './components/shared/Icons';
import { VeoApiKeyWarning } from './components/VeoApiKeyWarning';

// FIX: Removed the conflicting declaration of `window.aistudio`. This resolves the
// TypeScript error regarding subsequent property declarations having different types.
// The app assumes that the correct types for `window.aistudio` are provided globally.
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}


const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState(false);

  const handleApiKeyError = useCallback(() => {
    setIsKeySelected(false);
  }, []);
  
  const { generate, reset, isGenerating, progress, result, error } = useVideoGenerator({ onApiKeyError: handleApiKeyError });

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per guidelines, assume key selection was successful to avoid race conditions.
      setIsKeySelected(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <header className="py-4 px-6 md:px-12 bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            VideoGen AI
          </h1>
          <a
            href="https://github.com/google/generative-ai-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {!isKeySelected && <VeoApiKeyWarning onSelectKey={handleSelectKey} />}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputPanel
            isGenerating={isGenerating}
            onSubmit={generate}
            isKeySelected={isKeySelected}
          />
          <PreviewPanel
            isGenerating={isGenerating}
            progress={progress}
            result={result}
            error={error}
            onReset={reset}
          />
        </div>
      </main>

      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Powered by Google Gemini API. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;