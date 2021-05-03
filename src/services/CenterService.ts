import axios from 'axios'
import { Center } from '@/entity/Center';
import { GetApiRoute, ApiRoutes, setAuthorizationToken, handleException } from '@/helpers/ApiRoutes';
import store from '@/store';

export class CenterService {


    private centers: Center[] = [];
    private center!: Center;

    async getCentersWithPagination(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.CENTER_LIST)
            + `?thirdLevel=${q.center}&name=${q.name}&code=${q.code}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));
            if(result.status == 200){
                this.centers = result.data.object;
            }
            return this.centers;
        }catch(error){
            handleException(error);
        }
    }

    async getCenters(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.ALL_CENTERS),setAuthorizationToken(auth.token));
            if(result.status == 200){
                result.data.map((obj: Center) =>this.centers.push(obj));
            }
            return this.centers;
        }catch(error){
            handleException(error);
        }
    }

    async getCentersByKeyword(keyword: string): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.GET_CENTERS_BY_KEYWORD,keyword),
            setAuthorizationToken(auth.token));
            if(result.status == 200){
                this.centers = result.data.collection;
            }
            return this.centers;
        }catch(error){
            handleException(error);
        }

    }

    async getCenterByApiId(id: number): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.CENTER_BY_API_ID,id.toString()),
            setAuthorizationToken(auth.token));
            if(result.status == 200){
                this.center = result.data.object;
            }
            return this.center;
        }catch(error){
            handleException(error);
        }
    }

    async getCentersByOfficeTypeId(id: number): Promise<Center[]>{
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.CENTER_BY_OFFICE_TYPE,id.toString()),
        setAuthorizationToken(auth.token));
        if(result.status == 200){
            this.centers = result.data.collection;
        }
        return this.centers;
    }

    async getRaCenters(): Promise<Center[]>{
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_RA_OFFICE),
        setAuthorizationToken(auth.token));
        if(result.status == 200){
            this.centers = result.data;
        }
        return this.centers;
    }

    async getCentersByThirdLevel(office: any): Promise<Center[]>{
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_HC_OFFICE)+
        `?raOfficeCode=${office.centerCode}`,
        setAuthorizationToken(auth.token));
        if(result.status == 200){
            this.centers = result.data;
        }
        return this.centers;
    }
}