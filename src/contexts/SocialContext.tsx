import React, { createContext, useContext, ReactNode } from 'react';
import { Post, Story } from '@/types/social';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';

interface SocialContextType {
  posts: Post[];
  stories: Story[];
  addPost: (content: string, image?: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  addStory: (image: string) => void;
  viewStory: (storyId: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useLocalStorage<Post[]>('gsh-posts', []);
  const [stories, setStories] = useLocalStorage<Story[]>('gsh-stories', []);

  const addPost = (content: string, image?: string) => {
    if (!user || !content.trim()) return;
    const newPost: Post = {
      id: crypto.randomUUID(),
      content,
      image,
      likes: 0,
      likedBy: [],
      comments: [],
      user,
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    if (!user) return;
    setPosts(posts.filter(p => p.id !== postId || p.user.id !== user.id));
  };

  const likePost = (postId: string) => {
    if (!user) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likedBy.includes(user.id);
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked 
            ? post.likedBy.filter(id => id !== user.id)
            : [...post.likedBy, user.id],
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!user || !content.trim()) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: crypto.randomUUID(),
            content,
            user,
            createdAt: new Date(),
          }],
        };
      }
      return post;
    }));
  };

  const addStory = (image: string) => {
    if (!user) return;
    const newStory: Story = {
      id: crypto.randomUUID(),
      user,
      image,
      createdAt: new Date(),
      viewed: false,
    };
    // Remove old story from same user
    const filteredStories = stories.filter(s => s.user.id !== user.id);
    setStories([newStory, ...filteredStories]);
  };

  const viewStory = (storyId: string) => {
    setStories(stories.map(s => 
      s.id === storyId ? { ...s, viewed: true } : s
    ));
  };

  return (
    <SocialContext.Provider value={{
      posts,
      stories,
      addPost,
      deletePost,
      likePost,
      addComment,
      addStory,
      viewStory,
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}
