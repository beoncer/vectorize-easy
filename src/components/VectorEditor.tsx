
import React, { useState } from 'react';
import { X, Download, PaintBucket, Minimize, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VectorEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
}

const VectorEditor: React.FC<VectorEditorProps> = ({ isOpen, onClose, imageFile }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'options'>('preview');
  const [options, setOptions] = useState({
    colors: 5,
    simplify: 50,
    smoothing: 50
  });

  // Generate a random ID for the image
  const imageId = React.useMemo(() => {
    return Math.random().toString(36).substring(2, 12);
  }, [imageFile]);

  // Update the URL when the editor is open
  React.useEffect(() => {
    if (isOpen && imageFile) {
      const url = new URL(window.location.href);
      url.pathname = `/images/${imageId}/edit`;
      window.history.pushState({}, '', url.toString());
      
      return () => {
        // Reset the URL when the editor is closed
        if (window.location.pathname.includes('/images/')) {
          window.history.pushState({}, '', '/');
        }
      };
    }
  }, [isOpen, imageId, imageFile]);

  const handleOptionChange = (option: keyof typeof options, value: number) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleDownload = () => {
    console.log("Downloading vector with options:", options);
    // In a real app, this would trigger the actual download
    alert("Vector file download started!");
  };

  if (!imageFile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold">Vector Editor</DialogTitle>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Preview Panel */}
          <div className="col-span-2 p-6 flex flex-col space-y-4">
            <div className="bg-gray-50 rounded-lg flex justify-center items-center h-[400px]">
              {/* Original Image Preview */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Original" 
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                  Original
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg flex justify-center items-center h-[400px]">
              {/* Vectorized Preview (simulated) */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Edit3 size={48} className="mx-auto mb-2 text-tovector-red" />
                    <p>Vectorized Preview</p>
                    <p className="text-sm">(Simulated for demo)</p>
                  </div>
                </div>
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Vectorized" 
                  className="max-w-full max-h-full object-contain opacity-60"
                />
                <div className="absolute bottom-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                  Vector
                </div>
              </div>
            </div>
          </div>
          
          {/* Options Panel */}
          <div className="border-l p-6 space-y-6">
            <div>
              <h3 className="font-bold mb-2">File Information</h3>
              <p className="text-sm text-gray-600">{imageFile.name}</p>
              <p className="text-sm text-gray-600">
                {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Adjust Options</h3>
              
              {/* Colors Option */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label htmlFor="colors" className="text-sm font-medium">
                    <PaintBucket size={16} className="inline mr-1" /> Colors: {options.colors}
                  </label>
                </div>
                <input
                  id="colors"
                  type="range"
                  min="2"
                  max="16"
                  value={options.colors}
                  onChange={(e) => handleOptionChange('colors', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Simplify Paths Option */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label htmlFor="simplify" className="text-sm font-medium">
                    <Minimize size={16} className="inline mr-1" /> Simplify Paths: {options.simplify}%
                  </label>
                </div>
                <input
                  id="simplify"
                  type="range"
                  min="0"
                  max="100"
                  value={options.simplify}
                  onChange={(e) => handleOptionChange('simplify', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Smoothing Option */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label htmlFor="smoothing" className="text-sm font-medium">
                    <Edit3 size={16} className="inline mr-1" /> Smoothing: {options.smoothing}%
                  </label>
                </div>
                <input
                  id="smoothing"
                  type="range"
                  min="0"
                  max="100"
                  value={options.smoothing}
                  onChange={(e) => handleOptionChange('smoothing', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <button 
              onClick={handleDownload}
              className="btn-primary w-full py-3 flex items-center justify-center"
            >
              <Download size={18} className="mr-2" />
              Download Vector (SVG)
            </button>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Using 1 credit for this conversion</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VectorEditor;
