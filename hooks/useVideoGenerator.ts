import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateContent } from '../services/geminiService';
import { SCRIPT_PROMPT_TEMPLATE, VISUAL_SPECS_PROMPT_TEMPLATE } from '../utils/prompts';
import { processFilesForGemini } from '../utils/fileProcessor';
import type { UserConfig, GenerationProgress, GenerationResult, ApiError, GeneratedScript, EspecificacionesVideo, AspectRatioType } from '../types';

export function useVideoGenerator({ onApiKeyError }: { onApiKeyError: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    step: 'idle',
    percentage: 0,
    message: ''
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const generate = useCallback(async (config: UserConfig) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    // FIX: Per guidelines, ensure API key is available from the environment.
    if (!process.env.API_KEY) {
        setError({ message: 'La clave de API no está disponible. Por favor, selecciona una para continuar.' });
        setProgress({
            step: 'error',
            percentage: 0,
            message: 'Falta la clave de API.'
        });
        setIsGenerating(false);
        onApiKeyError();
        return;
    }

    try {
      // Step 1: Process Files
      setProgress({
        step: 'processing_files',
        percentage: 10,
        message: 'Procesando archivos adjuntos...'
      });
      const processedFiles = await processFilesForGemini(config.files);
      const fileContext = processedFiles
        .map(f => `Contenido del archivo "${f.name}":\n${f.content}`)
        .join('\n\n') || 'No se adjuntaron archivos.';

      // Step 2: Generate Script
      setProgress({
        step: 'generating_script',
        percentage: 25,
        message: 'Investigando datos y generando guion...'
      });
      const scriptPrompt = SCRIPT_PROMPT_TEMPLATE
        .replace('{topic}', config.topic)
        .replace('{file_summaries}', fileContext)
        .replace('{duration}', config.duration.toString())
        .replace('{tone}', config.tone);
      
      const scriptResponseText = await generateContent(scriptPrompt, processedFiles.filter(f => f.type === 'image'));
      const script: GeneratedScript = JSON.parse(scriptResponseText);

      // Step 3: Generate Visual Specs
      setProgress({
        step: 'creating_visuals',
        percentage: 55,
        message: 'Creando especificaciones visuales...'
      });

      const resolutionMap: Record<AspectRatioType, string> = {
        '16:9': '1920x1080',
        '9:16': '1080x1920',
        '1:1': '1080x1080',
      };
      const resolution = resolutionMap[config.aspectRatio];

      const visualSpecsPrompt = VISUAL_SPECS_PROMPT_TEMPLATE
        .replace('{script_json}', JSON.stringify(script, null, 2))
        .replace('{aspect_ratio}', config.aspectRatio)
        .replace('{duration}', config.duration.toString())
        .replace('{tone}', config.tone)
        .replace('{resolution}', resolution);

      const visualSpecsResponseText = await generateContent(visualSpecsPrompt);
      const specs: EspecificacionesVideo = JSON.parse(visualSpecsResponseText);

      // Step 4: Generate Video using Veo
      setProgress({
        step: 'generating_video',
        percentage: 75,
        message: 'Enviando solicitud al generador de video...'
      });
      
      // FIX: Per guidelines, instantiate the client just before the API call with the key from the environment.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const videoPrompt = `
Genera un video profesional y dinámico basado en las siguientes especificaciones detalladas.
- Título: "${script.titulo}"
- Tono general: ${config.tone}
- Estilo visual sugerido: "${script.notas_produccion.estilo_visual_sugerido}"
- Ritmo narrativo: ${script.notas_produccion.ritmo_narrativo}
- Paleta de colores principal: ${script.notas_produccion.paleta_colores.join(', ')}

La estructura del video debe seguir esta secuencia de escenas:
${specs.escenas.map((escena, index) => `
- Escena ${index + 1} (de ${escena.tiempo_inicio}s a ${escena.tiempo_fin}s): ${escena.visual.descripcion_detallada}. Incluir texto en pantalla: "${escena.texto_pantalla.contenido}". La transición a la siguiente escena es un "${escena.transicion_siguiente.tipo}".
`).join('')}

Asegúrate de que el video final sea coherente, visualmente atractivo y se ajuste a la duración total de ${config.duration} segundos.
      `.trim();
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: config.aspectRatio,
        }
      });
      
      let pollingPercentage = 78;
      while (!operation.done) {
        setProgress({
          step: 'generating_video',
          percentage: pollingPercentage,
          message: 'Renderizando el video... esto puede tardar unos minutos.'
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        if(pollingPercentage < 95) pollingPercentage += 2;
      }
      
      setProgress({
        step: 'generating_video',
        percentage: 98,
        message: 'Finalizando y descargando el video...'
      });

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error('No se pudo obtener el enlace de descarga del video.');
      }

      // FIX: Use the API key from the environment for the download request.
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!videoResponse.ok) {
        throw new Error(`Error al descargar el video: ${videoResponse.statusText}`);
      }
      const videoBlob = await videoResponse.blob();
      const videoUrl = URL.createObjectURL(videoBlob);

      // Step 5: Done
      const finalResult: GenerationResult = {
        guion: script,
        especificaciones: specs,
        videoUrl,
      };
      setResult(finalResult);
      setProgress({
        step: 'completed',
        percentage: 100,
        message: '¡Video generado exitosamente!'
      });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';

      // FIX: Handle API key errors by calling the onApiKeyError callback to prompt the user to select a new key.
      const isApiKeyError =
        errorMessage.includes('API key not valid') ||
        errorMessage.includes('API_KEY_INVALID') ||
        errorMessage.includes('Requested entity was not found') ||
        errorMessage.includes('NOT_FOUND');
      
      if (isApiKeyError) {
        setError({ message: 'La API Key no es válida para generar video o no tiene la facturación habilitada. Por favor, usa una clave de un proyecto de Google Cloud con facturación y vuelve a intentarlo.' });
        onApiKeyError();
      } else {
        setError({ message: `Error en la generación: ${errorMessage}` });
      }

      setProgress({
        step: 'error',
        percentage: 0,
        message: 'La generación falló. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [onApiKeyError]);

  const reset = useCallback(() => {
    // Revoke old blob URL if it exists to prevent memory leaks
    if (result && result.videoUrl && result.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(result.videoUrl);
    }
    setIsGenerating(false);
    setProgress({
      step: 'idle',
      percentage: 0,
      message: ''
    });
    setResult(null);
    setError(null);
  }, [result]);

  return { generate, reset, isGenerating, progress, result, error };
}