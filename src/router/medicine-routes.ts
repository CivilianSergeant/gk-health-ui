import { RouteConfig } from "vue-router";
import Medicine from '../views/Medicine/Medicine.vue'
import MedicineBrand from '../views/Medicine/MedicineBrand.vue'
import MedicineBrandForm from '../views/Medicine/MedicineBrandForm.vue'
import MedicineGroup from '../views/Medicine/MedicineGroup.vue'
import MedicineGroupForm from '../views/Medicine/MedicineGroupForm.vue'
import MedicineForm from '../views/Medicine/MedicineForm.vue'

const medicineRoutes: Array<RouteConfig> = [
      {
        name:'Medicine Brands',
        path: '/medicine-brands',
        component: MedicineBrand
      },
      {
        name:'Add Medicine Brand',
        path: '/medicine-brands/add',
        component: MedicineBrandForm
      },
      {
        name:'Medicine Brand Detail',
        path: '/medicine-brands/:id/detail',
        component: MedicineBrandForm
      },
      {
        name:'Medicine Groups',
        path: '/medicine-groups',
        component: MedicineGroup
      },
      {
        name:'Medicine Group Detail',
        path: '/medicine-groups/:id/detail',
        component: MedicineGroupForm
      },
      {
        name:'Add Medicine Group',
        path: '/medicine-groups/add',
        component: MedicineGroupForm
      },
      
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