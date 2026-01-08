import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMessages } from '@/contexts/MessagesContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Messages() {
  const { conversations } = useMessages();
  const { getAllUsers, user } = useAuth();
  const [search, setSearch] = useState('');

  const allUsers = getAllUsers().filter(u => u.id !== user?.id);
  
  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const getOtherUser = (participants: string[]) => {
    const otherId = participants.find(id => id !== user?.id);
    return allUsers.find(u => u.id === otherId);
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24">
        <div className="mx-auto max-w-lg px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-2xl font-bold text-foreground"
          >
            Messages
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 glass-card"
            />
          </motion.div>

          {search ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Démarrer une conversation</p>
              {filteredUsers.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/chat/${u.id}`}
                    className="flex items-center gap-3 p-3 glass-card rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {u.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">Démarrer une conversation</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun utilisateur trouvé
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedConversations.length > 0 ? (
                sortedConversations.map((conv, index) => {
                  const otherUser = getOtherUser(conv.participants);
                  if (!otherUser) return null;

                  return (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/chat/${otherUser.id}`}
                        className="flex items-center gap-3 p-3 glass-card rounded-xl hover:bg-primary/5 transition-colors"
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{otherUser.name}</p>
                          {conv.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.senderId === user?.id ? 'Vous: ' : ''}
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { 
                              addSuffix: false,
                              locale: fr 
                            })}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune conversation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recherchez un utilisateur pour démarrer
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
