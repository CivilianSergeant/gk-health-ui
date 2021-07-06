import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class OperationCategoryService{

    private category: any={};
    private categories: any[]=[];

    async getCategories(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            let path = GetApiRoute(ApiRoutes.GET_OPERATION_CATEGORIES);
            path += `?name=${q.name}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status ==200){
                this.category = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.category;
    }

    async getCategoryList(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const path = GetApiRoute(ApiRoutes.GET_OPERATION_CATEGORY_LIST);
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status ==200){
                this.categories = response.data.collection;
            }
        }catch(e){
            handleException(e);
        }

        return this.categories;
    }

    async getById(id: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_OPERATION_CATEGORY_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.category = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.category;
    }

    async addOperationCategory(payload: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_OPERATION_CATEGORY),payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.category = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.category;
    }
}