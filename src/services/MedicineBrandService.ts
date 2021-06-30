import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class MedicineBrandService{

    private medicineBrands: Record<string, any>[] = [];
    private medicineBrand: any;

    async getMedicineBrandById(id: string): Promise<any>{

        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_MEDICINE_BRAND_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineBrand = response.data.object;
            }

            return this.medicineBrand;
        }catch(error){
            handleException(error);
        }
    }

    async addMedicineBrand(payload: Record<string, any>, callback: Function): Promise<any> {
        
        const auth = store.getters.auth;

        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_MEDICINE_BRAND),payload,
            setAuthorizationToken(auth.token));
            if(response.status==200){
                callback();
            }
        }catch(error){
            handleException(error);
        }
            
    }

    async getMedicineBrands(): Promise<any>{
        const auth = store.getters.auth;
       try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_BRAND),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineBrands = response.data.collection;
            }

            return this.medicineBrands;
        }catch(error){
            handleException(error);
        }
    }

    async getMedicineBrandPage(q: any): Promise<any>{
        
        const auth = store.getters.auth;
       try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_BRAND)
                +`/list?name=${q.name}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineBrands = response.data.object;
            }

            return this.medicineBrands;
        }catch(error){
            handleException(error);
        }
    }
}