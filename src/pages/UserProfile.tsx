import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSocial } from '@/contexts/SocialContext';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, getAllUsers, followUser, unfollowUser } = useAuth();
  const { posts } = useSocial();

  const allUsers = getAllUsers();
  const targetUser = allUsers.find(u => u.id === userId);

  if (!targetUser) {
    return (
      <AppLayout>
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="text-muted-foreground">Utilisateur non trouvé</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Retour
          </Button>
        </div>
      </AppLayout>
    );
  }

  const userPosts = posts.filter(p => p.user.id === targetUser.id);
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);
  const isFollowing = user?.following.includes(targetUser.id) ?? false;
  const isOwnProfile = user?.id === targetUser.id;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(targetUser.id);
    } else {
      followUser(targetUser.id);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Profile Header */}
        <div className="glass-card mb-6 rounded-3xl p-6 text-center">
          <motion.img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-primary/30"
            whileHover={{ scale: 1.05 }}
          />
          <h1 className="mb-1 text-2xl font-bold">{targetUser.name}</h1>

          {/* Stats */}
          <div className="mb-6 flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userPosts.length}</p>
              <p className="text-sm text-muted-foreground">Publications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{targetUser.followers.length}</p>
              <p className="text-sm text-muted-foreground">Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{targetUser.following.length}</p>
              <p className="text-sm text-muted-foreground">Abonnements</p>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && (
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? 'outline' : 'default'}
              className="gap-2 rounded-xl"
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  Ne plus suivre
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Suivre
                </>
              )}
            </Button>
          )}
        </div>

        {/* User Posts */}
        <h2 className="mb-4 text-lg font-semibold">Publications</h2>
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <p className="text-muted-foreground">
                Aucune publication
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
