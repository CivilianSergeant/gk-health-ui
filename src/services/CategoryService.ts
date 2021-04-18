import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import { Category } from '@/entity/Category';
import store from '@/store';

export class CategoryService{

    private categories: Category[] = [];
    private serviceCategory = {}

    async getCategories(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_CATEGORIES),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                response.data.map((obj: Category)=>{
                    this.categories.push(obj)
                });
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