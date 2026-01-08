import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSocial } from '@/contexts/SocialContext';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { posts } = useSocial();

  const userPosts = posts.filter(p => p.user.id === user?.id);
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <div className="glass-card mb-6 rounded-3xl p-6 text-center">
          <motion.img
            src={user?.avatar}
            alt={user?.name}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-primary/30"
            whileHover={{ scale: 1.05 }}
          />
          <h1 className="mb-1 text-2xl font-bold">{user?.name}</h1>
          <p className="mb-4 text-sm text-muted-foreground">{user?.email}</p>

          {/* Stats */}
          <div className="mb-6 flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userPosts.length}</p>
              <p className="text-sm text-muted-foreground">Publications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{user?.followers?.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user?.following?.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Abonnements</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/search">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Trouver des amis
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* User Posts */}
        <h2 className="mb-4 text-lg font-semibold">Mes publications</h2>
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <p className="text-muted-foreground">
                Tu n'as pas encore publié de contenu
              </p>
            </div>
          ) : (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
