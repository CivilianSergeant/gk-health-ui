import { RouteConfig } from "vue-router";
import {Services,ServiceForm, ServiceDetail, ServiceAttribute }from '../views/HealthService'

const healthServiceRoutes: Array<RouteConfig> = [
    {
        name:'Service Attribute',
        path: '/services/:id/attribute',
        component: ServiceAttribute
      },
      {
        name:'Service Detail',
        path: '/services/:id/detail',
        component: ServiceDetail
      },
      {
        name:'Create Service',
        path: '/services/add',
        component: ServiceForm
      },
      {
        name:'Services',
        path: '/services',
        component: Services
      }
];

export default healthServiceRoutes;