import { Prescription } from '@/entity/Prescription';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import store from '@/store';

export class PrescriptionService{

    private prescription!: Prescription;
    private prescriptions!: Prescription[];

    async savePrescription(prescription: Prescription): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_PRESCRIPTION),prescription,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.prescription = response.data.object;
            }
            return this.prescription;
        }catch(error){
            handleException(error);
        }
    }

    async getPrescriptions(q: any): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_PRESCRIPTION)
            +`?page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.prescriptions = response.data.object;
            }
            return this.prescriptions;
        }catch(error){
            handleException(error);
        }
    }

    async getPrescriptionById(id: number): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_PRESCRIPTION_BY_ID,id.toString()),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.prescription = response.data.object;
            }
            return this.prescription;
        }catch(error){
            handleException(error);
        }
    }

    async getPrescriptionByPatientAndInvoice(patientId: number,invoiceId: number): Promise<any> {
        const auth = store.getters.auth;
        try{
            const route = ApiRoutes.GET_PRESCRIPTION_PATIENT_AND_INVOICE.replace(":patientId",patientId.toString())
                                    .replace(":invoiceId",invoiceId.toString());
            const response = await axios.get(GetApiRoute(route),setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.prescription = response.data.object;
            }
            return this.prescription;
        }catch(error){
            handleException(error);
        }
    }
}