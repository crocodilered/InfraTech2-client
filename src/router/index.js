import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const routerOptions = [
  { path: '/', component: 'Signin' },
  { path: '/signin', component: 'Signin' },
  { path: '/feedback', component: 'Feedback' },
  { path: '/dashboard', component: 'Dashboard', meta: { requiresAuth: true } },
  { path: '/maintenance', component: 'Maintenance', meta: { requiresAuth: true } },
  { path: '/dir/equipment', component: 'DirectoriesEquipment', meta: { requiresAuth: true } },
  { path: '/dir/contracts', component: 'DirectoriesContracts', meta: { requiresAuth: true } },
  { path: '*', component: 'Error404' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  // 1st time it's false
  const isAuthenticated = store.getters.isAuthenticated
  if (requiresAuth && !isAuthenticated) {
    next('/signin')
  } else {
    next()
  }
})

export default router
