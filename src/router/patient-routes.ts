import { RouteConfig } from "vue-router";
import Patients from '@/views/Patient/Patients.vue'
import PatientForm from '@/views/Patient/PatientForm.vue'
import PatientDetail from '@/views/Patient/PatientDetail.vue'
import PatientService from '@/views/Patient/PatientService.vue'

const patientRoutes: Array<RouteConfig> = [
    {
        name:'Patient Service Add',
        path: '/patient-service-add',
        component: PatientService
    },
    {
        name:'Create Patient',
        path: '/patients/add',
        component: PatientForm
    },
    {
        name: 'Patient Details',
        path: '/patients/:id',
        component: PatientDetail
    },
    {
        name: 'Edit Patient',
        path: '/patients/:id/edit',
        component: PatientForm
    },
    {
        name:'Patients',
        path: '/patients',
        component: Patients
    }
];

export default patientRoutes;