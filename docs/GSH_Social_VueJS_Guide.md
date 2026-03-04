# GSH Social - Guide de Migration Vue.js 3 + Pinia

Ce guide vous permet de recréer le projet GSH Social avec la stack technique du cahier des charges :
- **Frontend** : Vue.js 3 + Vite
- **UI** : TailwindCSS + DaisyUI
- **State** : Pinia (avec persistance localStorage)
- **Backend** : json-server → json-server-auth → MongoDB

---

## 1. Installation du projet

```bash
# Créer le projet Vue.js 3 avec Vite
npm create vite@latest gsh-social -- --template vue
cd gsh-social

# Installer les dépendances
npm install

# Installer TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Installer DaisyUI
npm install -D daisyui@latest

# Installer Pinia et son plugin de persistance
npm install pinia pinia-plugin-persistedstate

# Installer Vue Router
npm install vue-router@4

# Installer Axios pour les appels API
npm install axios

# Installer json-server (backend simulé)
npm install -D json-server
```

---

## 2. Configuration TailwindCSS + DaisyUI

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "corporate"],
  },
}
```

### src/style.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 3. Structure du projet

```
gsh-social/
├── db.json                    # Base de données json-server
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.vue
│   │   │   ├── Navbar.vue
│   │   │   └── BottomNav.vue
│   │   ├── posts/
│   │   │   ├── PostCard.vue
│   │   │   ├── PostForm.vue
│   │   │   └── CommentSection.vue
│   │   ├── stories/
│   │   │   ├── StoriesBar.vue
│   │   │   ├── StoryCircle.vue
│   │   │   └── StoryViewer.vue
│   │   └── ui/
│   │       └── ... (composants réutilisables)
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js            # Store Pinia pour l'authentification
│   │   ├── posts.js           # Store Pinia pour les posts
│   │   ├── messages.js        # Store Pinia pour la messagerie
│   │   └── users.js           # Store Pinia pour les utilisateurs
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── FeedView.vue
│   │   ├── ProfileView.vue
│   │   ├── MessagesView.vue
│   │   ├── ChatView.vue
│   │   └── SearchView.vue
│   ├── services/
│   │   └── api.js             # Configuration Axios
│   ├── App.vue
│   └── main.js
└── package.json
```

---

## 4. Configuration Pinia avec persistance

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

## 5. Stores Pinia

### src/stores/auth.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  async function login(email, password) {
    try {
      error.value = null
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
      error.value = 'Erreur de connexion'
      return false
    }
  }

  async function register(name, email, password) {
    try {
      error.value = null
      
      // Vérifier si l'email existe déjà
      const existing = await api.get('/users', { params: { email } })
      if (existing.data.length > 0) {
        error.value = 'Cet email est déjà utilisé'
        return false
      }

      // Créer le nouvel utilisateur
      const newUser = {
        name,
        email,
        password,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        bio: '',
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      }

      const response = await api.post('/users', newUser)
      user.value = response.data
      token.value = 'mock-jwt-token-' + response.data.id
      return true
    } catch (err) {
      error.value = 'Erreur lors de l\'inscription'
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
  }

  async function updateProfile(updates) {
    if (!user.value) return
    
    try {
      const response = await api.patch(`/users/${user.value.id}`, updates)
      user.value = response.data
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil', err)
    }
  }

  async function followUser(targetUserId) {
    if (!user.value || targetUserId === user.value.id) return
    
    try {
      // Mettre à jour le following de l'utilisateur courant
      const updatedFollowing = [...user.value.following, targetUserId]
      await api.patch(`/users/${user.value.id}`, { following: updatedFollowing })
      user.value.following = updatedFollowing

      // Mettre à jour le followers de l'utilisateur cible
      const targetUser = await api.get(`/users/${targetUserId}`)
      const updatedFollowers = [...targetUser.data.followers, user.value.id]
      await api.patch(`/users/${targetUserId}`, { followers: updatedFollowers })
    } catch (err) {
      console.error('Erreur lors du suivi', err)
    }
  }

  async function unfollowUser(targetUserId) {
    if (!user.value) return
    
    try {
      // Mettre à jour le following de l'utilisateur courant
      const updatedFollowing = user.value.following.filter(id => id !== targetUserId)
      await api.patch(`/users/${user.value.id}`, { following: updatedFollowing })
      user.value.following = updatedFollowing

      // Mettre à jour le followers de l'utilisateur cible
      const targetUser = await api.get(`/users/${targetUserId}`)
      const updatedFollowers = targetUser.data.followers.filter(id => id !== user.value.id)
      await api.patch(`/users/${targetUserId}`, { followers: updatedFollowers })
    } catch (err) {
      console.error('Erreur lors du désabonnement', err)
    }
  }

  return {
    // State
    user,
    token,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    updateProfile,
    followUser,
    unfollowUser
  }
}, {
  persist: true // Persistance automatique dans localStorage
})
```

### src/stores/posts.js
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

  // Getters
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => 
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

  async function addPost(content, image = null) {
    if (!authStore.user || !content.trim()) return
    
    try {
      const newPost = {
        content,
        image,
        likes: 0,
        likedBy: [],
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

  async function deletePost(postId) {
    if (!authStore.user) return
    
    try {
      await api.delete(`/posts/${postId}`)
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (err) {
      console.error('Erreur lors de la suppression du post', err)
    }
  }

  async function likePost(postId) {
    if (!authStore.user) return
    
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const alreadyLiked = post.likedBy.includes(authStore.user.id)
    
    const updatedPost = {
      ...post,
      likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
      likedBy: alreadyLiked 
        ? post.likedBy.filter(id => id !== authStore.user.id)
        : [...post.likedBy, authStore.user.id]
    }

    try {
      await api.patch(`/posts/${postId}`, {
        likes: updatedPost.likes,
        likedBy: updatedPost.likedBy
      })
      
      const index = posts.value.findIndex(p => p.id === postId)
      posts.value[index] = updatedPost
    } catch (err) {
      console.error('Erreur lors du like', err)
    }
  }

  async function addComment(postId, content) {
    if (!authStore.user || !content.trim()) return
    
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const newComment = {
      id: Date.now().toString(),
      content,
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
      console.error('Erreur lors de l\'ajout du commentaire', err)
    }
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
    // State
    posts,
    stories,
    loading,
    // Getters
    sortedPosts,
    activeStories,
    // Actions
    fetchPosts,
    fetchStories,
    addPost,
    deletePost,
    likePost,
    addComment,
    addStory,
    viewStory
  }
}, {
  persist: {
    paths: ['posts', 'stories'] // Persister uniquement ces propriétés
  }
})
```

### src/stores/messages.js
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
      const response = await api.get(`/messages?conversationId=${conversationId}`)
      return response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } catch (err) {
      console.error('Erreur lors du chargement des messages', err)
      return []
    }
  }

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
        content,
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
      console.error('Erreur lors de l\'envoi du message', err)
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

  return {
    conversations,
    messages,
    unreadCount,
    sortedConversations,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead
  }
}, {
  persist: true
})
```

### src/stores/users.js
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useUsersStore = defineStore('users', () => {
  const authStore = useAuthStore()
  
  // State
  const users = ref([])
  const loading = ref(false)

  // Actions
  async function fetchAllUsers() {
    loading.value = true
    try {
      const response = await api.get('/users')
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
      console.error('Erreur lors du chargement de l\'utilisateur', err)
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
      u.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    users,
    loading,
    fetchAllUsers,
    getUserById,
    getUserPosts,
    searchUsers
  }
})
```

---

## 6. Service API (Axios)

### src/services/api.js
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001', // URL de json-server
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT (pour json-server-auth)
api.interceptors.request.use(config => {
  const authData = localStorage.getItem('auth')
  if (authData) {
    const { token } = JSON.parse(authData)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
```

---

## 7. Vue Router

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navigation pour protéger les routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'feed' })
  } else {
    next()
  }
})

export default router
```

---

## 8. Base de données JSON-server

### db.json
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
      "followers": ["bot-lucas", "bot-sophie", "bot-thomas"],
      "following": ["bot-lucas", "bot-sophie", "bot-camille"]
    },
    {
      "id": "bot-lucas",
      "name": "Lucas Dubois",
      "email": "lucas.dubois@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      "bio": "Développeur web 💻 | Tech enthusiast",
      "followers": ["bot-emma", "bot-sophie"],
      "following": ["bot-emma", "bot-maxime", "bot-antoine"]
    },
    {
      "id": "bot-sophie",
      "name": "Sophie Bernard",
      "email": "sophie.bernard@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      "bio": "Designer UI/UX ✨ | Créative",
      "followers": ["bot-emma", "bot-lucas", "bot-camille"],
      "following": ["bot-emma", "bot-lucas", "bot-julie"]
    },
    {
      "id": "bot-thomas",
      "name": "Thomas Petit",
      "email": "thomas.petit@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      "bio": "Voyageur 🌍 | Amateur de café ☕",
      "followers": ["bot-camille", "bot-julie"],
      "following": ["bot-emma", "bot-camille", "bot-antoine"]
    },
    {
      "id": "bot-camille",
      "name": "Camille Leroy",
      "email": "camille.leroy@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      "bio": "Foodie 🍜 | Lyon",
      "followers": ["bot-emma", "bot-thomas"],
      "following": ["bot-sophie", "bot-thomas", "bot-julie"]
    },
    {
      "id": "bot-maxime",
      "name": "Maxime Moreau",
      "email": "maxime.moreau@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      "bio": "Gamer 🎮 | Streamer",
      "followers": ["bot-lucas"],
      "following": ["bot-lucas", "bot-antoine"]
    },
    {
      "id": "bot-julie",
      "name": "Julie Simon",
      "email": "julie.simon@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      "bio": "Fitness addict 💪 | Coach sportif",
      "followers": ["bot-sophie", "bot-camille"],
      "following": ["bot-thomas", "bot-camille"]
    },
    {
      "id": "bot-antoine",
      "name": "Antoine Garcia",
      "email": "antoine.garcia@gsh.com",
      "password": "bot123",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      "bio": "Musicien 🎸 | Marseille",
      "followers": ["bot-lucas", "bot-thomas", "bot-maxime"],
      "following": ["bot-maxime"]
    }
  ],
  "posts": [
    {
      "id": "post-1",
      "content": "Belle journée pour une session photo au Trocadéro ! 📸 La lumière était parfaite ce matin. #Paris #Photography",
      "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
      "likes": 42,
      "likedBy": ["bot-lucas", "bot-sophie", "bot-thomas"],
      "comments": [
        {
          "id": "comment-1",
          "content": "Magnifique ! Tu as un talent fou 🔥",
          "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
          "createdAt": "2026-01-13T08:00:00.000Z"
        }
      ],
      "userId": "bot-emma",
      "user": { "id": "bot-emma", "name": "Emma Martin", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-13T07:00:00.000Z"
    },
    {
      "id": "post-2",
      "content": "Nouveau projet React lancé ! 🚀 Stack : React + TypeScript + Tailwind. Qui est dans la tech ici ?",
      "image": null,
      "likes": 28,
      "likedBy": ["bot-emma", "bot-sophie"],
      "comments": [],
      "userId": "bot-lucas",
      "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-13T05:00:00.000Z"
    },
    {
      "id": "post-3",
      "content": "Design du jour ✨ Travail sur une nouvelle interface pour une app de méditation.",
      "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      "likes": 67,
      "likedBy": ["bot-emma", "bot-lucas", "bot-camille", "bot-julie"],
      "comments": [],
      "userId": "bot-sophie",
      "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-12T18:00:00.000Z"
    },
    {
      "id": "post-4",
      "content": "Café ☕ + Vue sur la montagne 🏔️ = Télétravail parfait !",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      "likes": 89,
      "likedBy": ["bot-emma", "bot-sophie", "bot-camille", "bot-maxime", "bot-antoine"],
      "comments": [],
      "userId": "bot-thomas",
      "user": { "id": "bot-thomas", "name": "Thomas Petit", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-12T14:00:00.000Z"
    },
    {
      "id": "post-5",
      "content": "Meilleur ramen de Lyon trouvé ! 🍜 DM pour l'adresse !",
      "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
      "likes": 54,
      "likedBy": ["bot-thomas", "bot-julie", "bot-antoine"],
      "comments": [],
      "userId": "bot-camille",
      "user": { "id": "bot-camille", "name": "Camille Leroy", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-12T10:00:00.000Z"
    },
    {
      "id": "post-6",
      "content": "Stream ce soir à 20h ! 🎮 On continue notre run sur Elden Ring.",
      "image": null,
      "likes": 31,
      "likedBy": ["bot-lucas", "bot-antoine"],
      "comments": [],
      "userId": "bot-maxime",
      "user": { "id": "bot-maxime", "name": "Maxime Moreau", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-11T22:00:00.000Z"
    },
    {
      "id": "post-7",
      "content": "Workout du matin terminé ! 💪 5km de course + circuit training.",
      "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
      "likes": 76,
      "likedBy": ["bot-emma", "bot-thomas", "bot-camille", "bot-maxime"],
      "comments": [],
      "userId": "bot-julie",
      "user": { "id": "bot-julie", "name": "Julie Simon", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-11T16:00:00.000Z"
    },
    {
      "id": "post-8",
      "content": "Concert improvisé au Vieux-Port hier soir 🎸 Marseille, tu m'inspires !",
      "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      "likes": 45,
      "likedBy": ["bot-emma", "bot-sophie", "bot-maxime"],
      "comments": [],
      "userId": "bot-antoine",
      "user": { "id": "bot-antoine", "name": "Antoine Garcia", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
      "createdAt": "2026-01-11T12:00:00.000Z"
    }
  ],
  "stories": [
    {
      "id": "story-emma",
      "userId": "bot-emma",
      "user": { "id": "bot-emma", "name": "Emma Martin", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-01-13T09:00:00.000Z"
    },
    {
      "id": "story-lucas",
      "userId": "bot-lucas",
      "user": { "id": "bot-lucas", "name": "Lucas Dubois", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-01-13T08:00:00.000Z"
    },
    {
      "id": "story-sophie",
      "userId": "bot-sophie",
      "user": { "id": "bot-sophie", "name": "Sophie Bernard", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
      "image": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=600&fit=crop",
      "viewed": false,
      "createdAt": "2026-01-13T07:00:00.000Z"
    }
  ],
  "conversations": [],
  "messages": []
}
```

---

## 9. Exemples de composants Vue.js

### src/views/FeedView.vue
```vue
<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Stories Bar -->
      <StoriesBar />
      
      <!-- Create Post -->
      <PostForm @submit="handleCreatePost" />
      
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
        />
      </div>
      
      <div v-if="!postsStore.loading && postsStore.posts.length === 0" class="text-center py-8">
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
          <RouterLink :to="`/user/${post.user.id}`" class="font-bold hover:underline">
            {{ post.user.name }}
          </RouterLink>
          <p class="text-sm text-base-content/60">{{ formatDate(post.createdAt) }}</p>
        </div>
        <div v-if="isOwner" class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-sm btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a @click="$emit('delete', post.id)" class="text-error">Supprimer</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Content -->
      <p class="whitespace-pre-wrap">{{ post.content }}</p>
      
      <!-- Image -->
      <figure v-if="post.image" class="-mx-4 mt-2">
        <img :src="post.image" :alt="post.content" class="w-full object-cover max-h-96" />
      </figure>
      
      <!-- Actions -->
      <div class="flex gap-4 pt-2 border-t border-base-200">
        <button 
          class="btn btn-ghost btn-sm gap-2"
          :class="{ 'text-error': isLiked }"
          @click="$emit('like', post.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" :fill="isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ post.likes }}
        </button>
        
        <button class="btn btn-ghost btn-sm gap-2" @click="showComments = !showComments">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ post.comments.length }}
        </button>
      </div>
      
      <!-- Comments Section -->
      <div v-if="showComments" class="space-y-3 pt-3">
        <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2">
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img :src="comment.user.avatar" :alt="comment.user.name" />
            </div>
          </div>
          <div class="bg-base-200 rounded-lg px-3 py-2 flex-1">
            <p class="font-semibold text-sm">{{ comment.user.name }}</p>
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
          <button class="btn btn-primary btn-sm" @click="submitComment">
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

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like', 'comment', 'delete'])

const authStore = useAuthStore()
const showComments = ref(false)
const newComment = ref('')

const isOwner = computed(() => authStore.user?.id === props.post.user.id)
const isLiked = computed(() => props.post.likedBy.includes(authStore.user?.id))

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const submitComment = () => {
  if (newComment.value.trim()) {
    emit('comment', props.post.id, newComment.value)
    newComment.value = ''
  }
}
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
        <div class="input-group">
          <input 
            v-model="query"
            type="text" 
            placeholder="Rechercher un utilisateur..." 
            class="input input-bordered w-full"
          />
          <button class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
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
            <RouterLink :to="`/user/${user.id}`" class="card-title text-base hover:underline">
              {{ user.name }}
            </RouterLink>
            <p class="text-sm text-base-content/60">{{ user.followers?.length || 0 }} abonnés</p>
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

## 10. Scripts npm

### package.json (section scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "json-server --watch db.json --port 3001",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

Pour installer concurrently :
```bash
npm install -D concurrently
```

---

## 11. Lancer le projet

```bash
# Terminal 1 - Backend API
npm run server

# Terminal 2 - Frontend
npm run dev

# Ou les deux en même temps
npm run dev:full
```

Le frontend sera accessible sur `http://localhost:5173`
L'API json-server sera accessible sur `http://localhost:3001`

---

## 12. Évolution vers json-server-auth

Pour ajouter une authentification JWT sécurisée :

```bash
npm install -D json-server-auth
```

Modifier le script server :
```json
{
  "scripts": {
    "server": "json-server-auth --watch db.json --port 3001"
  }
}
```

Les endpoints d'authentification seront automatiquement disponibles :
- POST `/register` - Inscription
- POST `/login` - Connexion (retourne un JWT)

---

## 13. Suggestions d'amis

### src/components/FriendSuggestions.vue
```vue
<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title text-lg">Suggestions d'amis</h2>
      <div class="space-y-3">
        <div 
          v-for="user in suggestions" 
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
              <span v-if="user.isBot" class="badge badge-ghost badge-xs">🤖</span>
              <span v-else class="text-info">✓</span>
            </RouterLink>
            <p class="text-xs text-base-content/60">{{ user.followers?.length || 0 }} abonnés</p>
          </div>
          <button 
            class="btn btn-primary btn-xs"
            @click="followUser(user.id)"
          >
            Suivre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()

// Suggestions = utilisateurs non suivis par l'utilisateur connecté
const suggestions = computed(() => {
  if (!authStore.user) return []
  return usersStore.users.filter(u => 
    u.id !== authStore.user.id && 
    !authStore.user.following.includes(u.id)
  ).slice(0, 5)
})

const followUser = async (userId) => {
  await authStore.followUser(userId)
}
</script>
```

**Logique clé** : Quand un utilisateur A crée un compte, il apparaît automatiquement dans la liste des suggestions de l'utilisateur B (et inversement), car ils ne se suivent pas encore.

---

## 14. Messagerie temps réel avec polling

Pour simuler le temps réel sans WebSocket (json-server ne les supporte pas), utilisez du polling :

### src/stores/messages.js (version améliorée)
```javascript
// Ajouter dans le store messages existant :

// Polling pour nouveaux messages
let pollingInterval = null

function startPolling(conversationId) {
  stopPolling()
  pollingInterval = setInterval(async () => {
    if (!authStore.user) return
    try {
      const response = await api.get(`/messages?conversationId=${conversationId}&_sort=createdAt&_order=asc`)
      messages.value = response.data
    } catch (err) {
      console.error('Polling error', err)
    }
  }, 2000) // Vérifie toutes les 2 secondes
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}
```

### src/views/ChatView.vue (avec polling)
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
        <span class="font-semibold">{{ otherUser?.name }}</span>
        <span v-if="otherUser?.id?.startsWith('bot-')" class="badge badge-ghost badge-xs">🤖</span>
        <span v-else class="text-info text-sm">✓</span>
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
          @keyup.enter="sendMessage"
        />
        <button class="btn btn-primary" @click="sendMessage" :disabled="!newMessage.trim()">
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

const sendMessage = async () => {
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
  chatMessages.value = messagesStore.messages
  scrollToBottom()
}, { deep: true })
</script>
```

---

## 15. Gestion du thème (Mode sombre/clair)

### src/stores/theme.js
```javascript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light') // 'light' ou 'dark'

  // Appliquer le thème au chargement
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
  persist: {
    paths: ['theme']
  }
})
```

### Utilisation dans App.vue
```vue
<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
```

### Bouton toggle dans la Navbar
```vue
<button class="btn btn-ghost btn-circle" @click="themeStore.toggleTheme()">
  <span v-if="themeStore.theme === 'light'">🌙</span>
  <span v-else>☀️</span>
</button>
```

---

## 16. Badges utilisateurs (Bot vs Vérifié)

Dans tous les composants qui affichent un nom d'utilisateur, ajoutez :

```vue
<!-- Robot pour les bots -->
<span v-if="user.id.startsWith('bot-')" class="badge badge-ghost badge-xs" title="Compte robot">🤖</span>

<!-- Vérifié pour les vrais utilisateurs -->
<span v-else class="text-info" title="Compte vérifié">✓</span>
```

Ou créez un composant réutilisable :

### src/components/ui/UserBadge.vue
```vue
<template>
  <span v-if="isBot" class="inline-flex items-center" title="Compte robot">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
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

---

## 17. Checklist de validation

Utilisez cette checklist pour vérifier que tout fonctionne :

### Inscription / Connexion
- [ ] Créer un compte → données enregistrées dans `db.json`
- [ ] Se connecter avec les identifiants créés
- [ ] Le profil affiche les bonnes données

### Multi-utilisateurs
- [ ] Créer compte A et compte B
- [ ] Compte A voit compte B dans les suggestions
- [ ] Compte B voit compte A dans les suggestions

### Messagerie
- [ ] Envoyer un message de A vers B
- [ ] B voit le message (après polling)
- [ ] L'historique est conservé dans `db.json`
- [ ] Les messages restent après actualisation

### Publications
- [ ] Poster du contenu → enregistré dans `db.json`
- [ ] Le post apparaît dans le fil général
- [ ] Les autres utilisateurs voient le post
- [ ] Les posts restent après actualisation

### Thème
- [ ] Activer/désactiver le mode sombre
- [ ] Le choix est conservé après actualisation
- [ ] Design cohérent en mode clair et sombre

### Badges
- [ ] Les bots affichent l'icône 🤖
- [ ] Les vrais utilisateurs affichent le badge vérifié ✓

---

## 18. Migration vers json-server-auth

Pour ajouter une authentification JWT sécurisée :

```bash
npm install -D json-server-auth
```

Modifier le script server :
```json
{
  "scripts": {
    "server": "json-server-auth --watch db.json --port 3001"
  }
}
```

Les endpoints d'authentification seront automatiquement disponibles :
- POST `/register` - Inscription (retourne un JWT)
- POST `/login` - Connexion (retourne un JWT)

Adapter le store auth :
```javascript
async function login(email, password) {
  const response = await api.post('/login', { email, password })
  token.value = response.data.accessToken
  user.value = response.data.user
}

async function register(name, email, password) {
  const response = await api.post('/register', { email, password, name, avatar: '...', followers: [], following: [] })
  token.value = response.data.accessToken
  user.value = response.data.user
}
```

---

## 19. Migration vers MongoDB (Phase finale)

Pour la production, vous pouvez migrer vers Node.js + Express + MongoDB :

```bash
npm install express mongoose jsonwebtoken bcryptjs cors dotenv
```

Créer un serveur Express qui remplace json-server avec les mêmes endpoints API.

---

Ce guide couvre l'ensemble des fonctionnalités demandées dans le cahier des charges, incluant :
- ✅ Inscription / Connexion avec persistance
- ✅ Suggestions d'amis bidirectionnelles
- ✅ Messagerie avec historique
- ✅ Publications visibles par tous
- ✅ Mode sombre / clair
- ✅ Badges bot 🤖 / vérifié ✓
- ✅ Données persistantes après actualisation

Bonne chance pour votre projet GSH Social ! 🚀
