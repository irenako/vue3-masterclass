import PageHome from '@/components/pages/PageHome'
import PageThreadShow from '@/components/pages/PageThreadShow'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/components/pages/PageNotFound'
import sourceData from '@/data.json'
import PageForum from '@/components/pages/PageForum.vue'
import Category from '@/components/pages/PageCategories'
import Profile from '@/components/pages/PageProfile'
import ThreadCreate from '@/components/pages/PageThreadCreate'
import ThreadEdit from '@/components/pages/PageThreadEdit'
import { findById } from '@/helpers'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: PageForum,
    props: true
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: PageThreadShow,
    props: true,
    beforeEnter (to, from, next) {
      // check if thread exists
      const threadExists = findById(sourceData.threads, to.params.id)
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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
