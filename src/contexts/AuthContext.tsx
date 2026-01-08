import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/social';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<{ email: string; password: string; user: User }[]>('gsh-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('gsh-current-user', null);
  const [error, setError] = useState<string | null>(null);

  const login = (email: string, password: string): boolean => {
    setError(null);
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setCurrentUser(foundUser.user);
      return true;
    }
    setError('Email ou mot de passe incorrect');
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    setError(null);
    if (users.some(u => u.email === email)) {
      setError('Cet email est déjà utilisé');
      return false;
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: DEFAULT_AVATAR,
    };
    setUsers([...users, { email, password, user: newUser }]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => 
      u.user.id === currentUser.id 
        ? { ...u, user: updatedUser }
        : u
    ));
  };

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      isAuthenticated: !!currentUser,
      login,
      register,
      logout,
      updateProfile,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
