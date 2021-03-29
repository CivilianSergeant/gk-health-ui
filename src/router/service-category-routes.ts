import { RouteConfig } from "vue-router";
import ServiceCategories from '../views/HealthService/ServiceCategories.vue'
import ServiceCategoryForm from '../views/HealthService/ServiceCategoryForm.vue'

const serviceCategoryRoutes: Array<RouteConfig> = [
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
    }
];

export default serviceCategoryRoutes;