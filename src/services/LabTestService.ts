import { LabTest } from '@/entity/LabTest';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import store from '@/store';

export class LabTestService {

    private labTest!: LabTest;
    private labTests: Record<string, any>[] = [];

    async saveLabTest(labTest: Record<string, any>): Promise<any> {
        const auth = store.getters.auth;
        try{
            let response = null;
            if (labTest.id != null) {
                response = await axios.put(GetApiRoute(ApiRoutes.ADD_LAB_TEST), labTest,
                setAuthorizationToken(auth.token));
            } else {
                response = await axios.post(GetApiRoute(ApiRoutes.ADD_LAB_TEST), labTest,
                setAuthorizationToken(auth.token));
            }
            if (response.status == 200) {
                this.labTest = response.data.object;
            }

            return this.labTest;
        }catch(error){
            handleException(error);
        }
    }

    async getLabTests(): Promise<any> {
        
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_LAB_TEST_ALL),
            setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.labTests = response.data.collection;
            }

            return this.labTests;
        }catch(error){
            handleException(error);
        }
    }

    async getLabTestById(id: number): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_LAB_TEST_BY_ID, id.toString()),
            setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.labTest = response.data.object;
            }
            return this.labTest;
        }catch(error){
            handleException(error);
        }
    }

    async getLabTestByPatientInvoiceService(patientId: number, 
            invoiceId: number, serviceId: number): Promise<any> {

        const auth = store.getters.auth;
        
        try{
            const route = ApiRoutes.GET_LAB_TEST_BY_PATIENT_INVOICE_SERVICE.replace(":patientId", patientId.toString())
                .replace(":invoiceId", invoiceId.toString())
                .replace(":serviceId", serviceId.toString())
            const response = await axios.get(GetApiRoute(route),setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.labTest = response.data.object;
            }
            return this.labTest;
        }catch(error){
            handleException(error);
        }
    }
}