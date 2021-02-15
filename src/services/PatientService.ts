import { Patient } from '@/entity/Patient';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class PatientService{

    private response: any=null;

    async getPatients(page: number,size: number): Promise<Patient[]>{

        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_PATIENTS)+'?page='+page+'&size='+size);
        if(response.status == 200){
           this.response = response.data;
        }
        return this.response;
    }

    async getPatientByPid(pid: string): Promise<Patient[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENT_BY_PID,pid));
        if(response.status == 200){
            this.response = response.data;
         }
        return this.response;
    }
}