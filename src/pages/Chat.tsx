import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMessages } from '@/contexts/MessagesContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Chat() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, getAllUsers } = useAuth();
  const { getConversation, getMessages, sendMessage, markAsRead } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = getAllUsers().find(u => u.id === userId);
  const conversation = userId ? getConversation(userId) : undefined;
  const messages = conversation ? getMessages(conversation.id) : [];

  useEffect(() => {
    if (conversation) {
      markAsRead(conversation.id);
    }
  }, [conversation, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!newMessage.trim() || !userId) return;
    sendMessage(userId, newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-border/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-50"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/messages')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link to={`/user/${otherUser.id}`} className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={otherUser.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
              {otherUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="flex items-center gap-1 font-semibold">
              {otherUser.name}
              <UserBadge userId={otherUser.id} />
            </p>
            <p className="text-xs text-muted-foreground">Voir le profil</p>
          </div>
        </Link>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-primary/20">
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                {otherUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="flex items-center gap-1 font-semibold text-lg">
              {otherUser.name}
              <UserBadge userId={otherUser.id} />
            </p>
            <p className="text-muted-foreground mt-1">
              Démarrez la conversation !
            </p>
          </motion.div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.senderId === user?.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, x: isOwn ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                      : 'glass-card rounded-bl-sm'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isOwn ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-t border-border/50 px-4 py-3 safe-area-pb"
      >
        <div className="flex items-center gap-2">
          <Input
            placeholder="Votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="shrink-0 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
