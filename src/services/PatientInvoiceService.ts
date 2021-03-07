import { Patient } from '@/entity/Patient';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';

export class PatientInvoiceService{
    private response: any;

    async saveInvoice(payload: Record<string, any>): Promise<Patient>{
        const response = await axios.post(GetApiRoute(ApiRoutes.PATIENT_INVOICE_CREATE),payload);
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }

    async getInvoiceNumbers(searchText: string): Promise<any>{
        const response = await axios.get(GetApiRoute(ApiRoutes.PATIENT_INVOICE_NUMBERS_BY_KEYWORD,searchText));
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }

    async getInvoiceById(id: string): Promise<any>{
        const response = await axios.get(GetApiRoute(ApiRoutes.PATIENT_INVOICE_BY_ID,id));
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }
}