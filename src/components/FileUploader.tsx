
import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import VectorEditor from './VectorEditor';

interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();

  // Check if we're on an image edit/preview/vectorize route
  useEffect(() => {
    if (params.imageId && params.action && selectedFile) {
      setIsEditorOpen(true);
    }
  }, [params.imageId, params.action, selectedFile]);

  const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload PNG or JPG files only');
      return false;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 35MB');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
        // Automatically open the editor when file is selected
        setIsEditorOpen(true);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
        // Automatically open the editor when file is selected
        setIsEditorOpen(true);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    // Reset the URL when the editor is closed
    if (window.location.pathname.includes('/images/')) {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center 
          ${isDragging 
            ? 'border-tovector-red bg-tovector-red/5 animate-pulse-glow' 
            : selectedFile 
              ? 'border-green-500 bg-green-500/5' 
              : 'border-gray-300 hover:border-tovector-red hover:bg-tovector-red/5'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input 
          type="file" 
          className="hidden" 
          accept=".png,.jpg,.jpeg" 
          ref={fileInputRef}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload 
            size={48} 
            className={`${selectedFile ? 'text-green-500' : 'text-tovector-red'} animate-float`}
          />
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-black">
              {selectedFile ? selectedFile.name : 'Drag and drop your image here'}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedFile 
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                : 'PNG or JPG (max 35MB)'
              }
            </p>
            {!selectedFile && (
              <button 
                type="button" 
                className="mt-2 px-4 py-2 inline-flex items-center text-sm font-medium rounded-md text-black bg-tovector-red hover:bg-tovector-red/90"
              >
                Browse Files
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="absolute bottom-3 left-0 right-0 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      <VectorEditor 
        isOpen={isEditorOpen} 
        onClose={handleEditorClose} 
        imageFile={selectedFile} 
      />
    </div>
  );
};

export default FileUploader;
