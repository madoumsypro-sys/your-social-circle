import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Send, X, Upload } from 'lucide-react';
import { useSocial } from '@/contexts/SocialContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function CreatePost() {
  const { addPost } = useSocial();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setShowImageInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      addPost(content, preview || imageUrl || undefined);
      setContent('');
      setImageUrl('');
      setPreview(null);
      setShowImageInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mb-6 rounded-3xl p-4"
    >
      <div className="flex gap-3">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Quoi de neuf ?"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
          />

          {/* Image Preview */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-full rounded-2xl object-cover"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          {/* Image URL Input */}
          {showImageInput && !preview && (
            <div className="flex gap-2">
              <Input
                placeholder="URL de l'image"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => setShowImageInput(false)}
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <label className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <button
                onClick={() => setShowImageInput(!showImageInput)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Image className="h-5 w-5" />
              </button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="btn-gradient gap-2"
            >
              <Send className="h-4 w-4" />
              Publier
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
