export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  content: string;
  image?: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  user: User;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: Date;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  createdAt: Date;
  viewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}
