import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, UserPlus, UserMinus, User } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Search() {
  const { user, getAllUsers, followUser, unfollowUser } = useAuth();
  const [query, setQuery] = useState('');

  const allUsers = getAllUsers();
  
  const filteredUsers = useMemo(() => {
    if (!query.trim()) return allUsers.filter(u => u.id !== user?.id);
    return allUsers.filter(u => 
      u.id !== user?.id && 
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allUsers, user?.id]);

  const isFollowing = (userId: string) => {
    return user?.following.includes(userId) ?? false;
  };

  const handleFollowToggle = (userId: string) => {
    if (isFollowing(userId)) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold">Rechercher</h1>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-2xl border-border/50 bg-card/50 pl-12 backdrop-blur-sm"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-8 text-center"
              >
                <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  {query ? 'Aucun utilisateur trouvé' : 'Aucun autre utilisateur inscrit'}
                </p>
              </motion.div>
            ) : (
              filteredUsers.map((targetUser, index) => (
                <motion.div
                  key={targetUser.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card flex items-center gap-4 rounded-2xl p-4"
                >
                  <Link to={`/user/${targetUser.id}`} className="flex flex-1 items-center gap-4">
                    <img
                      src={targetUser.avatar}
                      alt={targetUser.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="flex items-center gap-1 font-semibold truncate">
                        {targetUser.name}
                        <UserBadge userId={targetUser.id} />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {targetUser.followers.length} abonné{targetUser.followers.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                  <Button
                    size="sm"
                    variant={isFollowing(targetUser.id) ? 'outline' : 'default'}
                    onClick={() => handleFollowToggle(targetUser.id)}
                    className="gap-2 rounded-xl"
                  >
                    {isFollowing(targetUser.id) ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        <span className="hidden sm:inline">Suivi</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Suivre</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppLayout>
  );
}
