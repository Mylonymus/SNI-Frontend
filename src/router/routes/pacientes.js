export default [
  {
    path: '/pacientes/listado',
    name: 'patients-list',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-cities" */ '@/components/PatientsList.vue')
  },
  {
    path: '/doctores/listado',
    name: 'drs-list',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-users" */ '@/components/DrsList.vue')
  },
  {
    path: '/enfermeria/listado',
    name: 'nursering-list',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-users" */ '@/components/NurseringList.vue')
  }
]
