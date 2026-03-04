import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';
import { Story } from '@/types/social';
import { useSocial } from '@/contexts/SocialContext';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

export function StoryViewer({ story, onClose }: StoryViewerProps) {
  const { viewStory } = useSocial();

  useEffect(() => {
    viewStory(story.id);
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [story.id, onClose, viewStory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative h-[80vh] w-full max-w-md overflow-hidden rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute left-4 right-4 top-4 z-10 h-1 overflow-hidden rounded-full bg-white/30">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-white"
          />
        </div>

        {/* Header */}
        <div className="absolute left-4 right-4 top-8 z-10 flex items-center gap-3">
          <img
            src={story.user.avatar}
            alt={story.user.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
          <span className="flex items-center gap-1 font-medium text-white">
            {story.user.name}
            <UserBadge userId={story.user.id} className="text-white/80" />
          </span>
          <button
            onClick={onClose}
            className="ml-auto rounded-full bg-white/20 p-2 backdrop-blur-sm"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Story image */}
        <img
          src={story.image}
          alt="Story"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
