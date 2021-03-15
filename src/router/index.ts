import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import HealthCenter from '../views/HealthCenter.vue'
import Employees from '../views/Employees.vue'
import Patients from '../views/Patient/Patients.vue'
import PatientForm from '../views/Patient/PatientForm.vue'
import PatientDetail from '../views/Patient/PatientDetail.vue'
import ServiceCategories from '../views/ServiceCategories.vue'
import Prescription from '../views/Prescription/Prescription.vue'
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
    name:'prescription',
    path: '/prescription',
    component: Prescription
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
