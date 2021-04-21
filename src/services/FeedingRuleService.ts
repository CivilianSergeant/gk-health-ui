import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import store from '@/store';
import axios from 'axios';

export class FeedingRuleService{

    private feedingRules: Record<string, any>[] = [];

    async getFeedingRules(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_FEEDING_RULES),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                
                response.data.collection.map((obj: Record<string, any>)=>{
                    this.feedingRules.push(obj)
                });
            }
            return this.feedingRules;
        }catch(error){
            handleException(error);
        }
    }
}