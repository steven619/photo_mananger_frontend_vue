import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

Vue.use(Router)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/dashboard',
    meta: { title: 'dashboard', icon: 'dashboard' },
    children: [
      {
        path: '/dashboard/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [

  {
    path: '/photo',
    component: Layout,
    redirect: '/photo/photo_view',
    name: 'photo',
    meta: { title: 'photo', icon: 'photo', roles: [] },
    children: [
      {
        path: '/photo/photo_view',
        name: 'photo_manager',
        component: () => import('@/views/photo/photo_view.vue'),
        meta: {
          apis: ['/api/v1/photo/photo_view'],
          title: 'photo_view',
          icon: 'photo',
          roles: [] }
      },
      {
        path: '/photo/photo_manager',
        name: 'photo_manager',
        component: () => import('@/views/photo/photo_manager.vue'),
        meta: {
          apis: ['/api/v1/photo/photo_manager'],
          title: 'photo_manager',
          icon: 'photo',
          roles: [] }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/admin_user',
    name: 'system',
    meta: { title: 'system_set', icon: 'setting', roles: [] },
    children: [
      {
        path: '/system/admin_user',
        name: 'admin_user',
        component: () => import('@/views/system/admin_user.vue'),
        meta: {
          apis: ['/api/v1/system/admin_user', '/api/v1/system/admin_user/<id>'],
          title: 'admin_user',
          icon: 'Administrator',
          roles: [] }
      },
      {
        path: '/system/role',
        name: 'role',
        component: () => import('@/views/system/role.vue'),
        meta: {
          apis: ['/api/v1/system/role', '/api/v1/system/role/<id>'],
          title: 'role',
          icon: 'role',
          roles: [] }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
