import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PostWorkoutProofProps {
  onProofSubmitted: (photoUrl: string | null) => void;
  onSkip: () => void;
}

const PostWorkoutProof = ({ onProofSubmitted, onSkip }: PostWorkoutProofProps) => {
  const { user } = useAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Could not access camera. Try uploading a photo instead.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  const uploadProof = useCallback(async () => {
    if (!capturedImage || !user) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Generate unique filename
      const filename = `${user.id}/${Date.now()}_proof.jpg`;
      
      // Upload to storage
      const { data, error: uploadError } = await supabase.storage
        .from('workout-proofs')
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the URL
      const { data: urlData } = supabase.storage
        .from('workout-proofs')
        .getPublicUrl(data.path);
      
      onProofSubmitted(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload photo. Completing without proof.');
      // Still allow completion without proof
      setTimeout(() => onProofSubmitted(null), 2000);
    } finally {
      setIsUploading(false);
    }
  }, [capturedImage, user, onProofSubmitted]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-primary uppercase">
          PROOF OF COMPLETION
        </h3>
        <p className="text-sm text-muted-foreground">
          Show us that post-workout face! Photo proof increases your credibility score.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Camera/Preview Area */}
      <div className="aspect-square max-w-sm mx-auto bg-muted border-2 border-border overflow-hidden">
        {isCapturing ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Workout proof" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Camera className="w-16 h-16" />
            <span className="text-sm uppercase tracking-widest">No photo yet</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!capturedImage && !isCapturing && (
          <>
            <Button onClick={startCamera} className="btn-terminal w-full">
              <Camera className="w-4 h-4 mr-2" />
              TAKE SELFIE
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full font-mono uppercase"
            >
              <Upload className="w-4 h-4 mr-2" />
              UPLOAD PHOTO
            </Button>
          </>
        )}

        {isCapturing && (
          <div className="flex gap-3">
            <Button onClick={capturePhoto} className="btn-terminal flex-1">
              <Camera className="w-4 h-4 mr-2" />
              CAPTURE
            </Button>
            <Button onClick={stopCamera} variant="outline" className="font-mono">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {capturedImage && !isUploading && (
          <div className="flex gap-3">
            <Button onClick={uploadProof} className="btn-terminal flex-1">
              <Check className="w-4 h-4 mr-2" />
              SUBMIT PROOF
            </Button>
            <Button onClick={retakePhoto} variant="outline" className="font-mono">
              <X className="w-4 h-4 mr-2" />
              RETAKE
            </Button>
          </div>
        )}

        {isUploading && (
          <Button disabled className="w-full">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            UPLOADING...
          </Button>
        )}

        {/* Skip option */}
        {!isUploading && (
          <Button 
            onClick={onSkip}
            variant="ghost"
            className="w-full text-muted-foreground text-xs uppercase tracking-widest"
          >
            Skip (workout marked as unverified)
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostWorkoutProof;