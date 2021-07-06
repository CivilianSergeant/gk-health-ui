import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MonitorDashboard from '../views/Reports/MonitorDashboard.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'

import InvoiceDetail from '../views/ServiceRecords/InvoiceDetail.vue'
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
import VillageRoutes from "@/router/village-routes";
import VoucherRoutes from "@/router/voucher-routes";
import EventRoutes from "@/router/event-routes";
import OperationRoutes from '@/router/operation-routes'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [

  {
    name: 'Health Centers',
    path: '/health-centers',
    component: HealthCenter
  },
  {
    name: 'Employees',
    path: '/employees',
    component: Employees
  },
  {
    name: 'Invoice Details',
    path: '/invoice/by-id/:id',
    component: InvoiceDetail
  },
  {
    name: 'Service Records',
    path: '/service-records',
    component: ServiceRecords
  },
  ...PatientRoutes,

  ...ServiceCategoryRoutes,

  ...HealthServiceRoutes,

  ...PrescriptionRoutes,

  ...MedicineRoutes,

  ...VillageRoutes,

  ...LabTestRoutes,

  ...VoucherRoutes,

  ...EventRoutes,

  ...OperationRoutes,
  {
    path: '/role-permissions',
    name: 'Role and Permissions',
    component: RolePermission
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/monitor-statistics',
    name: 'Monitor Statistics',
    component: MonitorDashboard
  },
  {
    name: 'Access Denied',
    path: '/access-denied',
    component: AccessDenied
  },
  {
    path: '*',
    name: 'Page not found',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
