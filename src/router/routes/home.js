export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "home" */ '@/components/Home.vue')
  },
  {
    path: '/estudiosPaciente',
    name: 'estudiosPaciente',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "home" */ '@/components/EstudiosPaciente.vue')
  }
]
