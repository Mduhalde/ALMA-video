import React from 'react';
import { AlertTriangleIcon } from './shared/Icons';

export const ApiKeyWarning: React.FC = () => (
  <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
    <div className="flex">
      <div className="py-1"><AlertTriangleIcon className="h-6 w-6 text-yellow-400 mr-4 flex-shrink-0" /></div>
      <div>
        <p className="font-bold">Acción Requerida: API Key no configurada</p>
        <p className="text-sm">
          La variable de entorno API_KEY no se ha encontrado. Para utilizar la aplicación,
          por favor, asegúrate de que la API Key de Google Gemini esté correctamente configurada en tu entorno.
        </p>
      </div>
    </div>
  </div>
);
