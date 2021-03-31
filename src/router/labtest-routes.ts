import { RouteConfig } from "vue-router";
import LabTest from "@/views/LabTest/LabTest.vue";
import LabTestForm from "@/views/LabTest/LabTestForm.vue";

const labTestRoutes: Array<RouteConfig> = [
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