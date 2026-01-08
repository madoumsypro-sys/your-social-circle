import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image, Send, X, Upload } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSocial } from '@/contexts/SocialContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function Create() {
  const navigate = useNavigate();
  const { addPost } = useSocial();
  const { user } = useAuth();
  const [content, setContent] = useState('');
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
    if (content.trim()) {
      addPost(content, preview || imageUrl || undefined);
      navigate('/feed');
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-6 text-2xl font-bold">Nouvelle publication</h1>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <span className="font-semibold">{user?.name}</span>
          </div>

          <Textarea
            placeholder="Quoi de neuf ?"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="mb-4 min-h-[150px] resize-none border-0 bg-muted/50 text-lg focus-visible:ring-1"
          />

          {/* Image Preview */}
          {preview && (
            <div className="relative mb-4">
              <img
                src={preview}
                alt="Preview"
                className="h-60 w-full rounded-2xl object-cover"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-2"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          {/* Image URL Input */}
          {!preview && (
            <div className="mb-4">
              <div className="relative">
                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="URL de l'image (optionnel)"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <Upload className="h-4 w-4" />
              Télécharger
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

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
      </motion.div>
    </AppLayout>
  );
}
