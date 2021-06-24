import { Patient } from '@/entity/Patient';
import { GetApiRoute, ApiRoutes, setAuthorizationToken, handleException } from '@/helpers/ApiRoutes';
import store from '@/store';
import axios from 'axios';

export class PatientInvoiceService{
    private response: any;

    async saveInvoice(payload: Record<string, any>): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.PATIENT_INVOICE_CREATE),payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }

    async getInvoiceNumbers(searchText: string): Promise<any>{

        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.PATIENT_INVOICE_NUMBERS_BY_KEYWORD,
                searchText),setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){  
            handleException(error);
        }
    }

    async getPrescriptionInvoiceNumbers(): Promise<any>{

        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.PRESCRIPTION_INVOICE_NUMBERS),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data.collection;
            }
            return this.response;
        }catch(error){  
            handleException(error);
        }
    }

    async getLabTestInvoiceNumbers(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_LAB_TEST_INVOICE_NUMBERS),
            setAuthorizationToken(auth.token));

            if(response.status == 200) {
                this.response = response.data.collection;
            }

        } catch(e){
            handleException(e);
        }

        return this.response;
    }

    async getInvoiceById(id: string): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.PATIENT_INVOICE_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }
}