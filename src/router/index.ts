import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'


import ServiceRecords from '../views/ServiceRecords/ServiceRecords.vue'
import RolePermission from '@/views/RolePermission.vue'
import AccessDenied from '../views/AccessDenied.vue'
import PageNotFound from '../views/PageNotFound.vue'

import LabTestRoutes from "@/router/labtest-routes";
import PatientRoutes from "@/router/patient-routes";
import MedicineRoutes from "@/router/medicine-routes";
import PrescriptionRoutes from "@/router/prescription-routes";
import HealthServiceRoutes from "@/router/health-service-routes";
import ServiceCategoryRoutes from './service-category-routes';
import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  
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

  ...LabTestRoutes,
  {
    path:'/role-permissions',
    name:'role-permissions',
    component:RolePermission
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path:'/access-denied',
    component: AccessDenied
  },
  {
    path: '*',
    name: 'pagenotfound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
