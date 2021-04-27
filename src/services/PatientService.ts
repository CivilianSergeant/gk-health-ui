import { Patient } from '@/entity/Patient';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import store from '@/store';

export class PatientService{

    private response: any=null;

    async getPatients(clientId: number, field: string, value: string, 
            page: number,size: number, sortBy: string, sortDesc: boolean): Promise<any>{
        const auth = store.getters.auth;
        try{
            const urlParams = `?centerId=${clientId}${(field)?'&field='+field:''}&value=${value}&page=${page}&size=${size}&sortBy=${sortBy}&sortDesc=${sortDesc}`;
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_PATIENTS)+urlParams,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data.object;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }

    async getPatientById(id: number, callback: Function): Promise<any>{
        
        const auth = store.getters.auth;
        
        try{
        const response = await axios.get(
            GetApiRoute(ApiRoutes.GET_PATIENT_BY_ID, id.toString()),setAuthorizationToken(auth.token));
          if (response.status == 200) {
            callback(response.data);
          }
          console.log(response);
        }catch(error){
            handleException(error);
        }
    }

    async getPatientByPid(pid: string): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENT_BY_PID,pid),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }

    async getPatientIdsByPid(pid: string): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENTIDS_BY_PID,pid),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }

    async cardRegistration(payload: Record<string, any>): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.PATIENT_CARD_REGISTRATION),payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.response = response.data;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }

    async addPatient(formRequest: Record<string,any>): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_PATIENT),formRequest,
            setAuthorizationToken(auth.token));
            return response;
        }catch(error){
            handleException(error);
        }
    }

    async addPatientFromCardMember(formRequest: Record<string,any>): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.post(GetApiRoute(ApiRoutes.ADD_PATIENT_FROM_CARD_MEMBER),formRequest,
            setAuthorizationToken(auth.token));
            if(result.status==200){
                this.response = result.data.object;
            }
            return this.response;
        }catch(error){
            handleException(error);
        }
    }
}