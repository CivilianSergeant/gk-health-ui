import { Prescription } from '@/entity/Prescription';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class PrescriptionService{

    private prescription!: Prescription;
    private prescriptions!: Prescription[];

    async savePrescription(prescription: Prescription): Promise<Record<string, any>>{
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_PRESCRIPTION),prescription);
        if(response.status == 200){
            this.prescription = response.data.object;
        }
        return this.prescription;
    }

    async getPrescriptions(page: number,size: number): Promise<Record<string, any>[]> {
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_PRESCRIPTION)+'?page='+page+'&size='+size);
        if(response.status == 200){
            this.prescriptions = response.data.collection;
        }
        return this.prescriptions;
    }

    async getPrescriptionById(id: number): Promise<Record<string, any>> {
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_PRESCRIPTION_BY_ID,id.toString()));
        if(response.status == 200){
            this.prescription = response.data.object;
        }
        return this.prescription;
    }

    async getPrescriptionByPatientAndInvoice(patientId: number,invoiceId: number): Promise<Record<string, any>> {
        const route = ApiRoutes.GET_PRESCRIPTION_PATIENT_AND_INVOICE.replace(":patientId",patientId.toString())
                                .replace(":invoiceId",invoiceId.toString());
        const response = await axios.get(GetApiRoute(route));
        if(response.status == 200){
            this.prescription = response.data.object;
        }
        return this.prescription;
    }
}