import { LabTest } from '@/entity/LabTest';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class LabTestService {

    private labTest!: LabTest;

    async saveLabTest(labTest: LabTest): Promise<Record<string,any>>{
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_LAB_TEST),labTest);
        if(response.status == 200){
            this.labTest = response.data.object;
        }
        return this.labTest;
    }
}