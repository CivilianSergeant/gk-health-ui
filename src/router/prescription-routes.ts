import { RouteConfig } from "vue-router";
import PrescriptionForm from '../views/Prescription/PrescriptionForm.vue'
import Prescription from '../views/Prescription/Prescription.vue'
import PrescriptionView from '../views/Prescription/PrescriptionView.vue'

const prescriptionRoutes: Array<RouteConfig> = [
    {
        name:'view-prescription-by-patient-invoice',
        path: '/prescriptions/:patientId/:invoiceId',
        component: PrescriptionView
    },
    
    {
        name:'view-prescription',
        path: '/prescriptions/:id',
        component: PrescriptionView
    },
    {
        name:'create-prescription',
        path: '/prescription',
        component: PrescriptionForm
    },
    {
        name:'prescriptions',
        path: '/prescriptions',
        component: Prescription
    }
];

export default prescriptionRoutes;