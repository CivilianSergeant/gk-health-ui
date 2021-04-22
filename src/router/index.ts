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

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  
  {
    name:'Health Centers',
    path: '/health-centers',
    component: HealthCenter
  },
  {
    name:'Employees',
    path: '/employees',
    component: Employees
  },
  {
    name:'Service Records',
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
    name:'Role and Permissions',
    component:RolePermission
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    name: 'Access Denied',
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
