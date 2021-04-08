import { RouteConfig } from "vue-router";
import LabTest from "@/views/LabTest/LabTest.vue";
import LabTestForm from "@/views/LabTest/LabTestForm.vue";
import LabTestView from "@/views/LabTest/LabTestView.vue";

const labTestRoutes: Array<RouteConfig> = [
    {
        name: 'create-labtestreport',
        path: '/lab-tests/add',
        component: LabTestForm
    },
    {
        name: 'view-labtest-report',
        path: '/lab-tests/:patientId/:invoiceId/:serviceId',
        component: LabTestView
    },
    {
        name: 'edit-labtest',
        path: '/lab-tests/edit/:id',
        component: LabTestForm
    },
    {
        name: 'view-labtest',
        path: '/lab-tests/:id',
        component: LabTestView
    },
    
    {
        name: 'lab-tests',
        path: '/lab-tests/',
        component: LabTest
    },
]

export default labTestRoutes;