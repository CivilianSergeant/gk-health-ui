import { RouteConfig } from "vue-router";
import Medicine from '../views/Medicine/Medicine.vue'
import MedicineForm from '../views/Medicine/MedicineForm.vue'

const medicineRoutes: Array<RouteConfig> = [
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
];

export default medicineRoutes;