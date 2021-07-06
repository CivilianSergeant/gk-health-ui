import { RouteConfig } from "vue-router";
import OperationCategory from '@/views/Operation/OperationCategory.vue';
import OperationCategoryForm from '@/views/Operation/OperationCategoryForm.vue';
import OperationPackage from '@/views/Operation/OperationPackage.vue';
import OperationPackageForm from '@/views/Operation/OperationPackageForm.vue';

const operationRoutes: Array<RouteConfig> = [
    {
        name: "Operation Category",
        path: "/operation-category",
        component: OperationCategory
    },
    {
        name: "Detail Operation Category",
        path: "/operation-category/:id/detail",
        component: OperationCategoryForm
    },
    {
        name: "Add Operation Category",
        path: "/operation-category/add",
        component: OperationCategoryForm
    },
    {
        name: 'Operation Package',
        path: '/operation-package',
        component: OperationPackage
    },
    {
        name: "Detail Operation Package",
        path: "/operation-package/:id/detail",
        component: OperationPackageForm
    },
    {
        name: "Add Operation Package",
        path: "/opertion-package/add",
        component: OperationPackageForm
    },

];

export default operationRoutes;