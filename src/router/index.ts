import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'


import ServiceRecords from '../views/ServiceRecords/ServiceRecords.vue'

import LabTestRoutes from "@/router/labtest-routes";
import PatientRoutes from "@/router/patient-routes";
import MedicineRoutes from "@/router/medicine-routes";
import PrescriptionRoutes from "@/router/prescription-routes";
import HealthServiceRoutes from "@/router/health-service-routes";
import ServiceCategoryRoutes from './service-category-routes';

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
    name:'serviceRecords',
    path: '/service-records',
    component: ServiceRecords
  },
  ...PatientRoutes,

  ...ServiceCategoryRoutes,

  ...HealthServiceRoutes,

  ...PrescriptionRoutes,

  ...MedicineRoutes,

  ...LabTestRoutes
  
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
