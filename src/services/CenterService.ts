import axios from 'axios'
import { Center } from '@/entity/Center';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class CenterService {

    private centers: Center[] = [];
    private center!: Center;

    async getCenters(): Promise<Center[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_CENTERS));
        if(result.status == 200){
            result.data.map((obj: Center) =>this.centers.push(obj));
        }
        return this.centers;
    }

    async getCentersByKeyword(keyword: string): Promise<Center[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_CENTERS_BY_KEYWORD,keyword));
        if(result.status == 200){
            this.centers = result.data.collection;
        }
        return this.centers;
    }

    async getCenterByApiId(id: number): Promise<Center>{
        const result = await axios.get(GetApiRoute(ApiRoutes.CENTER_BY_API_ID,id.toString()));
        if(result.status == 200){
            this.center = result.data.object;
        }
        return this.center;
    }
}