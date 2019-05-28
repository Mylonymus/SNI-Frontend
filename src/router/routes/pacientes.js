export default [
  {
    path: '/pacientes/cities',
    name: 'admin-cities',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-cities" */ '@/components/AdminCities.vue')
  },
  {
    path: '/pacientes/listado',
    name: 'admin-users',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-users" */ '@/components/AdminUsers.vue')
  }
]
