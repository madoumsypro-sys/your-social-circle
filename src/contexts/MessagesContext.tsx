import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Message, Conversation } from '@/types/social';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';

interface MessagesContextType {
  conversations: Conversation[];
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (otherUserId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  markAsRead: (conversationId: string) => void;
  getUnreadCount: () => number;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('gsh-conversations', []);
  const [messages, setMessages] = useLocalStorage<Message[]>('gsh-messages', []);

  const getConversationId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('-');
  };

  const getConversation = useCallback((otherUserId: string) => {
    if (!user) return undefined;
    const convId = getConversationId(user.id, otherUserId);
    return conversations.find(c => c.id === convId);
  }, [user, conversations]);

  const getMessages = useCallback((conversationId: string) => {
    return messages
      .filter(m => {
        const [id1, id2] = conversationId.split('-');
        return (m.senderId === id1 && m.receiverId === id2) || 
               (m.senderId === id2 && m.receiverId === id1);
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId,
      content: content.trim(),
      createdAt: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);

    const convId = getConversationId(user.id, receiverId);
    const existingConv = conversations.find(c => c.id === convId);

    if (existingConv) {
      setConversations(conversations.map(c => 
        c.id === convId 
          ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
          : c
      ));
    } else {
      const newConv: Conversation = {
        id: convId,
        participants: [user.id, receiverId],
        lastMessage: newMessage,
        updatedAt: new Date(),
      };
      setConversations([newConv, ...conversations]);
    }
  };

  const markAsRead = (conversationId: string) => {
    if (!user) return;
    setMessages(messages.map(m => {
      const [id1, id2] = conversationId.split('-');
      const belongsToConv = (m.senderId === id1 && m.receiverId === id2) || 
                            (m.senderId === id2 && m.receiverId === id1);
      if (belongsToConv && m.receiverId === user.id && !m.read) {
        return { ...m, read: true };
      }
      return m;
    }));
  };

  const getUnreadCount = useCallback(() => {
    if (!user) return 0;
    return messages.filter(m => m.receiverId === user.id && !m.read).length;
  }, [user, messages]);

  return (
    <MessagesContext.Provider value={{
      conversations,
      messages,
      sendMessage,
      getConversation,
      getMessages,
      markAsRead,
      getUnreadCount,
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
