import { createRouter, createWebHistory } from 'vue-router'
import { findById } from '@/helpers'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageHome')
  },
  {
    path: '/me',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageProfile'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageProfile'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Categories'),
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageForum'),
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageThreadShow'),
    props: true,
    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      // check if thread exists
      const threadExists = findById(store.state.threads.items, to.params.id)
      // if exists continue
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          // preserve existing query and hash
          query: to.query,
          hash: to.hash
        })
      }
      // if doesnt exist redirect to not found
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageThreadCreate'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageThreadEdit'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageRegister'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Signin'),
    meta: { requiresGuest: true }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter (to, from) {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/PageNotFound')
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
router.afterEach(() => {
  store.dispatch('clearItems', { modules: ['categories', 'forums', 'posts', 'threads'] })
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})
export default router
