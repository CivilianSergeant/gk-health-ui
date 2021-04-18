import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import store from '@/store';

export class SpecimenService{

    private specimens: Record<string,any>[] = [];


    async getSpecimens(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_SPECIMENS),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.specimens = response.data.collection;
            }
            return this.specimens;
        }catch(error){
            handleException(error);
        }
    }
}