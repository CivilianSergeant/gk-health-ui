import { RouteConfig } from "vue-router";
import Medicine from '../views/Medicine/Medicine.vue'
import MedicineForm from '../views/Medicine/MedicineForm.vue'

const medicineRoutes: Array<RouteConfig> = [
    {
        name:'Edit Medicine',
        path: '/medicines/:id/detail',
        component: MedicineForm
      },
      {
        name:'Create Medicine',
        path: '/medicines/add',
        component: MedicineForm
      },
      {
        name:'Medicines',
        path: '/medicines',
        component: Medicine
      },
];

export default medicineRoutes;