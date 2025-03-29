import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

interface ImageUploaderProps {
  onUploadSuccess?: (imageData: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if user is logged in
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PNG and JPG files are allowed.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 35MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      toast({
        title: "Success",
        description: data.message,
      });

      if (onUploadSuccess) {
        onUploadSuccess(data.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [isLoggedIn, navigate, onUploadSuccess, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-tovector-red bg-tovector-red/5' 
            : 'border-gray-300 hover:border-tovector-red/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG or JPG up to 35MB
            </p>
          </div>
          {isUploading && (
            <div className="flex items-center space-x-2 text-tovector-red">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tovector-red"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 