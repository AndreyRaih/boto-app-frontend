import { createRouter, createWebHistory } from 'vue-router'
import { ROUTER } from '@/common/constants';

const routes = [
  {
    path: ROUTER.ROUTE_PATHS.DASHBOARD,
    name: ROUTER.ROUTE_NAMES.DASHBOARD,
    component: () => import(`../views/dashboard/Main.vue`),
    meta: {
      requiredAuth: true
    },
    children: [
      {
        path: ROUTER.ROUTE_PATHS.BOT,
        name: ROUTER.ROUTE_NAMES.BOT,
        component: () => import(`../views/dashboard/views/Bot.vue`)
      },
      {
        path: ROUTER.ROUTE_PATHS.BUILDER,
        name: ROUTER.ROUTE_NAMES.BUILDER,
        component: () => import(`../views/dashboard/views/Builder.vue`)
      },
      {
        path: ROUTER.ROUTE_PATHS.SCENARIO,
        name: ROUTER.ROUTE_NAMES.SCENARIO,
        component: () => import(`../views/dashboard/views/Scenario.vue`)
      },
      {
        path: ROUTER.ROUTE_PATHS.DIALOGS,
        name: ROUTER.ROUTE_NAMES.DIALOGS,
        component: () => import(`../views/dashboard/views/Dialogs.vue`)
      }
    ]
  },
  {
    path: ROUTER.ROUTE_PATHS.LOGIN,
    name: ROUTER.ROUTE_NAMES.LOGIN,
    component: () => import(`../views/login/Main.vue`)
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
