import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class EventCategoryService{

    private categories: any[]=[];

    async addEventCatgory(payload: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_EVENT_CATEGORY),payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.categories = response.data.object;
            }
        }catch(e){
            handleException(e);
        }
        return this.categories;
    }

    async getById(id: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_EVENT_CATEGORY_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                return response.data.object;
            }
        }catch(e){
            handleException(e);
        }
    }

    async getEventCategories(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            let path = GetApiRoute(ApiRoutes.GET_EVENT_CATEGORIES);
            path += `?page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.categories = response.data.object;
            }
        }catch(e){
            handleException(e);
        }
        return this.categories;
    }

    async getEventCategoryList(): Promise<any> {
        const auth = store.getters.auth;
        try {
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_EVENT_CATEGORIES),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.categories = response.data.collection;
            }

            
        } catch (error) {
            handleException(error);
        }
        return this.categories;
    }
}