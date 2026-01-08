import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { StoriesBar } from '@/components/stories/StoriesBar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { useSocial } from '@/contexts/SocialContext';

export default function Feed() {
  const { posts } = useSocial();

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-6 text-2xl font-bold">
          <span className="gradient-text">GSH Social</span>
        </h1>

        <StoriesBar />
        <CreatePost />

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Aucune publication pour l'instant
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sois le premier à partager quelque chose !
              </p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
