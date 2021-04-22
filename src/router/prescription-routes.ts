import { RouteConfig } from "vue-router";
import PrescriptionForm from '../views/Prescription/PrescriptionForm.vue'
import Prescription from '../views/Prescription/Prescription.vue'
import PrescriptionView from '../views/Prescription/PrescriptionView.vue'

const prescriptionRoutes: Array<RouteConfig> = [
    {
        name:'Prescriiption Detail',
        path: '/prescriptions/:patientId/:invoiceId',
        component: PrescriptionView
    },
    
    {
        name:'Prescription Detail',
        path: '/prescriptions/:id',
        component: PrescriptionView
    },
    {
        name:'Create Prescription',
        path: '/prescription',
        component: PrescriptionForm
    },
    {
        name:'Prescriptions',
        path: '/prescriptions',
        component: Prescription
    }
];

export default prescriptionRoutes;