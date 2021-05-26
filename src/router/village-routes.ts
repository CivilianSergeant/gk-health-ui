import { RouteConfig } from "vue-router";
import Villages from "@/views/Village/Villages.vue";
import VillageForm from "@/views/Village/VillageForm.vue";
//import VillageView from "@/views/Village/VillageView.vue";

const VillageRoutes: Array<RouteConfig> = [
    {
        name: 'Create Village',
        path: '/villages/add',
        component: VillageForm
    },
    
    {
        name: 'Village List',
        path: '/villages',
        component: Villages
    },
]

export default VillageRoutes;