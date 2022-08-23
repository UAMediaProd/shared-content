import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/hourglass.vue'

const routes = [
  {
    path: '/',
    name: 'Research Hourglass',
    component: HomeView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})

export default router
