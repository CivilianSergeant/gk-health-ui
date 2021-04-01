import { RouteConfig } from "vue-router";
import LabTest from "@/views/LabTest/LabTest.vue";
import LabTestForm from "@/views/LabTest/LabTestForm.vue";
import LabTestView from "@/views/LabTest/LabTestView.vue";

const labTestRoutes: Array<RouteConfig> = [
    
    {
        name:'view-labtest',
        path: '/lab-test/:id',
        component: LabTestView
    },
    {
        name:'create-labtestreport',
        path: '/lab-tests/add',
        component: LabTestForm
    },
    {
        name:'lab-tests',
        path: '/lab-tests/',
        component: LabTest
    },
]

export default labTestRoutes;