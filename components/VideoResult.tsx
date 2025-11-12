import React, { useState } from 'react';
import type { GenerationResult } from '../types';
import { Button } from './shared/Button';
import { DownloadIcon, RefreshCwIcon, ClockIcon, AspectRatioIcon, FilmIcon, FileTextIcon } from './shared/Icons';

interface VideoResultProps {
  result: GenerationResult;
  onReset: () => void;
}

export const VideoResult: React.FC<VideoResultProps> = ({ result, onReset }) => {
  const [showScript, setShowScript] = useState(false);

  const handleDownloadVideo = () => {
    if (!result.videoUrl) return;

    const link = document.createElement('a');
    link.href = result.videoUrl;
    
    // Sanitize title for a safe filename
    const fileName = `${result.guion.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadScript = () => {
    const scriptJson = JSON.stringify(result.guion, null, 2);
    const blob = new Blob([scriptJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `script_${result.guion.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const { configuracion_tecnica } = result.especificaciones;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Group all generated content together */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center -mb-2">{result.guion.titulo}</h2>
        
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {result.videoUrl && (
            <video controls src={result.videoUrl} className="w-full h-full" />
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-4 sm:gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-300">{configuracion_tecnica.duracion_total}s</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full">
            <AspectRatioIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-300">{configuracion_tecnica.aspect_ratio}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full">
            <FilmIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-300">{configuracion_tecnica.resolucion}</span>
          </div>
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 text-center uppercase tracking-wider">
            Archivos Generados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleDownloadVideo} disabled={!result.videoUrl}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Descargar Video (.mp4)
            </Button>
            <Button onClick={handleDownloadScript} variant="secondary">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Descargar Guion (.json)
            </Button>
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowScript(!showScript)}
            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold transition"
          >
            {showScript ? 'Ocultar Guion' : 'Mostrar Guion Generado'}
          </button>
          {showScript && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-h-96 overflow-y-auto border border-gray-700">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {JSON.stringify(result.guion, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* "Start Over" button is now separate */}
      <Button onClick={onReset} variant="secondary" fullWidth>
        <RefreshCwIcon className="w-4 h-4 mr-2" />
        Generar Nuevo Video
      </Button>
    </div>
  );
};