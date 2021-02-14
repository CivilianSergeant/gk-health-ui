import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'
import Patients from '../views/Patient/Patients.vue'
import PatientForm from '../views/Patient/PatientForm.vue'
import PatientDetail from '../views/Patient/PatientDetail.vue'
import ServiceCategories from '../views/ServiceCategories.vue'
import Services from '../views/Services.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/health-centers',
    component: HealthCenter
  },
  {
    path: '/employees',
    component: Employees
  },
  {
    path: '/patients/:id',
    component: PatientDetail
  },
  {
    path: '/patients/add',
    component: PatientForm
  },
  {
    path: '/patients',
    component: Patients
  },
  {
    path: '/service-categories',
    component: ServiceCategories
  },
  {
    path: '/services',
    component: Services
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
