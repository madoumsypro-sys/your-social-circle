import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocial } from '@/contexts/SocialContext';
import { useAuth } from '@/contexts/AuthContext';
import { StoryCircle } from './StoryCircle';
import { StoryViewer } from './StoryViewer';
import { AddStoryModal } from './AddStoryModal';
import { Story } from '@/types/social';

export function StoriesBar() {
  const { stories } = useSocial();
  const { user } = useAuth();
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter stories from last 24h
  const recentStories = stories.filter(s => {
    const storyDate = new Date(s.createdAt);
    const now = new Date();
    return now.getTime() - storyDate.getTime() < 24 * 60 * 60 * 1000;
  });

  const userHasStory = recentStories.some(s => s.user.id === user?.id);

  return (
    <>
      <div className="glass-card -mx-4 mb-6 overflow-x-auto rounded-2xl p-4">
        <div className="flex gap-4">
          {!userHasStory && (
            <StoryCircle isAddNew onClick={() => setShowAddModal(true)} />
          )}
          {recentStories.map(story => (
            <StoryCircle
              key={story.id}
              story={story}
              onClick={() => setViewingStory(story)}
            />
          ))}
          {recentStories.length === 0 && userHasStory === false && (
            <p className="flex items-center text-sm text-muted-foreground">
              Soyez le premier à partager une story !
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {viewingStory && (
          <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />
        )}
        {showAddModal && (
          <AddStoryModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
