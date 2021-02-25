import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import { LabTestGroup } from '@/entity/LabTestGroup';
import axios from 'axios';

export class LabTestGroupService{
    private groups: LabTestGroup[] = [];

    async getLabTestGroups(): Promise<LabTestGroup[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_LAB_TEST_GROUP));
        if(result.status == 200){
            result.data.map((obj: LabTestGroup) =>this.groups.push(obj));
        }
        return this.groups;
    }
}