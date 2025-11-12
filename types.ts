// types.ts

// --- User Input and Configuration ---

export type ToneType = 'Educativo' | 'Entretenido' | 'Investigativo' | 'Balanceado';
export type AspectRatioType = '16:9' | '9:16' | '1:1';

export interface UserConfig {
  topic: string;
  files: File[];
  duration: number;
  tone: ToneType;
  aspectRatio: AspectRatioType;
  includeSubtitles: boolean;
}

export interface ProcessedFile {
  name: string;
  type: 'pdf' | 'image' | 'text';
  content?: string; // For text-based files
  data?: string;    // For base64 encoded files (images)
  mimeType?: string;// Mime type for inlineData
}


// --- Generation Process State ---

export type GenerationStep = 'idle' | 'processing_files' | 'generating_script' | 'creating_visuals' | 'generating_video' | 'completed' | 'error';

export interface GenerationProgress {
  step: GenerationStep;
  percentage: number;
  message: string;
}

export interface ApiError {
  message: string;
}


// --- Generated Content Interfaces (based on prompt JSON structure) ---

export interface GeneratedScript {
  titulo: string;
  gancho_principal: string;
  estructura: {
    hook: {
      tiempo: string;
      texto_narrador: string;
      descripcion_visual: string;
    };
    desarrollo: {
      seccion: number;
      tiempo: string;
      texto_narrador: string;
      descripcion_visual: string;
    }[];
    climax: {
      tiempo: string;
      texto_narrador: string;
      descripcion_visual: string;
    };
    cierre: {
      tiempo: string;
      texto_narrador: string;
      descripcion_visual: string;
      call_to_action: string;
    };
  };
  metadatos: {
    dato_mas_sorprendente: string;
    fuentes: string[];
    angulo_unico: string;
    palabras_clave: string[];
  };
  notas_produccion: {
    estilo_visual_sugerido: string;
    paleta_colores: string[];
    musica_sugerida: string;
    ritmo_narrativo: string;
  };
}

export interface EspecificacionesVideo {
  configuracion_tecnica: {
    resolucion: string;
    fps: number;
    aspect_ratio: string;
    duracion_total: number;
  };
  escenas: {
    id: string;
    tiempo_inicio: number;
    tiempo_fin: number;
    visual: {
      descripcion_detallada: string;
      color_grading: {
        paleta_dominante: string[];
      };
    };
    audio: {
      narracion: {
        texto: string;
      };
    };
    texto_pantalla: {
      contenido: string;
      tipografia: {
        fuente: string;
      };
    };
    transicion_siguiente: {
      tipo: string;
    };
  }[];
  estilo_global: {
    identidad_visual: {
      paleta_primaria: string[];
    };
  };
}

export interface GenerationResult {
  guion: GeneratedScript;
  especificaciones: EspecificacionesVideo;
  videoUrl?: string;
}
