
import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { deductCredits } from '@/lib/supabase';

interface VectorEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
}

const VectorEditor: React.FC<VectorEditorProps> = ({ isOpen, onClose, imageFile }) => {
  const [view, setView] = useState<'edit' | 'preview' | 'vectorize'>('edit');
  const [selectedFormat, setSelectedFormat] = useState<string>('svg');
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn, userId, credits, refreshCredits } = useAuth();
  
  // Generate a random ID for the image or use the one from URL
  const imageId = React.useMemo(() => {
    return params.imageId || Math.random().toString(36).substring(2, 12);
  }, [params.imageId]);

  // Set the view based on URL params
  useEffect(() => {
    if (params.action) {
      if (params.action === 'preview') {
        setView('preview');
      } else if (params.action === 'vectorize') {
        setView('vectorize');
      } else {
        setView('edit');
      }
    }
  }, [params.action]);

  // Update the URL when the editor is open
  useEffect(() => {
    if (isOpen && imageFile) {
      updateUrlPath();
      
      return () => {
        // Reset the URL when the editor is closed
        if (window.location.pathname.includes('/images/')) {
          window.history.pushState({}, '', '/');
        }
      };
    }
  }, [isOpen, imageId, imageFile, view]);

  const updateUrlPath = () => {
    if (view === 'edit') {
      navigate(`/images/${imageId}/edit`, { replace: true });
    } else if (view === 'preview') {
      navigate(`/images/${imageId}/preview`, { replace: true });
    } else if (view === 'vectorize') {
      navigate(`/images/${imageId}/vectorize`, { replace: true });
    }
  };

  // Handle view changes
  const handlePreviewClick = async () => {
    if (!isLoggedIn) {
      navigate('/sign-up');
      return;
    }

    if (credits < 0.2) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 0.2 credits to preview. Please purchase more credits.",
        variant: "destructive"
      });
      return;
    }

    // Deduct credits for preview
    if (userId) {
      const success = await deductCredits(userId, 0.2, 'preview');
      if (success) {
        setView('preview');
        updateUrlPath();
        // Refresh user credits
        refreshCredits();
      } else {
        toast({
          title: "Error",
          description: "Failed to deduct credits. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleVectorizeClick = async () => {
    if (!isLoggedIn) {
      navigate('/sign-up');
      return;
    }

    if (credits < 1) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 1 credit to vectorize. Please purchase more credits.",
        variant: "destructive"
      });
      return;
    }

    // Deduct credits for vectorization
    if (userId) {
      const success = await deductCredits(userId, 1, 'vectorize');
      if (success) {
        setView('vectorize');
        updateUrlPath();
        // Refresh user credits
        refreshCredits();
      } else {
        toast({
          title: "Error",
          description: "Failed to deduct credits. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
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

      toast({
        title: "Download started",
        description: `Your file is being downloaded as ${selectedFormat.toUpperCase()}`,
      });
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
