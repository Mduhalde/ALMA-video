import React from 'react';
import type { GenerationProgress, GenerationResult, ApiError } from '../types';
import { ProgressTracker } from './ProgressTracker';
import { VideoResult } from './VideoResult';
import { Button } from './shared/Button';
import { VideoIcon } from './shared/Icons';

interface PreviewPanelProps {
  isGenerating: boolean;
  progress: GenerationProgress;
  result: GenerationResult | null;
  error: ApiError | null;
  onReset: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ isGenerating, progress, result, error, onReset }) => {
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center bg-red-900/20 border border-red-500 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error en la Generación</h3>
          <p className="text-red-300 mb-4">{error.message}</p>
          <Button onClick={onReset} variant="secondary">Intentar de Nuevo</Button>
        </div>
      );
    }

    if (isGenerating || (progress.step !== 'idle' && progress.step !== 'completed')) {
      return <ProgressTracker progress={progress} />;
    }

    if (result) {
      return <VideoResult result={result} onReset={onReset} />;
    }

    return (
      <div className="text-center text-gray-500 p-8">
        <VideoIcon className="w-24 h-24 mx-auto mb-4 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-400">Tu video aparecerá aquí</h3>
        <p>Completa el formulario a la izquierda para comenzar a crear tu video con IA.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg min-h-[500px] flex flex-col justify-center">
      {renderContent()}
    </div>
  );
};
