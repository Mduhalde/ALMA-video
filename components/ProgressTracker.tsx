import React from 'react';
import type { GenerationProgress, GenerationStep } from '../types';

interface ProgressTrackerProps {
  progress: GenerationProgress;
}

const stepConfig: Record<GenerationStep, { title: string; order: number }> = {
  idle: { title: 'Iniciando', order: 0 },
  processing_files: { title: 'Procesando archivos', order: 1 },
  generating_script: { title: 'Generando guion', order: 2 },
  creating_visuals: { title: 'Creando visuales', order: 3 },
  generating_video: { title: 'Renderizando video', order: 4 },
  completed: { title: 'Completado', order: 5 },
  error: { title: 'Error', order: 5 },
};


export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const currentStepOrder = stepConfig[progress.step].order;

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-center mb-2">Generando tu video...</h3>
      <p className="text-center text-gray-400 mb-6">{progress.message}</p>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
            className="bg-gradient-to-r from-blue-500 to-green-400 h-2.5 rounded-full transition-all duration-500" 
            style={{width: `${progress.percentage}%`}}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        {Object.values(stepConfig)
            .filter(step => step.order > 0 && step.order < 5)
            .map(step => (
                <div key={step.order} className={`text-center ${step.order <= currentStepOrder ? 'text-gray-300 font-medium' : ''}`}>
                    {step.title}
                </div>
            ))
        }
      </div>
    </div>
  );
};
