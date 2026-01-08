import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    const updates: { name?: string; avatar?: string } = {};
    
    if (name.trim() && name !== user?.name) {
      updates.name = name.trim();
    }
    
    const newAvatar = preview || avatarUrl;
    if (newAvatar && newAvatar !== user?.avatar) {
      updates.avatar = newAvatar;
    }

    if (Object.keys(updates).length > 0) {
      updateProfile(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const displayAvatar = preview || avatarUrl || user?.avatar;

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/profile"
            className="rounded-full p-2 hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>

        <div className="glass-card rounded-3xl p-6">
          {/* Avatar Section */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={displayAvatar}
                alt="Avatar"
                className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/30"
              />
              {preview && (
                <button
                  onClick={() => setPreview(null)}
                  className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <label className="btn-gradient flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-white">
              <Upload className="h-4 w-4" />
              Changer la photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pseudo</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ton pseudo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar-url">URL de l'avatar (optionnel)</Label>
              <Input
                id="avatar-url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {saved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600"
              >
                <Check className="h-4 w-4" />
                Profil mis à jour avec succès !
              </motion.p>
            )}

            <Button
              onClick={handleSave}
              className="btn-gradient w-full"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
