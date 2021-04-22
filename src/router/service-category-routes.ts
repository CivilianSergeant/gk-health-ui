import { RouteConfig } from "vue-router";
import ServiceCategories from '../views/HealthService/ServiceCategories.vue'
import ServiceCategoryForm from '../views/HealthService/ServiceCategoryForm.vue'

const serviceCategoryRoutes: Array<RouteConfig> = [
    {
        name:'Edit Service Category',
        path: '/service-categories/:id/detail',
        component: ServiceCategoryForm
    },
    {
        name:'Create Service Category',
        path: '/service-categories/add',
        component: ServiceCategoryForm
    },
    {
        name:'Service Categories',
        path: '/service-categories',
        component: ServiceCategories
    }
];

export default serviceCategoryRoutes;