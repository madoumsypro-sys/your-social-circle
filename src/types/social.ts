export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
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
