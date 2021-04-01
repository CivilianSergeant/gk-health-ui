import { LabTest } from '@/entity/LabTest';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class LabTestService {

    private labTest!: LabTest;
    private labTests: Record<string, any>[] = [];

    async saveLabTest(labTest: LabTest): Promise<Record<string,any>>{
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_LAB_TEST),labTest);
        if(response.status == 200){
            this.labTest = response.data.object;
        }
        return this.labTest;
    }

    async getLabTests(): Promise<Record<string, any>[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_LAB_TEST_ALL));
        if(response.status==200){
            this.labTests = response.data.collection;
        }
 
        return this.labTests;
     }

     async getLabTestById(id: number): Promise<Record<string, any>> {
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_LAB_TEST_BY_ID,id.toString()));
        if(response.status == 200){
            this.labTest = response.data.object;
        }
        return this.labTest;
    }
}