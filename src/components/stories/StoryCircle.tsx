import { motion } from 'framer-motion';
import { Story } from '@/types/social';
import { Plus } from 'lucide-react';

interface StoryCircleProps {
  story?: Story;
  isAddNew?: boolean;
  onClick: () => void;
}

export function StoryCircle({ story, isAddNew, onClick }: StoryCircleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div className={`story-ring ${story?.viewed ? 'opacity-50' : ''}`}>
        <div className="h-16 w-16 overflow-hidden rounded-full bg-card">
          {isAddNew ? (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Plus className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <img
              src={story?.user.avatar}
              alt={story?.user.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
      <span className="max-w-[72px] truncate text-xs font-medium text-foreground">
        {isAddNew ? 'Ajouter' : story?.user.name}
      </span>
    </motion.button>
  );
}
