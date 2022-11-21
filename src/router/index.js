import PageHome from '@/components/pages/PageHome'
import PageThreadShow from '@/components/pages/PageThreadShow'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/components/pages/PageNotFound'
import sourceData from '@/data.json'
import PageForum from '@/components/pages/PageForum.vue'
import Category from '@/components/pages/PageCategories'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
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
      const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)
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
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
