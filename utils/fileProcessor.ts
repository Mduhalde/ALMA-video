import { ProcessedFile } from '../types';

const MAX_FILE_SIZE_MB = 10;
const MAX_TOTAL_SIZE_MB = 50;
const MAX_FILES = 5;

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // result is "data:mime/type;base64,the_base_64_string"
            // we only want "the_base_64_string"
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function processFilesForGemini(files: File[]): Promise<ProcessedFile[]> {
    if (files.length > MAX_FILES) {
        throw new Error(`No se pueden subir más de ${MAX_FILES} archivos.`);
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
        throw new Error(`El tamaño total de los archivos no puede exceder los ${MAX_TOTAL_SIZE_MB}MB.`);
    }

    const processedFiles: ProcessedFile[] = [];

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            throw new Error(`El archivo ${file.name} excede el límite de ${MAX_FILE_SIZE_MB}MB.`);
        }

        if (file.type.startsWith('image/')) {
            const base64Data = await fileToBase64(file);
            processedFiles.push({
                name: file.name,
                type: 'image',
                data: base64Data,
                mimeType: file.type
            });
        } else { // Treat as text-based (pdf, txt, docx)
             const textContent = await file.text(); // Simple text extraction
             processedFiles.push({
                name: file.name,
                type: 'text',
                content: textContent.substring(0, 50000) // Truncate for safety
            });
        }
    }
    return processedFiles;
}
