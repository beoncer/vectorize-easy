
import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VectorEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
}

const VectorEditor: React.FC<VectorEditorProps> = ({ isOpen, onClose, imageFile }) => {
  const [view, setView] = useState<'edit' | 'preview' | 'vectorize'>('edit');
  const [selectedFormat, setSelectedFormat] = useState<string>('svg');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Mock auth state - replace with real auth later
  
  // Generate a random ID for the image
  const imageId = React.useMemo(() => {
    return Math.random().toString(36).substring(2, 12);
  }, [imageFile]);

  // Update the URL when the editor is open
  useEffect(() => {
    if (isOpen && imageFile) {
      const url = new URL(window.location.href);
      
      if (view === 'edit') {
        url.pathname = `/images/${imageId}/edit`;
      } else if (view === 'preview') {
        url.pathname = `/images/${imageId}/preview`;
      } else if (view === 'vectorize') {
        url.pathname = `/images/${imageId}/vectorize`;
      }
      
      window.history.pushState({}, '', url.toString());
      
      return () => {
        // Reset the URL when the editor is closed
        if (window.location.pathname.includes('/images/')) {
          window.history.pushState({}, '', '/');
        }
      };
    }
  }, [isOpen, imageId, imageFile, view]);

  // Handle view changes
  const handlePreviewClick = () => {
    setView('preview');
  };

  const handleVectorizeClick = () => {
    setView('vectorize');
  };

  const handleSignUpClick = () => {
    // Mock sign-up functionality - replace with real auth later
    console.log('User clicked Sign Up');
    setIsLoggedIn(true);
  };

  const handleDownload = () => {
    if (imageFile) {
      // Create a download link for the image with the selected format
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageFile);
      link.download = `vectorized_${imageFile.name.split('.')[0]}.${selectedFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageFile) return null;

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b py-2 px-4 flex justify-between items-center">
          {view === 'edit' && (
            <div className="flex-1 flex justify-center">
              {isLoggedIn ? (
                <div className="flex space-x-4">
                  <Button
                    variant="outline" 
                    className="border-tovector-red text-black hover:bg-tovector-red/10"
                    onClick={handlePreviewClick}
                  >
                    Preview (0.2 credits)
                  </Button>
                  <Button
                    variant="outline"
                    className="border-tovector-red text-black hover:bg-tovector-red/10"
                    onClick={handleVectorizeClick}
                  >
                    Vectorize (1 credit)
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-tovector-red text-black hover:bg-tovector-red/90"
                  onClick={handleSignUpClick}
                >
                  Sign Up and Get 1 Free Preview
                </Button>
              )}
            </div>
          )}
          {view !== 'edit' && (
            <div className="flex-1"></div> // Empty div to maintain space in the flex layout
          )}
          <button 
            onClick={onClose} 
            className="text-tovector-red hover:bg-tovector-red/10 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center bg-white p-6 h-[80vh] overflow-auto">
          {/* Image display */}
          <div className="flex-1 flex items-center justify-center w-full">
            <img 
              src={imageUrl} 
              alt={view === 'vectorize' ? "Vectorized result" : "Original image"} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Action buttons based on view state */}
          {view === 'preview' && (
            <div className="mt-6">
              <Button
                className="bg-tovector-red text-black hover:bg-tovector-red/90"
                onClick={handleVectorizeClick}
              >
                Vectorize (1 credit)
              </Button>
            </div>
          )}
          
          {view === 'vectorize' && (
            <div className="mt-6 flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="w-32 border-tovector-red">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SVG">SVG</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EPS">EPS</SelectItem>
                      <SelectItem value="DXF">DXF</SelectItem>
                      <SelectItem value="PNG">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-tovector-red text-black hover:bg-tovector-red/90"
                    onClick={handleDownload}
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-tovector-red text-black hover:bg-tovector-red/90"
                  onClick={handleDownload}
                >
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VectorEditor;
