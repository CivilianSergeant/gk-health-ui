import { RouteConfig } from "vue-router";
import LabTest from "@/views/LabTest/LabTest.vue";
import LabTestForm from "@/views/LabTest/LabTestForm.vue";
import LabTestView from "@/views/LabTest/LabTestView.vue";

const labTestRoutes: Array<RouteConfig> = [
    {
        name: 'Create Lab Test Report',
        path: '/lab-tests/add',
        component: LabTestForm
    },
    {
        name: 'View Lab Test Report',
        path: '/lab-tests/:patientId/:invoiceId/:serviceId',
        component: LabTestView
    },
    {
        name: 'Edit Lab Test',
        path: '/lab-tests/edit/:id',
        component: LabTestForm
    },
    {
        name: 'View Lab Test',
        path: '/lab-tests/:id',
        component: LabTestView
    },
    
    {
        name: 'Lab Tests',
        path: '/lab-tests/',
        component: LabTest
    },
]

export default labTestRoutes;