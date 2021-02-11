import axios from 'axios'
import { Center } from '@/entity/Center';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class CenterService {

    private centers: Center[] = [];

    async getCenters(): Promise<Center[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_CENTERS));
        if(result.status == 200){
            result.data.map((obj: Center) =>this.centers.push(obj));
        }
        return this.centers;
    }
}