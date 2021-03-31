import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class SpecimenService{

    private specimens: Record<string,any>[] = [];


    async getSpecimens(): Promise<Record<string,any>>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_SPECIMENS));
        if(response.status == 200){
            this.specimens = response.data.collection;
        }
        return this.specimens;
    }
}