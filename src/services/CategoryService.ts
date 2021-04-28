import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import { Category } from '@/entity/Category';
import store from '@/store';

export class CategoryService{

    private categories: Category[] = [];
    private serviceCategory = {}

    async addServiceCategory(payload: Record<string,any>, callback: Function): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_CATEGORY),payload,
            setAuthorizationToken(auth.token));
            
            if(response.status==200){
                callback();
            }
            
            store.commit('finish');
            
        }catch(error){
            handleException(error);
        }
    }

    async getCategories(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_CATEGORIES)
            +`?categoryName=${q.categoryName}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));

            if(response.status == 200){
                this.categories = response.data.object;
            }
            return this.categories;
        }catch(error){
            handleException(error);
        }
    }

    async getServiceCategoryById(id: number): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_SERVICIE_CATEGORY_BY_ID,id.toString()),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.serviceCategory = response.data.object;
            }
            return this.serviceCategory;
        }catch(error){
            handleException(error);
        }
    }
}