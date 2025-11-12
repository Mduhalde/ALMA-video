import React, { useState, useCallback } from 'react';
import type { UserConfig, ToneType, AspectRatioType } from '../types';
import { FileUploader } from './FileUploader';
import { Button } from './shared/Button';
import { Slider } from './shared/Slider';
import { ToggleGroup } from './shared/ToggleGroup';
import { Checkbox } from './shared/Checkbox';

interface InputPanelProps {
  isGenerating: boolean;
  onSubmit: (config: UserConfig) => void;
  isKeySelected: boolean;
}

const toneOptions: { value: ToneType; label: string }[] = [
  { value: 'Educativo', label: 'Educativo' },
  { value: 'Entretenido', label: 'Entretenido' },
  { value: 'Investigativo', label: 'Investigativo' },
  { value: 'Balanceado', label: 'Balanceado' },
];

const aspectRatioOptions: { value: AspectRatioType; label: string }[] = [
  { value: '16:9', label: 'Horizontal (16:9)' },
  { value: '9:16', label: 'Vertical (9:16)' },
  { value: '1:1', label: 'Cuadrado (1:1)' },
];

export const InputPanel: React.FC<InputPanelProps> = ({ isGenerating, onSubmit, isKeySelected }) => {
  const [topic, setTopic] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [duration, setDuration] = useState(75);
  const [tone, setTone] = useState<ToneType>('Balanceado');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('16:9');
  const [includeSubtitles, setIncludeSubtitles] = useState(true);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ topic, files, duration, tone, aspectRatio, includeSubtitles });
    }
  }, [topic, files, duration, tone, aspectRatio, includeSubtitles, onSubmit]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg sticky top-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
            1. Tema Principal o Artículo
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: El impacto de la inteligencia artificial en la medicina moderna..."
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                2. Archivos de Contexto (Opcional)
            </label>
            <FileUploader files={files} setFiles={setFiles} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            3. Configuración del Video
          </label>
          <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
            <Slider label="Duración" value={duration} onChange={setDuration} min={60} max={90} unit="s" />
            <ToggleGroup label="Tono" options={toneOptions} value={tone} onChange={(val) => setTone(val as ToneType)} />
            <ToggleGroup label="Formato" options={aspectRatioOptions} value={aspectRatio} onChange={(val) => setAspectRatio(val as AspectRatioType)} />
            <Checkbox label="Incluir Subtítulos" checked={includeSubtitles} onChange={setIncludeSubtitles} />
          </div>
        </div>

        <Button type="submit" disabled={isGenerating || !topic.trim() || !isKeySelected} fullWidth>
          {isGenerating ? 'Generando Video...' : 'Generar Video'}
        </Button>
      </form>
    </div>
  );
};
