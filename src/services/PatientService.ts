import { Patient } from '@/entity/Patient';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class PatientService{

    private response: any=null;

    async getPatients(clientId: number, field: string, value: string, page: number,size: number): Promise<Patient[]>{
        const urlParams = `?centerId=${clientId}${(field)?'&field='+field:''}&value=${value}&page=${page}&size=${size}`;
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_PATIENTS)+urlParams);
        if(response.status == 200){
           this.response = response.data.object;
        }
        return this.response;
    }

    async getPatientByPid(pid: string): Promise<Patient>{
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENT_BY_PID,pid));
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }

    async getPatientIdsByPid(pid: string): Promise<Patient>{
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENTIDS_BY_PID,pid));
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }

    async cardRegistration(payload: Record<string, any>): Promise<Patient>{
        const response = await axios.post(GetApiRoute(ApiRoutes.PATIENT_CARD_REGISTRATION),payload);
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }

    async addPatient(formRequest: Record<string,any>): Promise<Record<string,any>>{
        return await axios.post(GetApiRoute(ApiRoutes.ADD_PATIENT),formRequest);
    }

    async addPatientFromCardMember(formRequest: Record<string,any>): Promise<Record<string,any>>{
        const result = await axios.post(GetApiRoute(ApiRoutes.ADD_PATIENT_FROM_CARD_MEMBER),formRequest);
        if(result.status==200){
            this.response = result.data.object;
        }
        return this.response;
    }
}