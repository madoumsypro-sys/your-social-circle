import { Bot, BadgeCheck } from 'lucide-react';

interface UserBadgeProps {
  userId: string;
  className?: string;
}

export function UserBadge({ userId, className = '' }: UserBadgeProps) {
  const isBot = userId.startsWith('bot-');

  if (isBot) {
    return (
      <Bot className={`inline-block h-4 w-4 text-muted-foreground ${className}`} aria-label="Compte robot" />
    );
  }

  return (
    <BadgeCheck className={`inline-block h-4 w-4 text-sky-500 ${className}`} aria-label="Compte vérifié" />
  );
}
