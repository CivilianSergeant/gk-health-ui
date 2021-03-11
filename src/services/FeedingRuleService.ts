import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';

export class FeedingRuleService{

    private feedingRules: Record<string, any>[] = [];

    async getFeedingRules(): Promise<Record<string, any>[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_FEEDING_RULES));
        if(response.status == 200){
            
            response.data.collection.map((obj: Record<string, any>)=>{
                this.feedingRules.push(obj)
            });
        }
        return this.feedingRules;
    }
}