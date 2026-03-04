# GSH Social - Guide Complet de Développement
## Vue.js 3 + Pinia + JSON-server

> **Lycée Geoffroy Saint-Hilaire — BTS SIO SLAM**
> Réseau social interne pour la communauté éducative (élèves, professeurs, personnel)

---

## Table des matières

1. [Contexte & Objectifs](#1-contexte--objectifs)
2. [Stack technique](#2-stack-technique)
3. [Installation du projet](#3-installation-du-projet)
4. [Structure du projet](#4-structure-du-projet)
5. [Configuration TailwindCSS + DaisyUI](#5-configuration-tailwindcss--daisyui)
6. [Configuration Pinia avec persistance](#6-configuration-pinia-avec-persistance)
7. [Service API (Axios)](#7-service-api-axios)
8. [Vue Router + Protection des routes](#8-vue-router--protection-des-routes)
9. [Base de données db.json](#9-base-de-données-dbjson)
10. [Stores Pinia](#10-stores-pinia)
11. [Composants Vue.js](#11-composants-vuejs)
12. [Fonctionnalités détaillées](#12-fonctionnalités-détaillées)
13. [Gestion du thème](#13-gestion-du-thème)
14. [Badges utilisateurs](#14-badges-utilisateurs)
15. [Conformité RGPD](#15-conformité-rgpd)
16. [Évolution json-server-auth](#16-évolution-json-server-auth)
17. [Migration MongoDB](#17-migration-mongodb)
18. [Plan de réalisation (8 semaines)](#18-plan-de-réalisation-8-semaines)
19. [Checklist de validation](#19-checklist-de-validation)
20. [Scripts npm](#20-scripts-npm)

---

## 1. Contexte & Objectifs

### Contexte
Le lycée Geoffroy Saint-Hilaire développe un réseau social interne dédié à sa communauté éducative. Le projet est confié aux étudiants BTS SIO SLAM pour mettre en pratique leurs compétences en programmation, gestion de projet et sécurité informatique.

### Objectifs
- **Application web responsive** (desktop + tablette + mobile)
- **Authentification sécurisée** avec gestion des comptes
- **Fil d'actualité** : posts (texte + image), likes, commentaires, hashtags
- **Profils utilisateurs** modifiables (bio, avatar, liste de posts)
- **Messagerie privée** entre utilisateurs
- **Suggestions d'amis** et système follow/unfollow
- **Mode sombre/clair**
- **Respect du RGPD**
- **Store centralisé** avec Pinia et persistance localStorage
- **Backend évolutif** : JSON-server → json-server-auth → MongoDB

---

## 2. Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Vue.js 3 + Vite | Framework réactif + build rapide |
| UI | TailwindCSS + DaisyUI | Design responsive + composants prêts |
| State | Pinia + persistedstate | Store centralisé + persistance localStorage |
| Routing | Vue Router 4 | Navigation + protection des routes |
| HTTP | Axios | Appels API REST |
| Backend (dev) | json-server | API REST simulée |
| Backend (auth) | json-server-auth | Authentification JWT |
| Backend (prod) | Node.js + Express + MongoDB | Production scalable |

---

## 3. Installation du projet

```bash
# Créer le projet Vue.js 3 avec Vite
npm create vite@latest gsh-social -- --template vue
cd gsh-social
npm install

# UI : TailwindCSS + DaisyUI
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D daisyui@latest

# State : Pinia + persistance
npm install pinia pinia-plugin-persistedstate

# Routing
npm install vue-router@4

# HTTP
npm install axios

# Backend simulé
npm install -D json-server concurrently

# Utilitaires
npm install date-fns
```

---

## 4. Structure du projet

```
gsh-social/
├── db.json                        # Base de données json-server
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── gsh-logo.png
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.vue      # Layout principal (navbar + contenu + bottom nav)
│   │   │   ├── Navbar.vue         # Barre de navigation desktop
│   │   │   └── BottomNav.vue      # Navigation mobile (bottom)
│   │   ├── posts/
│   │   │   ├── PostCard.vue       # Carte de publication
│   │   │   ├── PostForm.vue       # Formulaire de création de post
│   │   │   └── CommentSection.vue # Section commentaires
│   │   ├── stories/
│   │   │   ├── StoriesBar.vue     # Barre de stories horizontale
│   │   │   ├── StoryCircle.vue    # Cercle story individuel
│   │   │   └── StoryViewer.vue    # Visualiseur de story plein écran
│   │   ├── users/
│   │   │   ├── UserBadge.vue      # Badge bot 🤖 / vérifié ✓
│   │   │   ├── UserCard.vue       # Carte utilisateur (suggestions)
│   │   │   └── FriendSuggestions.vue # Widget suggestions d'amis
│   │   └── ui/
│   │       ├── ThemeToggle.vue    # Bouton mode sombre/clair
│   │       └── LoadingSpinner.vue # Indicateur de chargement
│   ├── router/
│   │   └── index.js               # Configuration Vue Router
│   ├── stores/
│   │   ├── auth.js                # Store authentification
│   │   ├── posts.js               # Store publications
│   │   ├── messages.js            # Store messagerie
│   │   ├── users.js               # Store utilisateurs
│   │   └── theme.js               # Store thème sombre/clair
│   ├── views/
│   │   ├── HomeView.vue           # Page d'accueil (non connecté)
│   │   ├── LoginView.vue          # Page de connexion
│   │   ├── RegisterView.vue       # Page d'inscription
│   │   ├── FeedView.vue           # Fil d'actualité
│   │   ├── ProfileView.vue        # Mon profil
│   │   ├── UserProfileView.vue    # Profil d'un autre utilisateur
│   │   ├── EditProfileView.vue    # Modifier mon profil
│   │   ├── MessagesView.vue       # Liste des conversations
│   │   ├── ChatView.vue           # Conversation individuelle
│   │   ├── SearchView.vue         # Recherche d'utilisateurs
│   │   ├── CreateView.vue         # Créer un post
│   │   ├── SettingsView.vue       # Paramètres
│   │   └── NotFoundView.vue       # Page 404
│   ├── services/
│   │   └── api.js                 # Configuration Axios
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── package.json
└── README.md
```

---

## 5. Configuration TailwindCSS + DaisyUI

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#6366f1",
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6",
          "accent": "#f43f5e",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#e5e7eb",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#818cf8",
          "primary-content": "#ffffff",
          "secondary": "#a78bfa",
          "accent": "#fb7185",
          "neutral": "#e5e7eb",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "info": "#60a5fa",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
  },
}
```

### src/style.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .glass-card {
    @apply bg-base-100/80 backdrop-blur-lg border border-base-300/50 shadow-lg;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent;
  }

  .story-ring {
    @apply p-[3px] rounded-full bg-gradient-to-tr from-primary via-secondary to-accent;
  }
}
```

---

## 6. Configuration Pinia avec persistance

### src/main.js
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
```

---

## 7. Service API (Axios)

### src/services/api.js
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Intercepteur pour ajouter le token JWT (pour json-server-auth)
api.interceptors.request.use(config => {
  const authData = localStorage.getItem('auth')
  if (authData) {
    try {
      const { token } = JSON.parse(authData)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // localStorage corrompu, on ignore
    }
  }
  return config
})

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → déconnecter
      localStorage.removeItem('auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 8. Vue Router + Protection des routes

### src/router/index.js
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/FeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: () => import('@/views/EditProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'user-profile',
    component: () => import('@/views/UserProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/views/MessagesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/:userId',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/CreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// ⚠️ Guard de navigation : protection des routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Route protégée → rediriger vers login
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    // Déjà connecté → rediriger vers le fil
    next({ name: 'feed' })
  } else {
    next()
  }
})

export default router
```

---

## 9. Base de données db.json

```json
{
  "users": [
    {
      "id": "bot-emma",
      "name": "Emma Martin",
      "email": "emma.martin@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      "bio": "Photographe passionnée 📸 | Paris",
      "isBot": true,
      "followers": ["bot-lucas", "bot-sophie", "bot-thomas"],
      "following": ["bot-lucas", "bot-sophie", "bot-camille"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-lucas",
      "name": "Lucas Dubois",
      "email": "lucas.dubois@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      "bio": "Développeur web 💻 | Tech enthusiast",
      "isBot": true,
      "followers": ["bot-emma", "bot-sophie"],
      "following": ["bot-emma", "bot-maxime", "bot-antoine"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-sophie",
      "name": "Sophie Bernard",
      "email": "sophie.bernard@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      "bio": "Designer UI/UX ✨ | Créative",
      "isBot": true,
      "followers": ["bot-emma", "bot-lucas", "bot-camille"],
      "following": ["bot-emma", "bot-lucas", "bot-julie"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-thomas",
      "name": "Thomas Petit",
      "email": "thomas.petit@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      "bio": "Voyageur 🌍 | Amateur de café ☕",
      "isBot": true,
      "followers": ["bot-camille", "bot-julie"],
      "following": ["bot-emma", "bot-camille", "bot-antoine"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-camille",
      "name": "Camille Leroy",
      "email": "camille.leroy@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      "bio": "Foodie 🍜 | Lyon",
      "isBot": true,
      "followers": ["bot-emma", "bot-thomas"],
      "following": ["bot-sophie", "bot-thomas", "bot-julie"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-maxime",
      "name": "Maxime Moreau",
      "email": "maxime.moreau@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      "bio": "Gamer 🎮 | Streamer",
      "isBot": true,
      "followers": ["bot-lucas"],
      "following": ["bot-lucas", "bot-antoine"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-julie",
      "name": "Julie Simon",
      "email": "julie.simon@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      "bio": "Fitness addict 💪 | Coach sportif",
      "isBot": true,
      "followers": ["bot-sophie", "bot-camille"],
      "following": ["bot-thomas", "bot-camille"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "bot-antoine",
      "name": "Antoine Garcia",
      "email": "antoine.garcia@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      "bio": "Musicien 🎸 | Marseille",
      "isBot": true,
      "followers": ["bot-lucas", "bot-thomas", "bot-maxime"],
      "following": ["bot-maxime"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "posts": [
    {
      "id": "post-1",
      "content": "Belle journée pour une session photo au Trocadéro ! 📸 La lumière était parfaite ce matin. #Paris #Photography",
      "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
      "likes": 42,
      "likedBy": ["bot-lucas", "bot-sophie", "bot-thomas"],
      "hashtags": ["Paris", "Photography"],
      "comments": [
        {
          "id": "comment-1",
          "content": "Magnifique ! Tu as un talent fou 🔥",
          "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-03T08:00:00.000Z"
        },
        {
          "id": "comment-2",
          "content": "Hâte de voir ça !",
          "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-03T08:30:00.000Z"
        }
      ],
      "userId": "bot-emma",
      "user": { "id": "bot-emma", "name": "Emma Martin", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-03T07:00:00.000Z"
    },
    {
      "id": "post-2",
      "content": "Nouveau projet Vue.js lancé ! 🚀 Stack : Vue 3 + Pinia + TailwindCSS. Qui est dans la #tech ici ? #dev #vuejs",
      "image": null,
      "likes": 28,
      "likedBy": ["bot-emma", "bot-sophie"],
      "hashtags": ["tech", "dev", "vuejs"],
      "comments": [
        {
          "id": "comment-3",
          "content": "Belle stack ! Tu utilises Vite aussi ?",
          "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-03T06:00:00.000Z"
        }
      ],
      "userId": "bot-lucas",
      "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-03T05:00:00.000Z"
    },
    {
      "id": "post-3",
      "content": "Design du jour ✨ Travail sur une nouvelle interface pour une app de méditation. Les couleurs douces, ça change tout pour l'UX ! #design #ux",
      "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      "likes": 67,
      "likedBy": ["bot-emma", "bot-lucas", "bot-camille", "bot-julie"],
      "hashtags": ["design", "ux"],
      "comments": [
        {
          "id": "comment-4",
          "content": "Les gradients sont parfaits ! 💜",
          "user": { "id": "bot-emma", "name": "Emma Martin", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-02T20:00:00.000Z"
        }
      ],
      "userId": "bot-sophie",
      "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-02T18:00:00.000Z"
    },
    {
      "id": "post-4",
      "content": "Café ☕ + Vue sur la montagne 🏔️ = Télétravail parfait ! Qui d'autre travaille depuis un endroit insolite aujourd'hui ? #remote #travel",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      "likes": 89,
      "likedBy": ["bot-emma", "bot-sophie", "bot-camille", "bot-maxime", "bot-antoine"],
      "hashtags": ["remote", "travel"],
      "comments": [
        {
          "id": "comment-5",
          "content": "C'est où ? 😍",
          "user": { "id": "bot-camille", "name": "Camille Leroy", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-02T15:00:00.000Z"
        },
        {
          "id": "comment-6",
          "content": "Le rêve absolu !",
          "user": { "id": "bot-julie", "name": "Julie Simon", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-02T15:30:00.000Z"
        }
      ],
      "userId": "bot-thomas",
      "user": { "id": "bot-thomas", "name": "Thomas Petit", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-02T14:00:00.000Z"
    },
    {
      "id": "post-5",
      "content": "Meilleur ramen de Lyon trouvé ! 🍜 Après 6 mois de recherche, ce petit resto caché vaut le détour. DM pour l'adresse ! #food #lyon",
      "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
      "likes": 54,
      "likedBy": ["bot-thomas", "bot-julie", "bot-antoine"],
      "hashtags": ["food", "lyon"],
      "comments": [
        {
          "id": "comment-7",
          "content": "J'ai besoin de cette adresse ! 🤤",
          "user": { "id": "bot-thomas", "name": "Thomas Petit", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-02T11:00:00.000Z"
        }
      ],
      "userId": "bot-camille",
      "user": { "id": "bot-camille", "name": "Camille Leroy", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-02T10:00:00.000Z"
    },
    {
      "id": "post-6",
      "content": "Stream ce soir à 20h ! 🎮 On continue notre run sur Elden Ring. Venez nombreux ! #gaming #stream",
      "image": null,
      "likes": 31,
      "likedBy": ["bot-lucas", "bot-antoine"],
      "hashtags": ["gaming", "stream"],
      "comments": [
        {
          "id": "comment-8",
          "content": "Je serai là ! 🔥",
          "user": { "id": "bot-antoine", "name": "Antoine Garcia", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-01T20:00:00.000Z"
        }
      ],
      "userId": "bot-maxime",
      "user": { "id": "bot-maxime", "name": "Maxime Moreau", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-01T19:00:00.000Z"
    },
    {
      "id": "post-7",
      "content": "Workout du matin terminé ! 💪 5km de course + circuit training. Défi sportif ce mois-ci ? #fitness #motivation",
      "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
      "likes": 76,
      "likedBy": ["bot-emma", "bot-thomas", "bot-camille", "bot-maxime"],
      "hashtags": ["fitness", "motivation"],
      "comments": [
        {
          "id": "comment-9",
          "content": "Respect ! Je me motive demain 😅",
          "user": { "id": "bot-thomas", "name": "Thomas Petit", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-01T08:00:00.000Z"
        },
        {
          "id": "comment-10",
          "content": "Tu as des conseils pour débuter ?",
          "user": { "id": "bot-camille", "name": "Camille Leroy", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
          "createdAt": "2026-03-01T09:00:00.000Z"
        }
      ],
      "userId": "bot-julie",
      "user": { "id": "bot-julie", "name": "Julie Simon", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
      "createdAt": "2026-03-01T07:00:00.000Z"
    },
    {
      "id": "post-8",
      "content": "Concert improvisé au Vieux-Port hier soir 🎸 Rien de mieux que la musique live ! Marseille, tu m'inspires ! #music #marseille",
      "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      "likes": 45,
      "likedBy": ["bot-emma", "bot-sophie", "bot-maxime"],
      "hashtags": ["music", "marseille"],
      "comments": [
        {
          "id": "comment-11",
          "content": "J'aurais trop aimé être là !",
          "user": { "id": "bot-maxime", "name": "Maxime Moreau", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
          "createdAt": "2026-02-28T22:00:00.000Z"
        }
      ],
      "userId": "bot-antoine",
      "user": { "id": "bot-antoine", "name": "Antoine Garcia", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
      "createdAt": "2026-02-28T20:00:00.000Z"
    }
  ],
  "stories": [
    {
      "id": "story-emma",
      "userId": "bot-emma",
      "user": { "id": "bot-emma", "name": "Emma Martin", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-03-04T09:00:00.000Z"
    },
    {
      "id": "story-lucas",
      "userId": "bot-lucas",
      "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-03-04T08:00:00.000Z"
    },
    {
      "id": "story-sophie",
      "userId": "bot-sophie",
      "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-03-04T07:00:00.000Z"
    },
    {
      "id": "story-thomas",
      "userId": "bot-thomas",
      "user": { "id": "bot-thomas", "name": "Thomas Petit", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-03-04T06:00:00.000Z"
    },
    {
      "id": "story-julie",
      "userId": "bot-julie",
      "user": { "id": "bot-julie", "name": "Julie Simon", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-03-04T05:00:00.000Z"
    }
  ],
  "conversations": [],
  "messages": []
}
```

---

## 10. Stores Pinia

### src/stores/auth.js — Authentification
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions

  /**
   * Connexion avec email + mot de passe
   * Vérifie dans la collection users de json-server
   */
  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/users', {
        params: { email, password }
      })

      if (response.data.length > 0) {
        user.value = response.data[0]
        token.value = 'mock-jwt-token-' + user.value.id
        return true
      }

      error.value = 'Email ou mot de passe incorrect'
      return false
    } catch (err) {
      error.value = 'Erreur de connexion au serveur'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * Vérifie que l'email n'existe pas déjà
   */
  async function register(name, email, password, avatar = null) {
    loading.value = true
    error.value = null
    try {
      // Vérifier si l'email existe déjà
      const existing = await api.get('/users', { params: { email } })
      if (existing.data.length > 0) {
        error.value = 'Cet email est déjà utilisé'
        return false
      }

      // Créer le nouvel utilisateur
      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=150`,
        bio: '',
        isBot: false,
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      }

      const response = await api.post('/users', newUser)
      user.value = response.data
      token.value = 'mock-jwt-token-' + response.data.id
      return true
    } catch (err) {
      error.value = "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  function logout() {
    user.value = null
    token.value = null
    error.value = null
  }

  /**
   * Modifier le profil (bio, avatar, name)
   */
  async function updateProfile(updates) {
    if (!user.value) return false
    try {
      const response = await api.patch(`/users/${user.value.id}`, updates)
      user.value = { ...user.value, ...response.data }
      return true
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil', err)
      return false
    }
  }

  /**
   * Suivre un utilisateur
   */
  async function followUser(targetUserId) {
    if (!user.value || targetUserId === user.value.id) return
    if (user.value.following.includes(targetUserId)) return

    try {
      // Ajouter à mon following
      const updatedFollowing = [...user.value.following, targetUserId]
      await api.patch(`/users/${user.value.id}`, { following: updatedFollowing })
      user.value.following = updatedFollowing

      // Ajouter à ses followers
      const targetUser = await api.get(`/users/${targetUserId}`)
      const updatedFollowers = [...targetUser.data.followers, user.value.id]
      await api.patch(`/users/${targetUserId}`, { followers: updatedFollowers })
    } catch (err) {
      console.error('Erreur lors du suivi', err)
    }
  }

  /**
   * Ne plus suivre un utilisateur
   */
  async function unfollowUser(targetUserId) {
    if (!user.value) return

    try {
      const updatedFollowing = user.value.following.filter(id => id !== targetUserId)
      await api.patch(`/users/${user.value.id}`, { following: updatedFollowing })
      user.value.following = updatedFollowing

      const targetUser = await api.get(`/users/${targetUserId}`)
      const updatedFollowers = targetUser.data.followers.filter(id => id !== user.value.id)
      await api.patch(`/users/${targetUserId}`, { followers: updatedFollowers })
    } catch (err) {
      console.error('Erreur lors du désabonnement', err)
    }
  }

  return {
    user, token, error, loading,
    isAuthenticated, currentUser,
    login, register, logout, updateProfile,
    followUser, unfollowUser
  }
}, {
  persist: true
})
```

### src/stores/posts.js — Publications
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const usePostsStore = defineStore('posts', () => {
  const authStore = useAuthStore()

  // State
  const posts = ref([])
  const stories = ref([])
  const loading = ref(false)
  const hashtagFilter = ref(null)

  // Getters
  const sortedPosts = computed(() => {
    let filtered = [...posts.value]

    // Filtrer par hashtag si actif
    if (hashtagFilter.value) {
      filtered = filtered.filter(p =>
        p.hashtags?.includes(hashtagFilter.value)
      )
    }

    return filtered.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })

  const activeStories = computed(() => {
    const now = new Date()
    return stories.value.filter(story => {
      const storyDate = new Date(story.createdAt)
      const hoursDiff = (now - storyDate) / (1000 * 60 * 60)
      return hoursDiff < 24
    })
  })

  // Extraire tous les hashtags uniques
  const allHashtags = computed(() => {
    const tags = new Set()
    posts.value.forEach(p => {
      p.hashtags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  })

  // Actions

  async function fetchPosts() {
    loading.value = true
    try {
      const response = await api.get('/posts?_sort=createdAt&_order=desc')
      posts.value = response.data
    } catch (err) {
      console.error('Erreur lors du chargement des posts', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStories() {
    try {
      const response = await api.get('/stories?_sort=createdAt&_order=desc')
      stories.value = response.data
    } catch (err) {
      console.error('Erreur lors du chargement des stories', err)
    }
  }

  /**
   * Créer un post (texte + image optionnelle)
   * Extrait automatiquement les hashtags du contenu
   */
  async function addPost(content, image = null) {
    if (!authStore.user || !content.trim()) return

    // Extraire les hashtags du contenu (#mot)
    const hashtags = content.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || []

    try {
      const newPost = {
        content: content.trim(),
        image,
        likes: 0,
        likedBy: [],
        hashtags,
        comments: [],
        userId: authStore.user.id,
        user: {
          id: authStore.user.id,
          name: authStore.user.name,
          avatar: authStore.user.avatar
        },
        createdAt: new Date().toISOString()
      }

      const response = await api.post('/posts', newPost)
      posts.value.unshift(response.data)
    } catch (err) {
      console.error('Erreur lors de la création du post', err)
    }
  }

  /**
   * Modifier un post existant (seulement si propriétaire)
   */
  async function updatePost(postId, updates) {
    if (!authStore.user) return
    const post = posts.value.find(p => p.id === postId)
    if (!post || post.userId !== authStore.user.id) return

    try {
      // Recalculer les hashtags si le contenu change
      if (updates.content) {
        updates.hashtags = updates.content.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || []
      }

      const response = await api.patch(`/posts/${postId}`, updates)
      const index = posts.value.findIndex(p => p.id === postId)
      posts.value[index] = { ...posts.value[index], ...response.data }
    } catch (err) {
      console.error('Erreur lors de la modification du post', err)
    }
  }

  /**
   * Supprimer un post (seulement si propriétaire)
   */
  async function deletePost(postId) {
    if (!authStore.user) return
    const post = posts.value.find(p => p.id === postId)
    if (!post || post.userId !== authStore.user.id) return

    try {
      await api.delete(`/posts/${postId}`)
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (err) {
      console.error('Erreur lors de la suppression du post', err)
    }
  }

  /**
   * Liker / unliker un post
   */
  async function likePost(postId) {
    if (!authStore.user) return

    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const alreadyLiked = post.likedBy.includes(authStore.user.id)
    const updatedPost = {
      likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
      likedBy: alreadyLiked
        ? post.likedBy.filter(id => id !== authStore.user.id)
        : [...post.likedBy, authStore.user.id]
    }

    try {
      await api.patch(`/posts/${postId}`, updatedPost)
      const index = posts.value.findIndex(p => p.id === postId)
      posts.value[index] = { ...posts.value[index], ...updatedPost }
    } catch (err) {
      console.error('Erreur lors du like', err)
    }
  }

  /**
   * Ajouter un commentaire
   */
  async function addComment(postId, content) {
    if (!authStore.user || !content.trim()) return

    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const newComment = {
      id: Date.now().toString(),
      content: content.trim(),
      user: {
        id: authStore.user.id,
        name: authStore.user.name,
        avatar: authStore.user.avatar
      },
      createdAt: new Date().toISOString()
    }

    const updatedComments = [...post.comments, newComment]

    try {
      await api.patch(`/posts/${postId}`, { comments: updatedComments })
      const index = posts.value.findIndex(p => p.id === postId)
      posts.value[index].comments = updatedComments
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire", err)
    }
  }

  /**
   * Filtrer par hashtag (null = aucun filtre)
   */
  function filterByHashtag(tag) {
    hashtagFilter.value = hashtagFilter.value === tag ? null : tag
  }

  async function addStory(image) {
    if (!authStore.user) return

    try {
      const newStory = {
        userId: authStore.user.id,
        user: {
          id: authStore.user.id,
          name: authStore.user.name,
          avatar: authStore.user.avatar
        },
        image,
        viewed: false,
        createdAt: new Date().toISOString()
      }

      const response = await api.post('/stories', newStory)
      stories.value.unshift(response.data)
    } catch (err) {
      console.error('Erreur lors de la création de la story', err)
    }
  }

  async function viewStory(storyId) {
    try {
      await api.patch(`/stories/${storyId}`, { viewed: true })
      const story = stories.value.find(s => s.id === storyId)
      if (story) story.viewed = true
    } catch (err) {
      console.error('Erreur lors de la vue de la story', err)
    }
  }

  return {
    posts, stories, loading, hashtagFilter,
    sortedPosts, activeStories, allHashtags,
    fetchPosts, fetchStories,
    addPost, updatePost, deletePost,
    likePost, addComment,
    filterByHashtag,
    addStory, viewStory
  }
}, {
  persist: {
    paths: ['posts', 'stories']
  }
})
```

### src/stores/messages.js — Messagerie
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useMessagesStore = defineStore('messages', () => {
  const authStore = useAuthStore()

  // State
  const conversations = ref([])
  const messages = ref([])
  let pollingInterval = null

  // Getters
  const unreadCount = computed(() => {
    if (!authStore.user) return 0
    return messages.value.filter(
      m => m.receiverId === authStore.user.id && !m.read
    ).length
  })

  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  })

  // Actions

  async function fetchConversations() {
    if (!authStore.user) return
    try {
      const response = await api.get('/conversations')
      conversations.value = response.data.filter(
        c => c.participants.includes(authStore.user.id)
      )
    } catch (err) {
      console.error('Erreur lors du chargement des conversations', err)
    }
  }

  async function fetchMessages(conversationId) {
    try {
      const response = await api.get(`/messages?conversationId=${conversationId}&_sort=createdAt&_order=asc`)
      return response.data
    } catch (err) {
      console.error('Erreur lors du chargement des messages', err)
      return []
    }
  }

  /**
   * Envoyer un message privé
   * Crée automatiquement la conversation si elle n'existe pas
   */
  async function sendMessage(receiverId, content) {
    if (!authStore.user || !content.trim()) return

    try {
      // Trouver ou créer la conversation
      let conversation = conversations.value.find(
        c => c.participants.includes(authStore.user.id) &&
             c.participants.includes(receiverId)
      )

      if (!conversation) {
        const newConv = {
          participants: [authStore.user.id, receiverId],
          updatedAt: new Date().toISOString()
        }
        const convResponse = await api.post('/conversations', newConv)
        conversation = convResponse.data
        conversations.value.push(conversation)
      }

      // Créer le message
      const newMessage = {
        conversationId: conversation.id,
        senderId: authStore.user.id,
        receiverId,
        content: content.trim(),
        read: false,
        createdAt: new Date().toISOString()
      }

      const msgResponse = await api.post('/messages', newMessage)
      messages.value.push(msgResponse.data)

      // Mettre à jour la conversation
      await api.patch(`/conversations/${conversation.id}`, {
        lastMessage: msgResponse.data,
        updatedAt: new Date().toISOString()
      })

      return msgResponse.data
    } catch (err) {
      console.error("Erreur lors de l'envoi du message", err)
    }
  }

  async function markAsRead(messageId) {
    try {
      await api.patch(`/messages/${messageId}`, { read: true })
      const msg = messages.value.find(m => m.id === messageId)
      if (msg) msg.read = true
    } catch (err) {
      console.error('Erreur lors du marquage comme lu', err)
    }
  }

  /**
   * Polling pour simuler le temps réel
   * (json-server ne supporte pas les WebSockets)
   */
  function startPolling(conversationId) {
    stopPolling()
    pollingInterval = setInterval(async () => {
      if (!authStore.user) return
      try {
        const response = await api.get(
          `/messages?conversationId=${conversationId}&_sort=createdAt&_order=asc`
        )
        messages.value = response.data
      } catch (err) {
        console.error('Polling error', err)
      }
    }, 2000)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  return {
    conversations, messages,
    unreadCount, sortedConversations,
    fetchConversations, fetchMessages,
    sendMessage, markAsRead,
    startPolling, stopPolling
  }
}, {
  persist: true
})
```

### src/stores/users.js — Utilisateurs & Suggestions
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useUsersStore = defineStore('users', () => {
  const authStore = useAuthStore()

  // State
  const users = ref([])
  const loading = ref(false)

  // Getters

  /**
   * Suggestions d'amis = utilisateurs non suivis par l'utilisateur connecté
   * Le compte A voit le compte B, et inversement
   */
  const suggestions = computed(() => {
    if (!authStore.user) return []
    return users.value.filter(u =>
      u.id !== authStore.user.id &&
      !authStore.user.following.includes(u.id)
    ).slice(0, 5)
  })

  // Actions

  async function fetchAllUsers() {
    loading.value = true
    try {
      const response = await api.get('/users')
      // Exclure l'utilisateur connecté de la liste
      users.value = response.data.filter(u => u.id !== authStore.user?.id)
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs', err)
    } finally {
      loading.value = false
    }
  }

  async function getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur", err)
      return null
    }
  }

  async function getUserPosts(userId) {
    try {
      const response = await api.get(`/posts?userId=${userId}&_sort=createdAt&_order=desc`)
      return response.data
    } catch (err) {
      console.error('Erreur lors du chargement des posts', err)
      return []
    }
  }

  function searchUsers(query) {
    if (!query.trim()) return users.value
    return users.value.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.bio?.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    users, loading, suggestions,
    fetchAllUsers, getUserById, getUserPosts, searchUsers
  }
})
```

### src/stores/theme.js — Mode sombre/clair
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light')

  function initTheme() {
    const saved = localStorage.getItem('gsh-theme')
    if (saved) {
      theme.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    applyTheme()
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('gsh-theme', theme.value)
  }

  return { theme, initTheme, toggleTheme }
}, {
  persist: { paths: ['theme'] }
})
```

---

## 11. Composants Vue.js

### src/App.vue
```vue
<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
```

### src/components/layout/AppLayout.vue
```vue
<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar Desktop -->
    <Navbar />

    <!-- Contenu principal -->
    <main class="container mx-auto max-w-2xl px-4 py-6 pb-20 lg:pb-6">
      <slot />
    </main>

    <!-- Navigation Mobile -->
    <BottomNav class="lg:hidden" />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import BottomNav from './BottomNav.vue'
</script>
```

### src/components/layout/Navbar.vue
```vue
<template>
  <nav class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <div class="container mx-auto max-w-6xl">
      <!-- Logo -->
      <div class="flex-1">
        <RouterLink to="/feed" class="btn btn-ghost text-xl gradient-text font-bold">
          GSH Social
        </RouterLink>
      </div>

      <!-- Navigation Desktop -->
      <div class="hidden lg:flex gap-2">
        <RouterLink to="/feed" class="btn btn-ghost btn-sm">Fil</RouterLink>
        <RouterLink to="/search" class="btn btn-ghost btn-sm">Rechercher</RouterLink>
        <RouterLink to="/create" class="btn btn-ghost btn-sm">Publier</RouterLink>
        <RouterLink to="/messages" class="btn btn-ghost btn-sm">
          Messages
          <span v-if="messagesStore.unreadCount > 0" class="badge badge-primary badge-xs">
            {{ messagesStore.unreadCount }}
          </span>
        </RouterLink>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <!-- Thème Toggle -->
        <button class="btn btn-ghost btn-circle" @click="themeStore.toggleTheme()">
          <span v-if="themeStore.theme === 'light'" class="text-lg">🌙</span>
          <span v-else class="text-lg">☀️</span>
        </button>

        <!-- Profil -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" class="avatar btn btn-ghost btn-circle">
            <div class="w-8 rounded-full">
              <img :src="authStore.user?.avatar" :alt="authStore.user?.name" />
            </div>
          </div>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><RouterLink to="/profile">Mon profil</RouterLink></li>
            <li><RouterLink to="/settings">Paramètres</RouterLink></li>
            <li><a @click="handleLogout" class="text-error">Déconnexion</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const messagesStore = useMessagesStore()
const themeStore = useThemeStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
```

### src/components/layout/BottomNav.vue
```vue
<template>
  <div class="btm-nav bg-base-100 border-t border-base-300 z-50">
    <RouterLink to="/feed" :class="{ active: route.path === '/feed' }">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span class="btm-nav-label text-xs">Fil</span>
    </RouterLink>

    <RouterLink to="/search" :class="{ active: route.path === '/search' }">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="btm-nav-label text-xs">Chercher</span>
    </RouterLink>

    <RouterLink to="/create" :class="{ active: route.path === '/create' }">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="btm-nav-label text-xs">Publier</span>
    </RouterLink>

    <RouterLink to="/messages" :class="{ active: route.path === '/messages' }">
      <div class="indicator">
        <span v-if="messagesStore.unreadCount > 0" class="indicator-item badge badge-primary badge-xs">
          {{ messagesStore.unreadCount }}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <span class="btm-nav-label text-xs">Messages</span>
    </RouterLink>

    <RouterLink to="/profile" :class="{ active: route.path === '/profile' }">
      <div class="avatar">
        <div class="w-6 rounded-full">
          <img :src="authStore.user?.avatar" :alt="authStore.user?.name" />
        </div>
      </div>
      <span class="btm-nav-label text-xs">Profil</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'

const route = useRoute()
const authStore = useAuthStore()
const messagesStore = useMessagesStore()
</script>
```

### src/components/users/UserBadge.vue
```vue
<template>
  <span v-if="isBot" class="inline-flex items-center" title="Compte robot">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <circle cx="8" cy="16" r="1" />
      <circle cx="16" cy="16" r="1" />
    </svg>
  </span>
  <span v-else class="inline-flex items-center" title="Compte vérifié">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-info" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  userId: { type: String, required: true }
})

const isBot = computed(() => props.userId.startsWith('bot-'))
</script>
```

### src/components/users/FriendSuggestions.vue
```vue
<template>
  <div class="card bg-base-100 shadow-lg" v-if="usersStore.suggestions.length > 0">
    <div class="card-body p-4">
      <h2 class="card-title text-lg">Suggestions d'amis</h2>
      <div class="space-y-3">
        <div
          v-for="user in usersStore.suggestions"
          :key="user.id"
          class="flex items-center gap-3"
        >
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img :src="user.avatar" :alt="user.name" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <RouterLink :to="`/user/${user.id}`" class="font-semibold text-sm hover:underline flex items-center gap-1">
              {{ user.name }}
              <UserBadge :userId="user.id" />
            </RouterLink>
            <p class="text-xs text-base-content/60">{{ user.followers?.length || 0 }} abonnés</p>
          </div>
          <button
            class="btn btn-primary btn-xs"
            @click="authStore.followUser(user.id)"
          >
            Suivre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import UserBadge from './UserBadge.vue'

const authStore = useAuthStore()
const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchAllUsers()
})
</script>
```

### src/components/posts/PostCard.vue
```vue
<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="avatar">
          <div class="w-10 rounded-full">
            <img :src="post.user.avatar" :alt="post.user.name" />
          </div>
        </div>
        <div class="flex-1">
          <RouterLink :to="`/user/${post.user.id}`" class="font-bold hover:underline flex items-center gap-1">
            {{ post.user.name }}
            <UserBadge :userId="post.user.id" />
          </RouterLink>
          <p class="text-sm text-base-content/60">{{ formatDate(post.createdAt) }}</p>
        </div>
        <!-- Menu propriétaire (modifier/supprimer) -->
        <div v-if="isOwner" class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-sm btn-circle">⋮</button>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a @click="startEdit">Modifier</a></li>
            <li><a @click="$emit('delete', post.id)" class="text-error">Supprimer</a></li>
          </ul>
        </div>
      </div>

      <!-- Contenu (mode édition ou affichage) -->
      <div v-if="isEditing">
        <textarea
          v-model="editContent"
          class="textarea textarea-bordered w-full"
          rows="3"
        ></textarea>
        <div class="flex gap-2 mt-2">
          <button class="btn btn-primary btn-sm" @click="saveEdit">Enregistrer</button>
          <button class="btn btn-ghost btn-sm" @click="cancelEdit">Annuler</button>
        </div>
      </div>
      <p v-else class="whitespace-pre-wrap">{{ post.content }}</p>

      <!-- Hashtags -->
      <div v-if="post.hashtags?.length > 0" class="flex flex-wrap gap-1 mt-1">
        <button
          v-for="tag in post.hashtags"
          :key="tag"
          class="badge badge-outline badge-sm cursor-pointer hover:badge-primary"
          @click="$emit('filterHashtag', tag)"
        >
          #{{ tag }}
        </button>
      </div>

      <!-- Image -->
      <figure v-if="post.image" class="-mx-4 mt-2">
        <img :src="post.image" :alt="post.content" class="w-full object-cover max-h-96" loading="lazy" />
      </figure>

      <!-- Actions -->
      <div class="flex gap-4 pt-2 border-t border-base-200">
        <button
          class="btn btn-ghost btn-sm gap-2"
          :class="{ 'text-error': isLiked }"
          @click="$emit('like', post.id)"
        >
          ❤️ {{ post.likes }}
        </button>
        <button class="btn btn-ghost btn-sm gap-2" @click="showComments = !showComments">
          💬 {{ post.comments.length }}
        </button>
      </div>

      <!-- Commentaires -->
      <div v-if="showComments" class="space-y-3 pt-3">
        <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2">
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img :src="comment.user.avatar" :alt="comment.user.name" />
            </div>
          </div>
          <div class="bg-base-200 rounded-lg px-3 py-2 flex-1">
            <p class="font-semibold text-sm flex items-center gap-1">
              {{ comment.user.name }}
              <UserBadge :userId="comment.user.id" />
            </p>
            <p class="text-sm">{{ comment.content }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <input
            v-model="newComment"
            type="text"
            placeholder="Ajouter un commentaire..."
            class="input input-bordered input-sm flex-1"
            @keyup.enter="submitComment"
          />
          <button class="btn btn-primary btn-sm" @click="submitComment" :disabled="!newComment.trim()">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import UserBadge from '@/components/users/UserBadge.vue'

const props = defineProps({
  post: { type: Object, required: true }
})

const emit = defineEmits(['like', 'comment', 'delete', 'filterHashtag'])

const authStore = useAuthStore()
const postsStore = usePostsStore()
const showComments = ref(false)
const newComment = ref('')
const isEditing = ref(false)
const editContent = ref('')

const isOwner = computed(() => authStore.user?.id === props.post.userId)
const isLiked = computed(() => props.post.likedBy.includes(authStore.user?.id))

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const submitComment = () => {
  if (newComment.value.trim()) {
    emit('comment', props.post.id, newComment.value)
    newComment.value = ''
  }
}

const startEdit = () => {
  editContent.value = props.post.content
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

const saveEdit = async () => {
  if (editContent.value.trim()) {
    await postsStore.updatePost(props.post.id, { content: editContent.value.trim() })
    isEditing.value = false
  }
}
</script>
```

### src/views/LoginView.vue
```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-3xl font-bold text-center gradient-text">GSH Social</h1>
        <p class="text-center text-base-content/60 mb-6">Connectez-vous à votre compte</p>

        <div v-if="authStore.error" class="alert alert-error mb-4">
          <span>{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-control mb-4">
            <label class="label"><span class="label-text">Email</span></label>
            <input
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control mb-6">
            <label class="label"><span class="label-text">Mot de passe</span></label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered"
              required
              minlength="6"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            Se connecter
          </button>
        </form>

        <p class="text-center mt-4 text-sm">
          Pas encore de compte ?
          <RouterLink to="/register" class="link link-primary">S'inscrire</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    const redirect = route.query.redirect || '/feed'
    router.push(redirect)
  }
}
</script>
```

### src/views/RegisterView.vue
```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-3xl font-bold text-center gradient-text">GSH Social</h1>
        <p class="text-center text-base-content/60 mb-6">Créez votre compte</p>

        <div v-if="authStore.error" class="alert alert-error mb-4">
          <span>{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="form-control mb-4">
            <label class="label"><span class="label-text">Pseudo</span></label>
            <input
              v-model="name"
              type="text"
              placeholder="Votre pseudo"
              class="input input-bordered"
              required
              minlength="2"
              maxlength="50"
            />
          </div>

          <div class="form-control mb-4">
            <label class="label"><span class="label-text">Email</span></label>
            <input
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control mb-4">
            <label class="label"><span class="label-text">Mot de passe</span></label>
            <input
              v-model="password"
              type="password"
              placeholder="Minimum 6 caractères"
              class="input input-bordered"
              required
              minlength="6"
            />
          </div>

          <div class="form-control mb-6">
            <label class="label"><span class="label-text">Confirmer le mot de passe</span></label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              class="input input-bordered"
              required
            />
            <label v-if="passwordMismatch" class="label">
              <span class="label-text-alt text-error">Les mots de passe ne correspondent pas</span>
            </label>
          </div>

          <!-- Consentement RGPD -->
          <div class="form-control mb-6">
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="acceptRGPD" type="checkbox" class="checkbox checkbox-primary" required />
              <span class="label-text text-sm">
                J'accepte les <a href="#" class="link link-primary">conditions d'utilisation</a>
                et la <a href="#" class="link link-primary">politique de confidentialité</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="authStore.loading || passwordMismatch || !acceptRGPD"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            S'inscrire
          </button>
        </form>

        <p class="text-center mt-4 text-sm">
          Déjà un compte ?
          <RouterLink to="/login" class="link link-primary">Se connecter</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptRGPD = ref(false)

const passwordMismatch = computed(() =>
  confirmPassword.value && password.value !== confirmPassword.value
)

const handleRegister = async () => {
  if (passwordMismatch.value || !acceptRGPD.value) return

  const success = await authStore.register(name.value, email.value, password.value)
  if (success) {
    router.push('/feed')
  }
}
</script>
```

### src/views/FeedView.vue
```vue
<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Stories Bar -->
      <StoriesBar />

      <!-- Hashtag Filter -->
      <div v-if="postsStore.allHashtags.length > 0" class="flex flex-wrap gap-2">
        <button
          v-for="tag in postsStore.allHashtags"
          :key="tag"
          class="badge badge-lg cursor-pointer"
          :class="postsStore.hashtagFilter === tag ? 'badge-primary' : 'badge-outline'"
          @click="postsStore.filterByHashtag(tag)"
        >
          #{{ tag }}
        </button>
        <button
          v-if="postsStore.hashtagFilter"
          class="badge badge-lg badge-ghost cursor-pointer"
          @click="postsStore.filterByHashtag(null)"
        >
          ✕ Effacer filtre
        </button>
      </div>

      <!-- Create Post Quick -->
      <PostForm @submit="handleCreatePost" />

      <!-- Suggestions d'amis -->
      <FriendSuggestions />

      <!-- Posts Feed -->
      <div v-if="postsStore.loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else class="space-y-4">
        <PostCard
          v-for="post in postsStore.sortedPosts"
          :key="post.id"
          :post="post"
          @like="handleLike"
          @comment="handleComment"
          @delete="handleDelete"
          @filterHashtag="postsStore.filterByHashtag"
        />
      </div>

      <div v-if="!postsStore.loading && postsStore.sortedPosts.length === 0" class="text-center py-8">
        <p class="text-base-content/60">Aucun post pour le moment</p>
        <p class="text-sm text-base-content/40">Soyez le premier à publier !</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import AppLayout from '@/components/layout/AppLayout.vue'
import StoriesBar from '@/components/stories/StoriesBar.vue'
import PostForm from '@/components/posts/PostForm.vue'
import PostCard from '@/components/posts/PostCard.vue'
import FriendSuggestions from '@/components/users/FriendSuggestions.vue'

const postsStore = usePostsStore()

onMounted(() => {
  postsStore.fetchPosts()
  postsStore.fetchStories()
})

const handleCreatePost = async (content, image) => {
  await postsStore.addPost(content, image)
}

const handleLike = async (postId) => {
  await postsStore.likePost(postId)
}

const handleComment = async (postId, content) => {
  await postsStore.addComment(postId, content)
}

const handleDelete = async (postId) => {
  await postsStore.deletePost(postId)
}
</script>
```

### src/views/EditProfileView.vue
```vue
<template>
  <AppLayout>
    <div class="card bg-base-100 shadow-xl max-w-lg mx-auto">
      <div class="card-body">
        <h1 class="card-title text-2xl">Modifier mon profil</h1>

        <form @submit.prevent="handleSave">
          <!-- Avatar preview -->
          <div class="flex justify-center mb-4">
            <div class="avatar">
              <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img :src="avatar || authStore.user?.avatar" alt="Avatar" />
              </div>
            </div>
          </div>

          <div class="form-control mb-4">
            <label class="label"><span class="label-text">URL de l'avatar</span></label>
            <input
              v-model="avatar"
              type="url"
              placeholder="https://..."
              class="input input-bordered"
            />
          </div>

          <div class="form-control mb-4">
            <label class="label"><span class="label-text">Nom</span></label>
            <input
              v-model="name"
              type="text"
              class="input input-bordered"
              required
              maxlength="50"
            />
          </div>

          <div class="form-control mb-6">
            <label class="label"><span class="label-text">Bio</span></label>
            <textarea
              v-model="bio"
              class="textarea textarea-bordered"
              placeholder="Décrivez-vous en quelques mots..."
              rows="3"
              maxlength="200"
            ></textarea>
            <label class="label">
              <span class="label-text-alt">{{ bio.length }}/200 caractères</span>
            </label>
          </div>

          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary flex-1">Enregistrer</button>
            <RouterLink to="/profile" class="btn btn-ghost">Annuler</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const bio = ref('')
const avatar = ref('')

onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name || ''
    bio.value = authStore.user.bio || ''
    avatar.value = authStore.user.avatar || ''
  }
})

const handleSave = async () => {
  const updates = {}
  if (name.value.trim()) updates.name = name.value.trim()
  if (bio.value !== authStore.user.bio) updates.bio = bio.value.trim()
  if (avatar.value && avatar.value !== authStore.user.avatar) updates.avatar = avatar.value

  const success = await authStore.updateProfile(updates)
  if (success) {
    router.push('/profile')
  }
}
</script>
```

### src/views/ChatView.vue
```vue
<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="navbar bg-base-100 shadow-sm">
      <button class="btn btn-ghost btn-sm" @click="$router.back()">←</button>
      <div class="flex items-center gap-2 flex-1">
        <div class="avatar">
          <div class="w-8 rounded-full">
            <img :src="otherUser?.avatar" :alt="otherUser?.name" />
          </div>
        </div>
        <span class="font-semibold flex items-center gap-1">
          {{ otherUser?.name }}
          <UserBadge v-if="otherUser" :userId="otherUser.id" />
        </span>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="chatMessages.length === 0" class="text-center py-8">
        <p class="text-base-content/60">Démarrez la conversation !</p>
      </div>
      <div
        v-for="msg in chatMessages"
        :key="msg.id"
        class="chat"
        :class="msg.senderId === authStore.user?.id ? 'chat-end' : 'chat-start'"
      >
        <div
          class="chat-bubble"
          :class="msg.senderId === authStore.user?.id ? 'chat-bubble-primary' : ''"
        >
          {{ msg.content }}
        </div>
        <div class="chat-footer opacity-50 text-xs">
          {{ formatTime(msg.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 bg-base-100 border-t">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Écrire un message..."
          class="input input-bordered flex-1"
          @keyup.enter="handleSend"
          maxlength="1000"
        />
        <button class="btn btn-primary" @click="handleSend" :disabled="!newMessage.trim()">
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { useUsersStore } from '@/stores/users'
import UserBadge from '@/components/users/UserBadge.vue'

const route = useRoute()
const authStore = useAuthStore()
const messagesStore = useMessagesStore()
const usersStore = useUsersStore()

const otherUser = ref(null)
const chatMessages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSend = async () => {
  if (!newMessage.value.trim()) return
  await messagesStore.sendMessage(route.params.userId, newMessage.value)
  newMessage.value = ''
  scrollToBottom()
}

onMounted(async () => {
  otherUser.value = await usersStore.getUserById(route.params.userId)
  messagesStore.startPolling(route.params.userId)
})

onUnmounted(() => {
  messagesStore.stopPolling()
})

watch(() => messagesStore.messages, () => {
  chatMessages.value = [...messagesStore.messages]
  scrollToBottom()
}, { deep: true })
</script>
```

### src/views/SearchView.vue
```vue
<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Rechercher</h1>

      <!-- Search Input -->
      <div class="form-control">
        <input
          v-model="query"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="input input-bordered w-full"
        />
      </div>

      <!-- Users List -->
      <div v-if="usersStore.loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="card card-side bg-base-100 shadow-sm"
        >
          <figure class="pl-4 py-4">
            <div class="avatar">
              <div class="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img :src="user.avatar" :alt="user.name" />
              </div>
            </div>
          </figure>
          <div class="card-body py-4">
            <RouterLink :to="`/user/${user.id}`" class="card-title text-base hover:underline flex items-center gap-1">
              {{ user.name }}
              <UserBadge :userId="user.id" />
            </RouterLink>
            <p class="text-sm text-base-content/60">{{ user.bio || 'Pas de bio' }}</p>
            <p class="text-xs text-base-content/40">{{ user.followers?.length || 0 }} abonnés</p>
          </div>
          <div class="card-actions justify-end pr-4 items-center">
            <button
              class="btn btn-sm"
              :class="isFollowing(user.id) ? 'btn-outline' : 'btn-primary'"
              @click="toggleFollow(user.id)"
            >
              {{ isFollowing(user.id) ? 'Suivi' : 'Suivre' }}
            </button>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="text-center py-8">
          <p class="text-base-content/60">Aucun utilisateur trouvé</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import AppLayout from '@/components/layout/AppLayout.vue'
import UserBadge from '@/components/users/UserBadge.vue'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const query = ref('')

onMounted(() => {
  usersStore.fetchAllUsers()
})

const filteredUsers = computed(() => {
  return usersStore.searchUsers(query.value)
})

const isFollowing = (userId) => {
  return authStore.user?.following?.includes(userId) ?? false
}

const toggleFollow = async (userId) => {
  if (isFollowing(userId)) {
    await authStore.unfollowUser(userId)
  } else {
    await authStore.followUser(userId)
  }
}
</script>
```

---

## 12. Fonctionnalités détaillées

### CRUD complet des posts

| Action | Frontend | API json-server |
|--------|----------|-----------------|
| **Créer** | `postsStore.addPost(content, image)` | `POST /posts` |
| **Lire** | `postsStore.fetchPosts()` | `GET /posts?_sort=createdAt&_order=desc` |
| **Modifier** | `postsStore.updatePost(id, updates)` | `PATCH /posts/:id` |
| **Supprimer** | `postsStore.deletePost(id)` | `DELETE /posts/:id` |
| **Liker** | `postsStore.likePost(id)` | `PATCH /posts/:id` |
| **Commenter** | `postsStore.addComment(id, content)` | `PATCH /posts/:id` |

### Hashtags
- Extraits automatiquement du contenu du post (`#mot`)
- Stockés dans un tableau `hashtags` sur chaque post
- Filtre par hashtag dans le fil d'actualité
- Clic sur un hashtag → filtre le fil

### Suggestions d'amis
- Logique : tous les utilisateurs que je ne suis pas encore
- Si je crée compte A et compte B :
  - A voit B dans ses suggestions (et inversement)
- Bouton "Suivre" directement dans le widget

### Messagerie
- Polling toutes les 2 secondes (json-server ne supporte pas WebSocket)
- Création automatique de conversation au premier message
- Historique persisté dans `db.json`

---

## 13. Gestion du thème

DaisyUI gère nativement les thèmes via l'attribut `data-theme` sur `<html>`.

```javascript
// Dans le store theme.js
document.documentElement.setAttribute('data-theme', 'dark') // ou 'light'
```

Le choix est persisté via Pinia + localStorage. Tous les composants DaisyUI s'adaptent automatiquement.

---

## 14. Badges utilisateurs

| Type | Condition | Icône |
|------|-----------|-------|
| Bot | `userId.startsWith('bot-')` | 🤖 (robot gris) |
| Vérifié | Tout autre utilisateur réel | ✓ (badge bleu) |

Utiliser le composant `UserBadge.vue` partout où un nom d'utilisateur est affiché :
- PostCard (auteur + commentaires)
- StoryCircle
- SearchView
- ChatView
- Messages
- ProfileView

---

## 15. Conformité RGPD

### Obligations légales
Le projet traite des données personnelles d'élèves et enseignants. Il doit respecter le RGPD :

1. **Consentement explicite** : Checkbox obligatoire à l'inscription
2. **Droit d'accès** : L'utilisateur peut voir toutes ses données (profil)
3. **Droit de modification** : Page de modification du profil
4. **Droit de suppression** : Possibilité de supprimer son compte
5. **Minimisation** : Ne collecter que les données nécessaires
6. **Transparence** : Page de politique de confidentialité

### Implémentation technique
```javascript
// Ajouter dans le store auth.js :

/**
 * Supprimer mon compte (RGPD - droit à l'oubli)
 * Supprime l'utilisateur, ses posts et ses messages
 */
async function deleteAccount() {
  if (!user.value) return

  try {
    // Supprimer mes posts
    const myPosts = await api.get(`/posts?userId=${user.value.id}`)
    for (const post of myPosts.data) {
      await api.delete(`/posts/${post.id}`)
    }

    // Supprimer mon compte
    await api.delete(`/users/${user.value.id}`)

    // Déconnexion
    logout()
    return true
  } catch (err) {
    console.error('Erreur lors de la suppression du compte', err)
    return false
  }
}
```

### Sécurité des mots de passe
- Longueur minimum : 6 caractères
- Avec json-server-auth : hashage automatique bcrypt
- Avec MongoDB : utiliser `bcryptjs` pour hasher avant stockage

---

## 16. Évolution json-server-auth

```bash
npm install -D json-server-auth
```

### Script modifié
```json
{
  "scripts": {
    "server": "json-server-auth --watch db.json --port 3001"
  }
}
```

### Adapter le store auth
```javascript
async function login(email, password) {
  const response = await api.post('/login', { email, password })
  token.value = response.data.accessToken
  // Récupérer le profil complet
  const userResponse = await api.get(`/users/${response.data.user.id}`)
  user.value = userResponse.data
}

async function register(name, email, password) {
  const response = await api.post('/register', {
    email, password, name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    bio: '', isBot: false, followers: [], following: []
  })
  token.value = response.data.accessToken
  user.value = response.data.user
}
```

### Endpoints automatiques
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Inscription (retourne JWT) |
| POST | `/login` | Connexion (retourne JWT) |
| GET | `/600/users` | Users (authentifié) |
| GET | `/664/posts` | Posts (tous en lecture, auth pour écrire) |

---

## 17. Migration MongoDB

### Architecture Node.js + Express + MongoDB

```bash
mkdir gsh-social-api && cd gsh-social-api
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv multer
```

### Structure backend
```
gsh-social-api/
├── server.js
├── .env
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Message.js
│   └── Conversation.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   ├── users.js
│   └── messages.js
├── middleware/
│   └── auth.js        # Vérification JWT
└── config/
    └── db.js          # Connexion MongoDB
```

### Modèle User (Mongoose)
```javascript
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 200 },
  isBot: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

// Hash le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
```

L'API Express expose les mêmes endpoints que json-server, ce qui permet de changer **uniquement** `baseURL` dans `api.js` sans toucher au frontend.

---

## 18. Plan de réalisation (8 semaines)

| Semaine | Objectif | Livrables |
|---------|----------|-----------|
| **S1** | Mise en place du projet | Vite + Vue 3 + TailwindCSS + DaisyUI + Router. Composants de base (layout, navbar, bottom nav) |
| **S2** | Authentification simple | Pages login/register. Pinia + persistance localStorage. Protection des routes |
| **S3** | Intégration json-server | `db.json` avec users + posts. Configuration Axios. CRUD basique côté frontend |
| **S4** | Auth via json-server | Connexion email/password. Stockage dans Pinia. Routes protégées |
| **S5** | Posts & interactions | CRUD posts complet. Likes, commentaires, hashtags. Fil d'actualité |
| **S6** | Auth réaliste | json-server-auth ou middleware. Protection endpoints. Sécurité JWT |
| **S7** | Profils & avancé | Page profil (bio, avatar, posts). Follow/unfollow. Suggestions d'amis. Messagerie. Mode sombre/clair |
| **S8** | Finalisation | Tests complets. Badges bot/vérifié. Documentation. Déploiement. Présentation |

---

## 19. Checklist de validation

### ✅ Inscription / Connexion
- [ ] Créer un compte → données enregistrées dans `db.json`
- [ ] Se connecter avec les identifiants créés
- [ ] Déconnexion → retour à la page login
- [ ] Routes protégées inaccessibles sans connexion
- [ ] Le profil affiche les bonnes données de l'utilisateur connecté

### ✅ Multi-utilisateurs
- [ ] Créer compte A et compte B
- [ ] Compte A voit compte B dans les suggestions (et inversement)
- [ ] Follow/unfollow fonctionne correctement
- [ ] Chaque utilisateur a sa section distincte (profil, posts)

### ✅ Publications (CRUD)
- [ ] Créer un post → enregistré dans `db.json`
- [ ] Le post apparaît dans le fil général
- [ ] Modifier un post (seulement le propriétaire)
- [ ] Supprimer un post (seulement le propriétaire)
- [ ] Les posts restent après actualisation
- [ ] Hashtags extraits et filtrables
- [ ] Tous les utilisateurs voient le post

### ✅ Interactions
- [ ] Liker / unliker un post
- [ ] Ajouter un commentaire
- [ ] Les compteurs (likes, commentaires) sont corrects

### ✅ Messagerie
- [ ] Envoyer un message de A vers B
- [ ] B voit le message (polling)
- [ ] L'historique est conservé dans `db.json`
- [ ] Les messages restent après actualisation

### ✅ Profil
- [ ] Voir mon profil avec mes posts
- [ ] Modifier bio et avatar
- [ ] Voir le profil d'un autre utilisateur

### ✅ Thème
- [ ] Activer/désactiver le mode sombre
- [ ] Le choix est conservé après actualisation
- [ ] Design cohérent en mode clair et sombre

### ✅ Badges
- [ ] Les bots affichent l'icône 🤖
- [ ] Les vrais utilisateurs affichent le badge vérifié ✓

### ✅ Responsive
- [ ] Desktop : navigation horizontale
- [ ] Mobile : bottom navigation
- [ ] Tablette : layout adapté

### ✅ RGPD
- [ ] Consentement à l'inscription
- [ ] Possibilité de modifier ses données
- [ ] Possibilité de supprimer son compte

---

## 20. Scripts npm

### package.json
```json
{
  "name": "gsh-social",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "json-server --watch db.json --port 3001",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\"",
    "server:auth": "json-server-auth --watch db.json --port 3001"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "date-fns": "^3.6.0",
    "pinia": "^2.2.0",
    "pinia-plugin-persistedstate": "^4.1.0",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "autoprefixer": "^10.4.0",
    "concurrently": "^9.1.0",
    "daisyui": "^4.12.0",
    "json-server": "^0.17.4",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^6.0.0"
  }
}
```

### Commandes
```bash
# Développement (frontend uniquement)
npm run dev

# Backend json-server (dans un autre terminal)
npm run server

# Tout en même temps
npm run dev:full

# Build production
npm run build
```

Le frontend sera accessible sur `http://localhost:5173`
L'API json-server sera accessible sur `http://localhost:3001`

---

## Résumé des résultats attendus

Avec ce guide, vous pourrez :

1. ✅ **Créer deux comptes différents** (A et B) enregistrés dans `db.json`
2. ✅ **Se connecter avec chacun** via email + mot de passe
3. ✅ **Voir les suggestions** : A voit B, B voit A
4. ✅ **S'envoyer des messages** avec historique persistant
5. ✅ **Poster du contenu visible par tous** avec likes, commentaires, hashtags
6. ✅ **Modifier/supprimer ses posts** (CRUD complet)
7. ✅ **Activer/désactiver le mode sombre** avec persistance
8. ✅ **Design cohérent et moderne** avec DaisyUI
9. ✅ **Badges** : 🤖 pour les bots, ✓ pour les vrais utilisateurs
10. ✅ **Profils modifiables** (bio, avatar)
11. ✅ **Conformité RGPD** (consentement, suppression de compte)
12. ✅ **Code portable** : fonctionne dans VS Code, sans dépendance à Lovable

---

> **Bonne chance pour votre projet GSH Social ! 🚀**
> *Lycée Geoffroy Saint-Hilaire — BTS SIO SLAM*
