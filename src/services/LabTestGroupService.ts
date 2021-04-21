import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import { LabTestGroup } from '@/entity/LabTestGroup';
import axios from 'axios';
import store from '@/store';

export class LabTestGroupService{
    private groups: LabTestGroup[] = [];

    async getLabTestGroups(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.ALL_LAB_TEST_GROUP),
            setAuthorizationToken(auth.token));
            if(result.status == 200){
                result.data.map((obj: LabTestGroup) =>this.groups.push(obj));
            }
            return this.groups;
        }catch(error){
            handleException(error);
        }
    }
}