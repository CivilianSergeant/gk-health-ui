import { RouteConfig } from "vue-router";
import {Services,ServiceForm, ServiceDetail, ServiceAttribute }from '../views/HealthService'

const healthServiceRoutes: Array<RouteConfig> = [
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
      }
];

export default healthServiceRoutes;