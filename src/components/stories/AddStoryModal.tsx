import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image, Upload } from 'lucide-react';
import { useSocial } from '@/contexts/SocialContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddStoryModalProps {
  onClose: () => void;
}

export function AddStoryModal({ onClose }: AddStoryModalProps) {
  const { addStory } = useSocial();
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const image = preview || imageUrl;
    if (image) {
      addStory(image);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-md rounded-3xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nouvelle Story</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="h-64 w-full rounded-2xl object-cover"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ) : (
            <>
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Cliquez pour télécharger une image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Image className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ou collez une URL d'image"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!preview && !imageUrl}
            className="btn-gradient w-full"
          >
            Publier la story
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
