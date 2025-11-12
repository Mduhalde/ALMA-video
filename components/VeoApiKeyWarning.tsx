import React from 'react';
import { AlertTriangleIcon, ExternalLinkIcon } from './shared/Icons';
import { Button } from './shared/Button';

interface VeoApiKeyWarningProps {
  onSelectKey: () => void;
}

export const VeoApiKeyWarning: React.FC<VeoApiKeyWarningProps> = ({ onSelectKey }) => (
  <div className="bg-blue-900/30 border border-blue-600 text-blue-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
    <div className="flex">
      <div className="py-1"><AlertTriangleIcon className="h-6 w-6 text-blue-400 mr-4 flex-shrink-0" /></div>
      <div className="flex-grow">
        <p className="font-bold">Acción Requerida: Selecciona una API Key para Video</p>
        <p className="text-sm mt-1">
          La generación de video con el modelo Veo requiere una API Key de un proyecto de Google Cloud con la facturación habilitada.
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center underline hover:text-blue-100 ml-2">
            Más información
            <ExternalLinkIcon className="w-3 h-3 ml-1" />
          </a>
        </p>
      </div>
       <div className="ml-4 flex-shrink-0 self-center">
         <Button onClick={onSelectKey} variant='secondary'>Seleccionar Clave</Button>
      </div>
    </div>
  </div>
);