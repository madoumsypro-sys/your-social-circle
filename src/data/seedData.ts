import { User, Post, Story } from '@/types/social';

// Bot users with realistic profiles
export const BOT_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'emma.martin@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-emma',
      name: 'Emma Martin',
      email: 'emma.martin@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      bio: 'Photographe passionnée 📸 | Paris',
      followers: [],
      following: [],
    },
  },
  {
    email: 'lucas.dubois@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-lucas',
      name: 'Lucas Dubois',
      email: 'lucas.dubois@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      bio: 'Développeur web 💻 | Tech enthusiast',
      followers: [],
      following: [],
    },
  },
  {
    email: 'sophie.bernard@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-sophie',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      bio: 'Designer UI/UX ✨ | Créative',
      followers: [],
      following: [],
    },
  },
  {
    email: 'thomas.petit@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-thomas',
      name: 'Thomas Petit',
      email: 'thomas.petit@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      bio: 'Voyageur 🌍 | Amateur de café ☕',
      followers: [],
      following: [],
    },
  },
  {
    email: 'camille.leroy@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-camille',
      name: 'Camille Leroy',
      email: 'camille.leroy@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      bio: 'Foodie 🍜 | Lyon',
      followers: [],
      following: [],
    },
  },
  {
    email: 'maxime.moreau@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-maxime',
      name: 'Maxime Moreau',
      email: 'maxime.moreau@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      bio: 'Gamer 🎮 | Streamer',
      followers: [],
      following: [],
    },
  },
  {
    email: 'julie.simon@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-julie',
      name: 'Julie Simon',
      email: 'julie.simon@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      bio: 'Fitness addict 💪 | Coach sportif',
      followers: [],
      following: [],
    },
  },
  {
    email: 'antoine.garcia@gsh.com',
    password: 'bot123',
    user: {
      id: 'bot-antoine',
      name: 'Antoine Garcia',
      email: 'antoine.garcia@gsh.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      bio: 'Musicien 🎸 | Marseille',
      followers: [],
      following: [],
    },
  },
];

// Create interconnections between bots
BOT_USERS.forEach((botData, index) => {
  // Each bot follows 3-5 other bots
  const otherBots = BOT_USERS.filter((_, i) => i !== index);
  const followCount = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...otherBots].sort(() => 0.5 - Math.random());
  
  shuffled.slice(0, followCount).forEach(targetBot => {
    botData.user.following.push(targetBot.user.id);
    targetBot.user.followers.push(botData.user.id);
  });
});

// Bot posts with engaging content
export const BOT_POSTS: Post[] = [
  {
    id: 'post-1',
    content: "Belle journée pour une session photo au Trocadéro ! 📸 La lumière était parfaite ce matin. Qui veut voir les résultats ? #Paris #Photography",
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    likes: 42,
    likedBy: ['bot-lucas', 'bot-sophie', 'bot-thomas'],
    comments: [
      {
        id: 'comment-1',
        content: 'Magnifique ! Tu as un talent fou 🔥',
        user: BOT_USERS[1].user,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'comment-2',
        content: 'Hâte de voir ça !',
        user: BOT_USERS[2].user,
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    user: BOT_USERS[0].user,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'post-2',
    content: "Nouveau projet React lancé ! 🚀 Après des semaines de planification, on passe enfin au code. Stack : React + TypeScript + Tailwind. Qui est dans la tech ici ?",
    likes: 28,
    likedBy: ['bot-emma', 'bot-sophie'],
    comments: [
      {
        id: 'comment-3',
        content: 'Belle stack ! Tu utilises Vite aussi ?',
        user: BOT_USERS[2].user,
        createdAt: new Date(Date.now() - 5400000),
      },
    ],
    user: BOT_USERS[1].user,
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: 'post-3',
    content: "Design du jour ✨ Travail sur une nouvelle interface pour une app de méditation. Les couleurs douces, ça change tout pour l'UX !",
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    likes: 67,
    likedBy: ['bot-emma', 'bot-lucas', 'bot-camille', 'bot-julie'],
    comments: [
      {
        id: 'comment-4',
        content: 'Les gradients sont parfaits ! 💜',
        user: BOT_USERS[0].user,
        createdAt: new Date(Date.now() - 10800000),
      },
    ],
    user: BOT_USERS[2].user,
    createdAt: new Date(Date.now() - 21600000),
  },
  {
    id: 'post-4',
    content: "Café ☕ + Vue sur la montagne 🏔️ = Télétravail parfait ! Qui d'autre travaille depuis un endroit insolite aujourd'hui ?",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    likes: 89,
    likedBy: ['bot-emma', 'bot-sophie', 'bot-camille', 'bot-maxime', 'bot-antoine'],
    comments: [
      {
        id: 'comment-5',
        content: "C'est où ? 😍",
        user: BOT_USERS[4].user,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'comment-6',
        content: 'Le rêve absolu !',
        user: BOT_USERS[6].user,
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    user: BOT_USERS[3].user,
    createdAt: new Date(Date.now() - 28800000),
  },
  {
    id: 'post-5',
    content: "Meilleur ramen de Lyon trouvé ! 🍜 Après 6 mois de recherche, je peux enfin confirmer que ce petit resto caché vaut le détour. DM pour l'adresse !",
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
    likes: 54,
    likedBy: ['bot-thomas', 'bot-julie', 'bot-antoine'],
    comments: [
      {
        id: 'comment-7',
        content: "J'ai besoin de cette adresse ! 🤤",
        user: BOT_USERS[3].user,
        createdAt: new Date(Date.now() - 7200000),
      },
    ],
    user: BOT_USERS[4].user,
    createdAt: new Date(Date.now() - 36000000),
  },
  {
    id: 'post-6',
    content: "Stream ce soir à 20h ! 🎮 On continue notre run sur Elden Ring. Venez nombreux, ça va être épique (ou pas lol)",
    likes: 31,
    likedBy: ['bot-lucas', 'bot-antoine'],
    comments: [
      {
        id: 'comment-8',
        content: 'Je serai là ! 🔥',
        user: BOT_USERS[7].user,
        createdAt: new Date(Date.now() - 14400000),
      },
    ],
    user: BOT_USERS[5].user,
    createdAt: new Date(Date.now() - 43200000),
  },
  {
    id: 'post-7',
    content: "Workout du matin terminé ! 💪 5km de course + circuit training. Qui est motivé pour se lancer un défi sportif ce mois-ci ?",
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    likes: 76,
    likedBy: ['bot-emma', 'bot-thomas', 'bot-camille', 'bot-maxime'],
    comments: [
      {
        id: 'comment-9',
        content: 'Respect ! Je me motive demain 😅',
        user: BOT_USERS[3].user,
        createdAt: new Date(Date.now() - 10800000),
      },
      {
        id: 'comment-10',
        content: 'Tu as des conseils pour débuter ?',
        user: BOT_USERS[4].user,
        createdAt: new Date(Date.now() - 7200000),
      },
    ],
    user: BOT_USERS[6].user,
    createdAt: new Date(Date.now() - 50400000),
  },
  {
    id: 'post-8',
    content: "Concert improvisé au Vieux-Port hier soir 🎸 Rien de mieux que la musique live pour finir le weekend. Marseille, tu m'inspires !",
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    likes: 45,
    likedBy: ['bot-emma', 'bot-sophie', 'bot-maxime'],
    comments: [
      {
        id: 'comment-11',
        content: "J'aurais trop aimé être là !",
        user: BOT_USERS[5].user,
        createdAt: new Date(Date.now() - 21600000),
      },
    ],
    user: BOT_USERS[7].user,
    createdAt: new Date(Date.now() - 57600000),
  },
];

// Bot stories
export const BOT_STORIES: Story[] = [
  {
    id: 'story-emma',
    user: BOT_USERS[0].user,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop',
    createdAt: new Date(Date.now() - 3600000),
    viewed: false,
  },
  {
    id: 'story-lucas',
    user: BOT_USERS[1].user,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop',
    createdAt: new Date(Date.now() - 7200000),
    viewed: false,
  },
  {
    id: 'story-sophie',
    user: BOT_USERS[2].user,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=600&fit=crop',
    createdAt: new Date(Date.now() - 10800000),
    viewed: false,
  },
  {
    id: 'story-thomas',
    user: BOT_USERS[3].user,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    createdAt: new Date(Date.now() - 14400000),
    viewed: false,
  },
  {
    id: 'story-julie',
    user: BOT_USERS[6].user,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop',
    createdAt: new Date(Date.now() - 18000000),
    viewed: false,
  },
];
