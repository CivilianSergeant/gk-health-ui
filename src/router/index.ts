import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'
import Patients from '../views/Patient/Patients.vue'
import PatientForm from '../views/Patient/PatientForm.vue'
import PatientDetail from '../views/Patient/PatientDetail.vue'
import ServiceCategories from '../views/HealthService/ServiceCategories.vue'
import ServiceCategoryForm from '../views/HealthService/ServiceCategoryForm.vue'
import ServiceRecords from '../views/ServiceRecords/ServiceRecords.vue'
import PrescriptionForm from '../views/Prescription/PrescriptionForm.vue'
import Prescription from '../views/Prescription/Prescription.vue'
import PrescriptionView from '../views/Prescription/PrescriptionView.vue'
import Medicine from '../views/Medicine/Medicine.vue'
import MedicineForm from '../views/Medicine/MedicineForm.vue'
import {Services,ServiceForm, ServiceDetail, ServiceAttribute }from '../views/HealthService'

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
    name:'patient-create',
    path: '/patients/add',
    component: PatientForm
  },
  {
    path: '/patients/:id',
    component: PatientDetail
  },
  {
    path: '/patients/:id/edit',
    component: PatientForm
  },
  {
    name:'patients',
    path: '/patients',
    component: Patients
  },
  {
    name:'edit-service-category',
    path: '/service-category/:id/detail',
    component: ServiceCategoryForm
  },
  {
    name:'create-service-category',
    path: '/service-category/add',
    component: ServiceCategoryForm
  },
  {
    name:'service-categories',
    path: '/service-categories',
    component: ServiceCategories
  },
  {
    name:'service-attribute',
    path: '/services/:id/attribute',
    component: ServiceAttribute
  },
  {
    name:'service-detail',
    path: '/services/:id/detail',
    component: ServiceDetail
  },
  {
    name:'create-service',
    path: '/services/add',
    component: ServiceForm
  },
  {
    name:'services',
    path: '/services',
    component: Services
  },
  {
    name:'view-prescription',
    path: '/prescriptions/:id',
    component: PrescriptionView
  },
  {
    name:'create-prescription',
    path: '/prescription',
    component: PrescriptionForm
  },
  {
    name:'prescriptions',
    path: '/prescriptions',
    component: Prescription
  },
  {
    name:'edit-medicine',
    path: '/medicines/:id/detail',
    component: MedicineForm
  },
  {
    name:'create-medicine',
    path: '/medicines/add',
    component: MedicineForm
  },
  {
    name:'medicines',
    path: '/medicines',
    component: Medicine
  },
  {
    name:'serviceRecords',
    path: '/service-records',
    component: ServiceRecords
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
