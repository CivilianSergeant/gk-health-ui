import { RouteConfig } from "vue-router";
import Patients from '@/views/Patient/Patients.vue'
import PatientForm from '@/views/Patient/PatientForm.vue'
import PatientDetail from '@/views/Patient/PatientDetail.vue'

const patientRoutes: Array<RouteConfig> = [
    {
        name:'patient-create',
        path: '/patients/add',
        component: PatientForm
    },
    {
        path: '/patients/:id',
        component: PatientDetail
    },
    {
        path: '/patients/:id/edit',
        component: PatientForm
    },
    {
        name:'patients',
        path: '/patients',
        component: Patients
    }
];

export default patientRoutes;