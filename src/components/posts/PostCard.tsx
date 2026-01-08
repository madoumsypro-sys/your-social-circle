import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { Post } from '@/types/social';
import { useSocial } from '@/contexts/SocialContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { likePost, addComment, deletePost } = useSocial();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isLiked = user ? post.likedBy.includes(user.id) : false;
  const isOwner = user?.id === post.user.id;

  const handleLike = () => {
    likePost(post.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      addComment(post.id, newComment);
      setNewComment('');
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{post.user.name}</h3>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {isOwner && (
          <button
            onClick={() => deletePost(post.id)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full object-cover"
          style={{ maxHeight: '400px' }}
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 p-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="flex items-center gap-2"
        >
          <Heart
            className={`h-6 w-6 transition-colors ${
              isLiked ? 'fill-accent text-accent' : 'text-muted-foreground'
            }`}
          />
          <span className="text-sm font-medium">{post.likes}</span>
        </motion.button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-border/50 p-4"
        >
          {/* Comment Input */}
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              className="flex-1"
            />
            <button
              onClick={handleComment}
              disabled={!newComment.trim()}
              className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1 rounded-2xl bg-muted/50 p-3">
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Aucun commentaire pour l'instant
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
