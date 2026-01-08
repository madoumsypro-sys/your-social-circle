import { Home, PlusSquare, User, Search, MessageCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessages } from '@/contexts/MessagesContext';

const navItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: Search, label: 'Rechercher', path: '/search' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: PlusSquare, label: 'Créer', path: '/create' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const { getUnreadCount } = useMessages();
  const unreadCount = getUnreadCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-4 py-2 safe-area-pb">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          const showBadge = path === '/messages' && unreadCount > 0;
          return (
            <NavLink
              key={path}
              to={path}
              className="relative flex flex-col items-center gap-1 p-2"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative">
                <Icon 
                  className={`relative z-10 h-6 w-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span 
                className={`relative z-10 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
