import React, { useCallback, useState } from 'react';
import { UploadCloudIcon, FileIcon, XIcon } from './shared/Icons';

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, setFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, [setFiles]);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-brand-blue bg-blue-900/20' : 'border-gray-600 bg-gray-900 hover:bg-gray-700/50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloudIcon className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click para subir</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500">PDF, TXT, JPG, PNG (máx. 5 archivos)</p>
        </div>
        <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
      </label>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md text-sm">
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate text-gray-300">{file.name}</span>
              </div>
              <button onClick={() => removeFile(index)} className="p-1 rounded-full hover:bg-gray-600">
                <XIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
